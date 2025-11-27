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
        interview.setType(request.getType() != null ? request.getType() : InterviewType.MANUAL);
        interview.setCreatedAt(LocalDateTime.now());

        Interview saved = interviewRepository.save(interview);
        // Перезагружаем с user для безопасного маппинга в toResponse
        return toResponse(interviewRepository.findByIdWithUser(saved.getId())
                .orElseThrow(() -> new IllegalArgumentException("Interview not found after save")));
    }

    @Transactional
    public InterviewResponse changeStatus(UUID id, InterviewStatus status) {
        Interview interview = interviewRepository.findByIdWithUser(id)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found"));
        interview.setStatus(status);
        return toResponse(interview);
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getByUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return interviewRepository.findByUserWithUser(user).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public InterviewResponse getById(UUID id) {
        Interview interview = interviewRepository.findByIdWithUser(id)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found"));
        return toResponse(interview);
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getAllPublic() {
        try {
            // Получаем системного пользователя
            User systemUser = userRepository.findByEmail("system@jam.local")
                    .orElse(null);

            if (systemUser == null) {
                return List.of();
            }

            return interviewRepository.findByUserWithUser(systemUser).stream()
                    .map(this::toResponse)
                    .toList();
        } catch (Exception e) {
            // Логируем ошибку и возвращаем пустой список
            e.printStackTrace();
            return List.of();
        }
    }

    private InterviewResponse toResponse(Interview interview) {
        InterviewResponse response = new InterviewResponse();
        response.setId(interview.getId());
        response.setUserId(interview.getUser().getId());
        response.setTitle(interview.getTitle());
        response.setStatus(interview.getStatus());
        response.setType(interview.getType());
        response.setCreatedAt(interview.getCreatedAt());
        return response;
    }
}
