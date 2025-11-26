package com.example.jam_backend.task.dto;

import com.example.jam_backend.task.TaskStatus;

public class TaskUpdateRequest {

    private String userResponse;
    private TaskStatus status;
    private String checkResult;

    public String getUserResponse() {
        return userResponse;
    }

    public void setUserResponse(String userResponse) {
        this.userResponse = userResponse;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getCheckResult() {
        return checkResult;
    }

    public void setCheckResult(String checkResult) {
        this.checkResult = checkResult;
    }
}


