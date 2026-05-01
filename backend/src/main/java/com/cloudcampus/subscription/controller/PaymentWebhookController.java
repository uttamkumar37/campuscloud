package com.cloudcampus.subscription.controller;

import com.cloudcampus.subscription.service.PaymentWebhookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Receives inbound webhook events from Razorpay.
 *
 * <p>This endpoint is intentionally unauthenticated (no JWT required) because
 * Razorpay cannot attach a Bearer token.  Security is enforced by HMAC-SHA256
 * signature verification inside {@link PaymentWebhookService}.
 *
 * <p>Configure the Razorpay Dashboard to send webhooks to:
 * {@code POST https://<your-domain>/api/v1/payments/webhook}
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Webhooks", description = "Razorpay webhook receiver — no Bearer token required")
public class PaymentWebhookController {

    private final PaymentWebhookService webhookService;

    @PostMapping("/webhook")
    @Operation(summary = "Razorpay webhook receiver",
            description = "Signature is verified via X-Razorpay-Signature header using HMAC-SHA256.")
    public ResponseEntity<Void> handleWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false, defaultValue = "") String signature) {

        try {
            webhookService.processWebhook(rawPayload, signature);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            log.warn("Webhook rejected: invalid signature");
            return ResponseEntity.status(401).build();
        } catch (Exception e) {
            log.error("Webhook processing error: {}", e.getMessage(), e);
            // Return 200 to prevent Razorpay from retrying non-signature errors
            return ResponseEntity.ok().build();
        }
    }
}
