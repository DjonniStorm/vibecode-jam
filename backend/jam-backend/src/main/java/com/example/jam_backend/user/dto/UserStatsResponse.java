package com.example.jam_backend.user.dto;

public class UserStatsResponse {

    private int totalInterviews;
    private int manualInterviews;
    private int aiInterviews;

    private int interviewsInProgress;
    private int interviewsCompleted;
    private int interviewsCancelled;

    private int totalTasks;
    private int tasksNotStarted;
    private int tasksInProgress;
    private int tasksDone;

    private Integer averageAiScore;

    public int getTotalInterviews() {
        return totalInterviews;
    }

    public void setTotalInterviews(int totalInterviews) {
        this.totalInterviews = totalInterviews;
    }

    public int getManualInterviews() {
        return manualInterviews;
    }

    public void setManualInterviews(int manualInterviews) {
        this.manualInterviews = manualInterviews;
    }

    public int getAiInterviews() {
        return aiInterviews;
    }

    public void setAiInterviews(int aiInterviews) {
        this.aiInterviews = aiInterviews;
    }

    public int getInterviewsInProgress() {
        return interviewsInProgress;
    }

    public void setInterviewsInProgress(int interviewsInProgress) {
        this.interviewsInProgress = interviewsInProgress;
    }

    public int getInterviewsCompleted() {
        return interviewsCompleted;
    }

    public void setInterviewsCompleted(int interviewsCompleted) {
        this.interviewsCompleted = interviewsCompleted;
    }

    public int getInterviewsCancelled() {
        return interviewsCancelled;
    }

    public void setInterviewsCancelled(int interviewsCancelled) {
        this.interviewsCancelled = interviewsCancelled;
    }

    public int getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(int totalTasks) {
        this.totalTasks = totalTasks;
    }

    public int getTasksNotStarted() {
        return tasksNotStarted;
    }

    public void setTasksNotStarted(int tasksNotStarted) {
        this.tasksNotStarted = tasksNotStarted;
    }

    public int getTasksInProgress() {
        return tasksInProgress;
    }

    public void setTasksInProgress(int tasksInProgress) {
        this.tasksInProgress = tasksInProgress;
    }

    public int getTasksDone() {
        return tasksDone;
    }

    public void setTasksDone(int tasksDone) {
        this.tasksDone = tasksDone;
    }

    public Integer getAverageAiScore() {
        return averageAiScore;
    }

    public void setAverageAiScore(Integer averageAiScore) {
        this.averageAiScore = averageAiScore;
    }
}


