package com.campuscloud.subscription.repository;

import com.campuscloud.subscription.entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, UUID> {
    boolean existsByName(String name);
    Optional<SubscriptionPlan> findByNameIgnoreCase(String name);
    List<SubscriptionPlan> findByActiveTrue();
}
