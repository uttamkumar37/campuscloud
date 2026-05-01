package com.cloudcampus.fees.repository;

import com.cloudcampus.fees.entity.FeeAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FeeAssignmentRepository extends JpaRepository<FeeAssignment, UUID> {

    List<FeeAssignment> findAllByStudentId(UUID studentId);
}
