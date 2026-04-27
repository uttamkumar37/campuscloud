package com.campuscloud.subscription.service;

import com.campuscloud.subscription.dto.PlatformPaymentResponse;
import com.campuscloud.subscription.dto.RecordPaymentRequest;

import java.util.List;

public interface PlatformPaymentService {
    PlatformPaymentResponse recordPayment(RecordPaymentRequest request);
    List<PlatformPaymentResponse> getPaymentsByTenant(String tenantId);
}
