package com.example.jam_backend.interview;

import com.example.jam_backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface InterviewRepository extends JpaRepository<Interview, UUID> {

    List<Interview> findByUser(User user);

    @Query("SELECT i FROM Interview i JOIN FETCH i.user WHERE i.user = :user")
    List<Interview> findByUserWithUser(@Param("user") User user);

    @Query("SELECT i FROM Interview i JOIN FETCH i.user WHERE i.id = :id")
    java.util.Optional<Interview> findByIdWithUser(@Param("id") UUID id);
}


