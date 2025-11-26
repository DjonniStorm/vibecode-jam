package com.example.jam_backend.common;

import java.time.LocalDateTime;
import java.util.List;

public class ApiError {

    private LocalDateTime timestamp = LocalDateTime.now();
    private int status;
    private String error;
    private String message;
    private List<ApiFieldError> fieldErrors;

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ApiFieldError> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(List<ApiFieldError> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
}


