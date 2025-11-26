package com.example.jam_backend.user;

import com.example.jam_backend.interview.Interview;
import com.example.jam_backend.interview.InterviewRepository;
import com.example.jam_backend.interview.InterviewStatus;
import com.example.jam_backend.interview.InterviewType;
import com.example.jam_backend.task.Task;
import com.example.jam_backend.task.TaskRepository;
import com.example.jam_backend.task.TaskStatus;
import com.example.jam_backend.user.dto.UserRegisterRequest;
import com.example.jam_backend.user.dto.UserResponse;
import com.example.jam_backend.user.dto.UserStatsResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final InterviewRepository interviewRepository;
    private final TaskRepository taskRepository;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       InterviewRepository interviewRepository,
                       TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.interviewRepository = interviewRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional
    public UserResponse register(UserRegisterRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email already in use");
        });

        User user = new User();
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setEmail(request.getEmail());
        user.setTelegram(request.getTelegram());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRegisteredAt(LocalDateTime.now());
        user.setRole("USER");

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public UserStatsResponse getCurrentUserStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return buildStatsForUser(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public UserStatsResponse getStatsById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return buildStatsForUser(user);
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setSurname(user.getSurname());
        response.setEmail(user.getEmail());
        response.setTelegram(user.getTelegram());
        response.setRegisteredAt(user.getRegisteredAt());
        return response;
    }

    private UserStatsResponse buildStatsForUser(User user) {
        List<Interview> interviews = interviewRepository.findByUser(user);
        List<Task> tasks = new ArrayList<>();
        for (Interview interview : interviews) {
            tasks.addAll(taskRepository.findByInterview(interview));
        }

        UserStatsResponse stats = new UserStatsResponse();

        stats.setTotalInterviews(interviews.size());
        stats.setManualInterviews((int) interviews.stream()
                .filter(i -> i.getType() == InterviewType.MANUAL)
                .count());
        stats.setAiInterviews((int) interviews.stream()
                .filter(i -> i.getType() == InterviewType.AI)
                .count());

        stats.setInterviewsInProgress((int) interviews.stream()
                .filter(i -> i.getStatus() == InterviewStatus.IN_PROGRESS)
                .count());
        stats.setInterviewsCompleted((int) interviews.stream()
                .filter(i -> i.getStatus() == InterviewStatus.COMPLETED)
                .count());
        stats.setInterviewsCancelled((int) interviews.stream()
                .filter(i -> i.getStatus() == InterviewStatus.CANCELLED)
                .count());

        stats.setTotalTasks(tasks.size());
        stats.setTasksNotStarted((int) tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.NOT_STARTED)
                .count());
        stats.setTasksInProgress((int) tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS)
                .count());
        stats.setTasksDone((int) tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .count());

        // средний балл только по AI-интервью с установленным score
        var aiWithScore = interviews.stream()
                .filter(i -> i.getType() == InterviewType.AI)
                .filter(i -> i.getTotalScore() != null)
                .mapToInt(Interview::getTotalScore);
        if (aiWithScore.count() > 0) {
            int avg = (int) Math.round(aiWithScore.average().orElse(0));
            stats.setAverageAiScore(avg);
        } else {
            stats.setAverageAiScore(null);
        }

        return stats;
    }
}


