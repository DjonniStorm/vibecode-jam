package com.example.jam_backend.interview;

import com.example.jam_backend.interview.dto.InterviewRequest;
import com.example.jam_backend.interview.dto.InterviewResponse;
import com.example.jam_backend.user.User;
import com.example.jam_backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;

    public InterviewService(InterviewRepository interviewRepository, UserRepository userRepository) {
        this.interviewRepository = interviewRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public InterviewResponse create(InterviewRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Interview interview = new Interview();
        interview.setUser(user);
        interview.setTitle(request.getTitle());
        interview.setStatus(InterviewStatus.IN_PROGRESS);
        interview.setCreatedAt(LocalDateTime.now());

        Interview saved = interviewRepository.save(interview);
        return toResponse(saved);
    }

    @Transactional
    public InterviewResponse changeStatus(UUID id, InterviewStatus status) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found"));
        interview.setStatus(status);
        return toResponse(interview);
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getByUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return interviewRepository.findByUser(user).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public InterviewResponse getById(UUID id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found"));
        return toResponse(interview);
    }

    private InterviewResponse toResponse(Interview interview) {
        InterviewResponse response = new InterviewResponse();
        response.setId(interview.getId());
        response.setUserId(interview.getUser().getId());
        response.setTitle(interview.getTitle());
        response.setStatus(interview.getStatus());
        response.setCreatedAt(interview.getCreatedAt());
        return response;
    }
}


