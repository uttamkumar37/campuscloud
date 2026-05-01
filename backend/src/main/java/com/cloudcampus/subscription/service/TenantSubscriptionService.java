package com.cloudcampus.subscription.service;

import com.cloudcampus.subscription.dto.InitiatePaymentResponse;
import com.cloudcampus.subscription.dto.SubscribeRequest;
import com.cloudcampus.subscription.dto.TenantSubscriptionResponse;

import java.util.Optional;

public interface TenantSubscriptionService {
    TenantSubscriptionResponse subscribe(String tenantId, SubscribeRequest request);
    Optional<TenantSubscriptionResponse> getActiveSubscription(String tenantId);
    TenantSubscriptionResponse cancelSubscription(String tenantId);

    /**
     * Create a Razorpay order for the tenant's active subscription and return
     * the checkout parameters the frontend needs to open the payment modal.
     */
    InitiatePaymentResponse initiatePayment(String tenantId);
}
