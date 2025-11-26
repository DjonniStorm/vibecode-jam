package com.example.jam_backend.interview.dto;

public class AiAnswerResponse {

    private AiTurnDto previousTurn;
    private AiTurnDto nextTurn;

    public AiTurnDto getPreviousTurn() {
        return previousTurn;
    }

    public void setPreviousTurn(AiTurnDto previousTurn) {
        this.previousTurn = previousTurn;
    }

    public AiTurnDto getNextTurn() {
        return nextTurn;
    }

    public void setNextTurn(AiTurnDto nextTurn) {
        this.nextTurn = nextTurn;
    }
}


