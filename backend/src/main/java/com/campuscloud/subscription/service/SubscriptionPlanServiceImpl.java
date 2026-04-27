package com.campuscloud.subscription.service;

import com.campuscloud.subscription.dto.SubscriptionPlanCreateRequest;
import com.campuscloud.subscription.dto.SubscriptionPlanResponse;
import com.campuscloud.subscription.entity.SubscriptionPlan;
import com.campuscloud.subscription.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository planRepository;

    @Override
    @Transactional
    public SubscriptionPlanResponse createPlan(SubscriptionPlanCreateRequest request) {
        String name = request.name().trim().toUpperCase();
        if (planRepository.existsByName(name)) {
            throw new IllegalArgumentException("A plan named '" + name + "' already exists");
        }

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName(name);
        plan.setPrice(request.price());
        plan.setBillingCycleDays(request.billingCycleDays());
        plan.setMaxStudents(request.maxStudents());
        plan.setMaxTeachers(request.maxTeachers());
        plan.setDescription(request.description());
        plan.setActive(true);
        plan.setFeatures(request.features());

        SubscriptionPlan saved = planRepository.save(plan);
        log.info("Subscription plan created: name={}", saved.getName());
        return map(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionPlanResponse> getAllActivePlans() {
        return planRepository.findByActiveTrue().stream().map(this::map).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionPlanResponse getPlanById(UUID id) {
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subscription plan not found: " + id));
        return map(plan);
    }

    SubscriptionPlanResponse map(SubscriptionPlan plan) {
        return new SubscriptionPlanResponse(
                plan.getId(),
                plan.getName(),
                plan.getPrice(),
                plan.getBillingCycleDays(),
                plan.getMaxStudents(),
                plan.getMaxTeachers(),
                plan.getDescription(),
                plan.isActive(),
                plan.getFeatures(),
                plan.getCreatedAt()
        );
    }
}
