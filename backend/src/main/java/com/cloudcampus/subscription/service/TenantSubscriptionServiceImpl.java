package com.cloudcampus.subscription.service;

import com.cloudcampus.subscription.dto.InitiatePaymentResponse;
import com.cloudcampus.subscription.dto.SubscribeRequest;
import com.cloudcampus.subscription.dto.SubscriptionPlanResponse;
import com.cloudcampus.subscription.dto.TenantSubscriptionResponse;
import com.cloudcampus.subscription.entity.SubscriptionPlan;
import com.cloudcampus.subscription.entity.SubscriptionStatus;
import com.cloudcampus.subscription.entity.TenantSubscription;
import com.cloudcampus.subscription.gateway.GatewayOrderResponse;
import com.cloudcampus.subscription.gateway.RazorpayPaymentGatewayServiceImpl;
import com.cloudcampus.subscription.repository.SubscriptionPlanRepository;
import com.cloudcampus.subscription.repository.TenantSubscriptionRepository;
import com.cloudcampus.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TenantSubscriptionServiceImpl implements TenantSubscriptionService {

    private final TenantSubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository planRepository;
    private final TenantRepository tenantRepository;
    private final SubscriptionPlanServiceImpl planService;
    private final RazorpayPaymentGatewayServiceImpl paymentGatewayService;

    @Override
    @Transactional
    public TenantSubscriptionResponse subscribe(String tenantId, SubscribeRequest request) {
        if (!tenantRepository.existsByTenantId(tenantId)) {
            throw new IllegalArgumentException("Tenant not found: " + tenantId);
        }

        SubscriptionPlan plan = planRepository.findById(request.planId())
                .orElseThrow(() -> new IllegalArgumentException("Subscription plan not found: " + request.planId()));

        // Cancel any existing active subscription before creating a new one
        subscriptionRepository
                .findTopByTenantIdAndStatusOrderByCreatedAtDesc(tenantId, SubscriptionStatus.ACTIVE)
                .ifPresent(existing -> {
                    existing.setStatus(SubscriptionStatus.CANCELLED);
                    subscriptionRepository.save(existing);
                    log.info("Cancelled previous subscription for tenant={}", tenantId);
                });

        TenantSubscription subscription = new TenantSubscription();
        subscription.setTenantId(tenantId);
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(request.durationDays()));
        subscription.setStatus(SubscriptionStatus.ACTIVE);

        TenantSubscription saved = subscriptionRepository.save(subscription);
        log.info("Tenant subscribed: tenantId={}, plan={}, until={}", tenantId, plan.getName(), saved.getEndDate());
        return map(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TenantSubscriptionResponse> getActiveSubscription(String tenantId) {
        return subscriptionRepository
                .findTopByTenantIdAndStatusOrderByCreatedAtDesc(tenantId, SubscriptionStatus.ACTIVE)
                .map(this::map);
    }

    @Override
    @Transactional
    public TenantSubscriptionResponse cancelSubscription(String tenantId) {
        TenantSubscription subscription = subscriptionRepository
                .findTopByTenantIdAndStatusOrderByCreatedAtDesc(tenantId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException("No active subscription found for tenant: " + tenantId));

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        TenantSubscription saved = subscriptionRepository.save(subscription);
        log.info("Subscription cancelled: tenantId={}", tenantId);
        return map(saved);
    }

    @Override
    @Transactional
    public InitiatePaymentResponse initiatePayment(String tenantId) {
        TenantSubscription subscription = subscriptionRepository
                .findTopByTenantIdAndStatusOrderByCreatedAtDesc(tenantId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No active subscription found for tenant: " + tenantId +
                        ". Please assign a plan first."));

        GatewayOrderResponse order = paymentGatewayService.createOrder(
                subscription.getId().toString(),
                subscription.getPlan().getPrice(),
                "INR");

        subscription.setGatewayOrderId(order.orderId());
        subscriptionRepository.save(subscription);

        log.info("Payment initiated: tenantId={}, orderId={}", tenantId, order.orderId());
        return new InitiatePaymentResponse(
                order.orderId(),
                order.amountInPaise(),
                order.currency(),
                paymentGatewayService.getPublicKeyId(),
                subscription.getId().toString(),
                tenantId);
    }

    private TenantSubscriptionResponse map(TenantSubscription sub) {
        SubscriptionPlanResponse planResponse = planService.map(sub.getPlan());
        return new TenantSubscriptionResponse(
                sub.getId(),
                sub.getTenantId(),
                planResponse,
                sub.getStartDate(),
                sub.getEndDate(),
                sub.getStatus(),
                sub.getPaymentStatus(),
                sub.getCreatedAt()
        );
    }
}
