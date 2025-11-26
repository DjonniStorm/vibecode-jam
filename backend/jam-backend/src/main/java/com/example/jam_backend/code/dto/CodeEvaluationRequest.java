package com.example.jam_backend.code.dto;

import jakarta.validation.constraints.NotBlank;

public class CodeEvaluationRequest {

    @NotBlank
    private String question;

    @NotBlank
    private String language;

    @NotBlank
    private String code;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}


