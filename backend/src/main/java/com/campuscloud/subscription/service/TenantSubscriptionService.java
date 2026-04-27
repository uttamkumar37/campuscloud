package com.campuscloud.subscription.service;

import com.campuscloud.subscription.dto.SubscribeRequest;
import com.campuscloud.subscription.dto.TenantSubscriptionResponse;

import java.util.Optional;

public interface TenantSubscriptionService {
    TenantSubscriptionResponse subscribe(String tenantId, SubscribeRequest request);
    Optional<TenantSubscriptionResponse> getActiveSubscription(String tenantId);
    TenantSubscriptionResponse cancelSubscription(String tenantId);
}
