package com.example.jam_backend.interview.dto;

import com.example.jam_backend.interview.InterviewStatus;
import com.example.jam_backend.interview.InterviewType;

import java.time.LocalDateTime;
import java.util.UUID;

public class InterviewResponse {

    private UUID id;
    private UUID userId;
    private String title;
    private InterviewStatus status;
    private InterviewType type;
    private LocalDateTime createdAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public InterviewStatus getStatus() {
        return status;
    }

    public void setStatus(InterviewStatus status) {
        this.status = status;
    }

    public InterviewType getType() {
        return type;
    }

    public void setType(InterviewType type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


