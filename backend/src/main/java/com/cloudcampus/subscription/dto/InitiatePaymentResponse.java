package com.cloudcampus.subscription.dto;

/**
 * Returned by POST /api/v1/tenants/{tenantId}/subscribe/initiate.
 * The frontend uses these values to open the Razorpay checkout modal.
 *
 * @param orderId        Razorpay order ID (e.g. "order_Abc123")
 * @param amountInPaise  amount in smallest currency unit (paise for INR)
 * @param currency       ISO-4217 code, e.g. "INR"
 * @param keyId          Razorpay public key ID to embed in the checkout config
 * @param subscriptionId internal subscription UUID for frontend reference
 * @param tenantId       tenant this payment is for
 */
public record InitiatePaymentResponse(
        String orderId,
        long amountInPaise,
        String currency,
        String keyId,
        String subscriptionId,
        String tenantId
) {}
