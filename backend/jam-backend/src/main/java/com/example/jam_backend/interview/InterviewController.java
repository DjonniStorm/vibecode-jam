package com.example.jam_backend.interview;

import com.example.jam_backend.interview.dto.InterviewRequest;
import com.example.jam_backend.interview.dto.InterviewResponse;
import com.example.jam_backend.user.UserService;
import com.example.jam_backend.user.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final UserService userService;

    public InterviewController(InterviewService interviewService, UserService userService) {
        this.interviewService = interviewService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> create(@Valid @RequestBody InterviewRequest request) {
        return ResponseEntity.ok(interviewService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getForCurrentUser() {
        UserResponse current = userService.getCurrentUser();
        List<InterviewResponse> userInterviews = interviewService.getByUser(current.getId());
        List<InterviewResponse> publicInterviews = interviewService.getAllPublic();

        // Объединяем интервью пользователя и публичные интервью
        Set<UUID> userInterviewIds = userInterviews.stream()
                .map(InterviewResponse::getId)
                .collect(Collectors.toSet());

        // Добавляем только те публичные интервью, которых нет у пользователя
        List<InterviewResponse> allInterviews = new ArrayList<>(userInterviews);
        if (publicInterviews != null) {
            publicInterviews.stream()
                    .filter(interview -> interview != null && !userInterviewIds.contains(interview.getId()))
                    .forEach(allInterviews::add);
        }

        return ResponseEntity.ok(allInterviews);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InterviewResponse>> getByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(interviewService.getByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(interviewService.getById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<InterviewResponse> changeStatus(@PathVariable UUID id,
            @RequestParam InterviewStatus status) {
        return ResponseEntity.ok(interviewService.changeStatus(id, status));
    }
}
