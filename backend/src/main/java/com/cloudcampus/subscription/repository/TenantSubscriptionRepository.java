package com.cloudcampus.subscription.repository;

import com.cloudcampus.subscription.entity.SubscriptionStatus;
import com.cloudcampus.subscription.entity.TenantSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TenantSubscriptionRepository extends JpaRepository<TenantSubscription, UUID> {
    Optional<TenantSubscription> findTopByTenantIdAndStatusOrderByCreatedAtDesc(String tenantId, SubscriptionStatus status);
    List<TenantSubscription> findByTenantIdOrderByCreatedAtDesc(String tenantId);
    boolean existsByTenantIdAndStatus(String tenantId, SubscriptionStatus status);
    Optional<TenantSubscription> findByGatewayOrderId(String gatewayOrderId);
}
