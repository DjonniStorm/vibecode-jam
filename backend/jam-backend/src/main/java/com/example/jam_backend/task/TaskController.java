package com.example.jam_backend.task;

import com.example.jam_backend.task.dto.TaskRequest;
import com.example.jam_backend.task.dto.TaskResponse;
import com.example.jam_backend.task.dto.TaskUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.create(request));
    }

    @GetMapping("/interview/{interviewId}")
    public ResponseEntity<List<TaskResponse>> getByInterview(@PathVariable UUID interviewId) {
        return ResponseEntity.ok(taskService.getByInterview(interviewId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TaskResponse> update(@PathVariable UUID id,
                                               @RequestBody TaskUpdateRequest request) {
        return ResponseEntity.ok(taskService.update(id, request));
    }
}


