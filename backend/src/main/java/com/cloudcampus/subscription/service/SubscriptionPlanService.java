package com.cloudcampus.subscription.service;

import com.cloudcampus.subscription.dto.SubscriptionPlanCreateRequest;
import com.cloudcampus.subscription.dto.SubscriptionPlanResponse;

import java.util.List;
import java.util.UUID;

public interface SubscriptionPlanService {
    SubscriptionPlanResponse createPlan(SubscriptionPlanCreateRequest request);
    List<SubscriptionPlanResponse> getAllActivePlans();
    SubscriptionPlanResponse getPlanById(UUID id);
}
