package com.example.jam_backend.interview.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class AiInterviewDtos {

    public static class TurnDto {
        private UUID id;
        private int turnNumber;
        private String question;
        private String userAnswer;
        private boolean codeQuestion;
        private String codeLanguage;
        private String evaluation;
        private Integer score;
        private LocalDateTime createdAt;

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public int getTurnNumber() {
            return turnNumber;
        }

        public void setTurnNumber(int turnNumber) {
            this.turnNumber = turnNumber;
        }

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getUserAnswer() {
            return userAnswer;
        }

        public void setUserAnswer(String userAnswer) {
            this.userAnswer = userAnswer;
        }

        public boolean isCodeQuestion() {
            return codeQuestion;
        }

        public void setCodeQuestion(boolean codeQuestion) {
            this.codeQuestion = codeQuestion;
        }

        public String getCodeLanguage() {
            return codeLanguage;
        }

        public void setCodeLanguage(String codeLanguage) {
            this.codeLanguage = codeLanguage;
        }

        public String getEvaluation() {
            return evaluation;
        }

        public void setEvaluation(String evaluation) {
            this.evaluation = evaluation;
        }

        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class AnswerRequest {
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

    public static class AnswerResponse {
        private TurnDto previousTurn;
        private TurnDto nextTurn;

        public TurnDto getPreviousTurn() {
            return previousTurn;
        }

        public void setPreviousTurn(TurnDto previousTurn) {
            this.previousTurn = previousTurn;
        }

        public TurnDto getNextTurn() {
            return nextTurn;
        }

        public void setNextTurn(TurnDto nextTurn) {
            this.nextTurn = nextTurn;
        }
    }
}


