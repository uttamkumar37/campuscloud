package com.cloudcampus.subscription.controller;

import com.cloudcampus.common.api.ApiResponse;
import com.cloudcampus.subscription.dto.InitiatePaymentResponse;
import com.cloudcampus.subscription.dto.SubscribeRequest;
import com.cloudcampus.subscription.dto.TenantSubscriptionResponse;
import com.cloudcampus.subscription.service.TenantSubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
@Tag(name = "Tenant Subscriptions", description = "Manage tenant subscription to SaaS plans")
public class TenantSubscriptionController {

    private final TenantSubscriptionService subscriptionService;

    @PostMapping("/{tenantId}/subscribe")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Subscribe a tenant to a plan",
            parameters = @Parameter(name = "Authorization", description = "Bearer JWT token", required = true))
    public ResponseEntity<ApiResponse<TenantSubscriptionResponse>> subscribe(
            @PathVariable String tenantId,
            @Valid @RequestBody SubscribeRequest request) {
        TenantSubscriptionResponse response = subscriptionService.subscribe(tenantId, request);
        return ResponseEntity.ok(ApiResponse.success("Tenant subscribed successfully", response));
    }

    @PostMapping("/{tenantId}/subscribe/initiate")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Initiate online payment for the tenant's active subscription",
            description = "Creates a Razorpay order and returns checkout parameters for the frontend.",
            parameters = @Parameter(name = "Authorization", description = "Bearer JWT token", required = true))
    public ResponseEntity<ApiResponse<InitiatePaymentResponse>> initiatePayment(
            @PathVariable String tenantId) {
        InitiatePaymentResponse response = subscriptionService.initiatePayment(tenantId);
        return ResponseEntity.ok(ApiResponse.success("Payment order created", response));
    }

    @GetMapping("/{tenantId}/subscription")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get active subscription for a tenant",
            parameters = @Parameter(name = "Authorization", description = "Bearer JWT token", required = true))
    public ResponseEntity<ApiResponse<TenantSubscriptionResponse>> getSubscription(@PathVariable String tenantId) {
        return subscriptionService.getActiveSubscription(tenantId)
                .map(sub -> ResponseEntity.ok(ApiResponse.success("Subscription fetched successfully", sub)))
                .orElse(ResponseEntity.ok(ApiResponse.success("No active subscription found", null)));
    }

    @DeleteMapping("/{tenantId}/subscription")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Cancel active subscription for a tenant",
            parameters = @Parameter(name = "Authorization", description = "Bearer JWT token", required = true))
    public ResponseEntity<ApiResponse<TenantSubscriptionResponse>> cancelSubscription(@PathVariable String tenantId) {
        TenantSubscriptionResponse response = subscriptionService.cancelSubscription(tenantId);
        return ResponseEntity.ok(ApiResponse.success("Subscription cancelled successfully", response));
    }
}
