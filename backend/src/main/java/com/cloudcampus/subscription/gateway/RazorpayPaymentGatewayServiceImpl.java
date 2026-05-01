package com.cloudcampus.subscription.gateway;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Razorpay implementation of {@link PaymentGatewayService}.
 * Requires {@code RAZORPAY_KEY_ID}, {@code RAZORPAY_KEY_SECRET} and
 * {@code RAZORPAY_WEBHOOK_SECRET} environment variables to be set.
 */
@Slf4j
@Service
public class RazorpayPaymentGatewayServiceImpl implements PaymentGatewayService {

    @Value("${razorpay.key-id:}")
    private String keyId;

    @Value("${razorpay.key-secret:}")
    private String keySecret;

    @Value("${razorpay.webhook-secret:}")
    private String webhookSecret;

    private RazorpayClient razorpayClient;

    @PostConstruct
    void init() {
        if (keyId.isBlank() || keySecret.isBlank()) {
            log.warn("Razorpay keys not configured — payment gateway disabled. " +
                     "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.");
            return;
        }
        try {
            this.razorpayClient = new RazorpayClient(keyId, keySecret);
            log.info("Razorpay payment gateway initialized.");
        } catch (RazorpayException e) {
            log.error("Failed to initialise Razorpay client: {}", e.getMessage());
        }
    }

    @Override
    public GatewayOrderResponse createOrder(String receipt, BigDecimal amountInRupees, String currency) {
        if (razorpayClient == null) {
            throw new IllegalStateException(
                    "Razorpay payment gateway is not configured. " +
                    "Please set RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET environment variables.");
        }
        try {
            long amountInPaise = amountInRupees.multiply(BigDecimal.valueOf(100)).longValue();
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", receipt);

            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = order.get("id");
            log.info("Razorpay order created: orderId={}, amount={} paise", orderId, amountInPaise);
            return new GatewayOrderResponse(orderId, amountInPaise, currency);
        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order: {}", e.getMessage());
            throw new RuntimeException("Failed to create payment order: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean verifyWebhookSignature(String rawPayload, String signature) {
        if (webhookSecret.isBlank()) {
            log.warn("Razorpay webhook secret not set — rejecting all webhooks.");
            return false;
        }
        try {
            return Utils.verifyWebhookSignature(rawPayload, signature, webhookSecret);
        } catch (RazorpayException e) {
            log.warn("Razorpay webhook signature verification failed: {}", e.getMessage());
            return false;
        }
    }

    /** Exposed for the initiate-payment endpoint to embed the public key in the response. */
    public String getPublicKeyId() {
        return keyId;
    }
}
