package com.cloudcampus.subscription.gateway;

import java.math.BigDecimal;

/**
 * Abstraction over a payment gateway. Currently implemented by Razorpay.
 * Swap the implementation bean to integrate a different provider.
 */
public interface PaymentGatewayService {

    /**
     * Create a payment order on the gateway.
     *
     * @param receipt     arbitrary receipt / idempotency key (e.g. subscription UUID)
     * @param amountInRupees amount in INR (will be converted to paise internally)
     * @param currency    ISO-4217 currency code, e.g. "INR"
     * @return {@link GatewayOrderResponse} containing the gateway's order ID
     */
    GatewayOrderResponse createOrder(String receipt, BigDecimal amountInRupees, String currency);

    /**
     * Verify the HMAC-SHA256 signature of an inbound webhook payload.
     *
     * @param rawPayload  raw request body bytes as a UTF-8 string
     * @param signature   value of the X-Razorpay-Signature header
     * @return {@code true} if the signature is authentic
     */
    boolean verifyWebhookSignature(String rawPayload, String signature);
}
