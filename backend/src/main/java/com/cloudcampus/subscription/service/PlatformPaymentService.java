package com.cloudcampus.subscription.service;

import com.cloudcampus.subscription.dto.PlatformPaymentResponse;
import com.cloudcampus.subscription.dto.RecordPaymentRequest;

import java.util.List;

public interface PlatformPaymentService {
    PlatformPaymentResponse recordPayment(RecordPaymentRequest request);
    List<PlatformPaymentResponse> getPaymentsByTenant(String tenantId);
}
