package com.cloudcampus.fees.service;

import com.cloudcampus.fees.dto.FeeAssignmentCreateRequest;
import com.cloudcampus.fees.dto.FeeAssignmentResponse;
import com.cloudcampus.fees.dto.FeePaymentCreateRequest;
import com.cloudcampus.fees.dto.FeePaymentResponse;

import java.util.List;
import java.util.UUID;

public interface FeesService {

    FeeAssignmentResponse createFeeAssignment(FeeAssignmentCreateRequest request);

    FeePaymentResponse recordFeePayment(FeePaymentCreateRequest request);

    List<FeeAssignmentResponse> getFeeAssignmentsByStudent(UUID studentId);
}
