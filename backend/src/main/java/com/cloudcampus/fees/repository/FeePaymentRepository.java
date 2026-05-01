package com.cloudcampus.fees.repository;

import com.cloudcampus.fees.entity.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface FeePaymentRepository extends JpaRepository<FeePayment, UUID> {

    List<FeePayment> findAllByFeeAssignmentId(UUID feeAssignmentId);

    List<FeePayment> findAllByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    List<FeePayment> findTop8ByOrderByCreatedAtDesc();
}
