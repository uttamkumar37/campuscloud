package com.campuscloud.subscription.repository;

import com.campuscloud.subscription.entity.PlatformPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlatformPaymentRepository extends JpaRepository<PlatformPayment, UUID> {
    List<PlatformPayment> findByTenantIdOrderByCreatedAtDesc(String tenantId);
}
