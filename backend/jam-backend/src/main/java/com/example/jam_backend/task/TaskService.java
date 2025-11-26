package com.example.jam_backend.task;

import com.example.jam_backend.interview.Interview;
import com.example.jam_backend.interview.InterviewRepository;
import com.example.jam_backend.task.dto.TaskRequest;
import com.example.jam_backend.task.dto.TaskResponse;
import com.example.jam_backend.task.dto.TaskUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final InterviewRepository interviewRepository;

    public TaskService(TaskRepository taskRepository, InterviewRepository interviewRepository) {
        this.taskRepository = taskRepository;
        this.interviewRepository = interviewRepository;
    }

    @Transactional
    public TaskResponse create(TaskRequest request) {
        Interview interview = interviewRepository.findById(request.getInterviewId())
                .orElseThrow(() -> new IllegalArgumentException("Interview not found"));

        Task task = new Task();
        task.setInterview(interview);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setLanguage(request.getLanguage());
        task.setStatus(TaskStatus.NOT_STARTED);

        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    @Transactional
    public TaskResponse update(UUID id, TaskUpdateRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (request.getUserResponse() != null) {
            task.setUserResponse(request.getUserResponse());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getCheckResult() != null) {
            task.setCheckResult(request.getCheckResult());
        }

        return toResponse(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getByInterview(UUID interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found"));
        return taskRepository.findByInterview(interview).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse getById(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        return toResponse(task);
    }

    private TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setInterviewId(task.getInterview().getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setLanguage(task.getLanguage());
        response.setUserResponse(task.getUserResponse());
        response.setStatus(task.getStatus());
        response.setCheckResult(task.getCheckResult());
        return response;
    }
}


