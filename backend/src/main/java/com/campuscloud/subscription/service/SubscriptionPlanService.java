package com.campuscloud.subscription.service;

import com.campuscloud.subscription.dto.SubscriptionPlanCreateRequest;
import com.campuscloud.subscription.dto.SubscriptionPlanResponse;

import java.util.List;
import java.util.UUID;

public interface SubscriptionPlanService {
    SubscriptionPlanResponse createPlan(SubscriptionPlanCreateRequest request);
    List<SubscriptionPlanResponse> getAllActivePlans();
    SubscriptionPlanResponse getPlanById(UUID id);
}
