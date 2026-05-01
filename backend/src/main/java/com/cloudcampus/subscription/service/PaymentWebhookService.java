package com.cloudcampus.subscription.service;

/**
 * Handles inbound payment gateway webhook events.
 */
public interface PaymentWebhookService {

    /**
     * Validate signature, parse the event, and persist the payment result.
     *
     * @param rawPayload        raw request body (UTF-8 string) as received from Razorpay
     * @param razorpaySignature value of the {@code X-Razorpay-Signature} header
     */
    void processWebhook(String rawPayload, String razorpaySignature);
}
