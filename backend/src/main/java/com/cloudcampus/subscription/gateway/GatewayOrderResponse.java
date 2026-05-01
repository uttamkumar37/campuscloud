package com.cloudcampus.subscription.gateway;

/**
 * Value object returned by {@link PaymentGatewayService#createOrder}.
 *
 * @param orderId      gateway-assigned order ID (e.g. "order_Abc123")
 * @param amountInPaise amount in the smallest currency unit (paise for INR)
 * @param currency     ISO-4217 currency code
 */
public record GatewayOrderResponse(String orderId, long amountInPaise, String currency) {}
