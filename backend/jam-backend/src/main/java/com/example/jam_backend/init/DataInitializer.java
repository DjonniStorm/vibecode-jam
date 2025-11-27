package com.example.jam_backend.init;

import com.example.jam_backend.interview.Interview;
import com.example.jam_backend.interview.InterviewRepository;
import com.example.jam_backend.interview.InterviewStatus;
import com.example.jam_backend.interview.InterviewType;
import com.example.jam_backend.user.User;
import com.example.jam_backend.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
            InterviewRepository interviewRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.interviewRepository = interviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Создаем системного пользователя для публичных интервью
        User systemUser = userRepository.findByEmail("system@jam.local")
                .orElseGet(() -> {
                    User user = new User();
                    user.setName("System");
                    user.setSurname("User");
                    user.setEmail("system@jam.local");
                    user.setPasswordHash(passwordEncoder.encode("system_password_123"));
                    user.setRegisteredAt(LocalDateTime.now());
                    user.setRole("ADMIN");
                    return userRepository.save(user);
                });

        // Проверяем, есть ли уже интервью для системного пользователя
        List<Interview> existingInterviews = interviewRepository.findByUser(systemUser);
        if (!existingInterviews.isEmpty()) {
            return; // Данные уже инициализированы
        }

        // Создаем публичные AI-интервью (с вопросами)
        createInterview(systemUser, "Java Developer - Middle Level");
        createInterview(systemUser, "Frontend Developer - React");
        createInterview(systemUser, "Python Developer - Data Science");
        createInterview(systemUser, "Full Stack Developer");

        // Создаем AI-интервью с заданиями на код
        createInterview(systemUser, "Java Developer - Code Challenges");
        createInterview(systemUser, "Python Developer - Algorithms & Data Structures");
        createInterview(systemUser, "JavaScript Developer - Frontend Challenges");
        createInterview(systemUser, "Backend Developer - System Design & Code");
    }

    private void createInterview(User user, String title) {
        Interview interview = new Interview();
        interview.setUser(user);
        interview.setTitle(title);
        interview.setStatus(InterviewStatus.IN_PROGRESS);
        interview.setType(InterviewType.AI);
        interview.setCreatedAt(LocalDateTime.now());
        interviewRepository.save(interview);
    }
}
