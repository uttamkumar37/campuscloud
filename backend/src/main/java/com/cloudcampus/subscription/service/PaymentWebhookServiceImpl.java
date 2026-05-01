package com.cloudcampus.subscription.service;

import com.cloudcampus.subscription.entity.PaymentMethod;
import com.cloudcampus.subscription.entity.PlatformPayment;
import com.cloudcampus.subscription.entity.SubscriptionPaymentStatus;
import com.cloudcampus.subscription.gateway.PaymentGatewayService;
import com.cloudcampus.subscription.repository.PlatformPaymentRepository;
import com.cloudcampus.subscription.repository.TenantSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Processes Razorpay webhook events.
 *
 * <p>Supported event: {@code payment.captured} — marks the linked subscription
 * as PAID and records a {@link PlatformPayment}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentWebhookServiceImpl implements PaymentWebhookService {

    private final PaymentGatewayService paymentGatewayService;
    private final TenantSubscriptionRepository subscriptionRepository;
    private final PlatformPaymentRepository paymentRepository;

    @Override
    @Transactional
    public void processWebhook(String rawPayload, String razorpaySignature) {
        // 1. Verify HMAC-SHA256 signature before touching any data
        if (!paymentGatewayService.verifyWebhookSignature(rawPayload, razorpaySignature)) {
            log.warn("Received webhook with invalid signature — ignoring.");
            throw new SecurityException("Invalid Razorpay webhook signature");
        }

        // 2. Parse event type
        JSONObject root = new JSONObject(rawPayload);
        String event = root.optString("event", "");
        log.info("Razorpay webhook received: event={}", event);

        if (!"payment.captured".equals(event)) {
            // Acknowledge but take no action for unhandled events
            log.debug("Ignoring unhandled Razorpay event: {}", event);
            return;
        }

        // 3. Extract payment entity from the canonical webhook envelope
        JSONObject paymentEntity = root
                .getJSONObject("payload")
                .getJSONObject("payment")
                .getJSONObject("entity");

        String gatewayOrderId = paymentEntity.getString("order_id");
        String gatewayPaymentId = paymentEntity.getString("id");
        long amountPaise = paymentEntity.getLong("amount");
        BigDecimal amountRupees = BigDecimal.valueOf(amountPaise).divide(BigDecimal.valueOf(100));

        // 4. Locate the subscription by gateway order ID
        subscriptionRepository.findByGatewayOrderId(gatewayOrderId).ifPresentOrElse(subscription -> {
            // Guard against duplicate webhook deliveries
            if (SubscriptionPaymentStatus.PAID.equals(subscription.getPaymentStatus())) {
                log.info("Duplicate webhook for orderId={} — subscription already PAID, skipping.", gatewayOrderId);
                return;
            }

            // 5. Mark subscription as paid
            subscription.setPaymentStatus(SubscriptionPaymentStatus.PAID);
            subscriptionRepository.save(subscription);

            // 6. Persist a PlatformPayment record
            PlatformPayment payment = new PlatformPayment();
            payment.setTenantId(subscription.getTenantId());
            payment.setSubscriptionId(subscription.getId());
            payment.setAmount(amountRupees);
            payment.setStatus(SubscriptionPaymentStatus.PAID);
            payment.setPaymentDate(LocalDate.now());
            payment.setPaymentMethod(PaymentMethod.RAZORPAY);
            payment.setReferenceNo(gatewayPaymentId);
            payment.setNotes("Razorpay order: " + gatewayOrderId);
            paymentRepository.save(payment);

            log.info("Payment captured via Razorpay: tenantId={}, orderId={}, paymentId={}, amount={}",
                    subscription.getTenantId(), gatewayOrderId, gatewayPaymentId, amountRupees);

        }, () -> log.warn("No subscription found for gateway orderId={}", gatewayOrderId));
    }
}
