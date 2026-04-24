package com.campuscloud.teacher.repository;

import com.campuscloud.teacher.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface TeacherRepository extends JpaRepository<Teacher, UUID> {

    boolean existsByEmployeeNo(String employeeNo);

    boolean existsByEmail(String email);

    long countByActiveTrue();

    List<Teacher> findTop5ByOrderByCreatedAtDesc();

    long countByCreatedAtAfter(Instant createdAt);
}
