package com.cloudcampus.subscription.controller;

import com.cloudcampus.common.api.ApiResponse;
import com.cloudcampus.subscription.dto.SubscriptionPlanCreateRequest;
import com.cloudcampus.subscription.dto.SubscriptionPlanResponse;
import com.cloudcampus.subscription.service.SubscriptionPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/plans")
@RequiredArgsConstructor
@Tag(name = "Subscription Plans", description = "SaaS subscription plan management")
public class SubscriptionPlanController {

    private final SubscriptionPlanService planService;

    @GetMapping
    @Operation(summary = "List all active subscription plans (public)")
    public ResponseEntity<ApiResponse<List<SubscriptionPlanResponse>>> getPlans() {
        return ResponseEntity.ok(ApiResponse.success("Plans fetched successfully", planService.getAllActivePlans()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get subscription plan by ID",
            parameters = @Parameter(name = "Authorization", description = "Bearer JWT token", required = true))
    public ResponseEntity<ApiResponse<SubscriptionPlanResponse>> getPlan(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Plan fetched successfully", planService.getPlanById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create a new subscription plan (Super Admin only)",
            parameters = @Parameter(name = "Authorization", description = "Bearer JWT token", required = true))
    public ResponseEntity<ApiResponse<SubscriptionPlanResponse>> createPlan(
            @Valid @RequestBody SubscriptionPlanCreateRequest request) {
        SubscriptionPlanResponse response = planService.createPlan(request);
        return ResponseEntity.ok(ApiResponse.success("Plan created successfully", response));
    }
}
