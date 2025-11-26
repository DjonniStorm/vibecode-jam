package com.example.jam_backend.task;

import com.example.jam_backend.interview.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByInterview(Interview interview);
}


