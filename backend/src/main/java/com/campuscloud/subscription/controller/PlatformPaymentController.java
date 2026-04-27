package com.campuscloud.subscription.controller;

import com.campuscloud.common.api.ApiResponse;
import com.campuscloud.subscription.dto.PlatformPaymentResponse;
import com.campuscloud.subscription.dto.RecordPaymentRequest;
import com.campuscloud.subscription.service.PlatformPaymentService;
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

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Platform Payments", description = "SaaS subscription payment records")
public class PlatformPaymentController {

    private final PlatformPaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Record a subscription payment",
            parameters = @Parameter(name = "Authorization", description = "Bearer JWT token", required = true))
    public ResponseEntity<ApiResponse<PlatformPaymentResponse>> recordPayment(
            @Valid @RequestBody RecordPaymentRequest request) {
        PlatformPaymentResponse response = paymentService.recordPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment recorded successfully", response));
    }

    @GetMapping("/tenant/{tenantId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get all payments for a tenant",
            parameters = @Parameter(name = "Authorization", description = "Bearer JWT token", required = true))
    public ResponseEntity<ApiResponse<List<PlatformPaymentResponse>>> getPayments(@PathVariable String tenantId) {
        List<PlatformPaymentResponse> payments = paymentService.getPaymentsByTenant(tenantId);
        return ResponseEntity.ok(ApiResponse.success("Payments fetched successfully", payments));
    }
}
