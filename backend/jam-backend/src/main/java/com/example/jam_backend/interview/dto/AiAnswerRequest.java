package com.example.jam_backend.interview.dto;

import java.util.UUID;

public class AiAnswerRequest {

    private UUID turnId;
    private String answer;

    public UUID getTurnId() {
        return turnId;
    }

    public void setTurnId(UUID turnId) {
        this.turnId = turnId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}


