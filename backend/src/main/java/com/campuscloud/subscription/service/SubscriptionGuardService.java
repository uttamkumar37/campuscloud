package com.campuscloud.subscription.service;

import com.campuscloud.subscription.entity.PlanFeature;
import com.campuscloud.subscription.entity.SubscriptionStatus;
import com.campuscloud.subscription.entity.TenantSubscription;
import com.campuscloud.subscription.repository.TenantSubscriptionRepository;
import com.campuscloud.tenant.service.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Guards tenant feature access based on their active subscription plan.
 *
 * <p>Behaviour:
 * <ul>
 *   <li>If the tenant has no active subscription → access is allowed (legacy / FREE access).</li>
 *   <li>If the tenant has an active subscription but the plan does not include the requested
 *       feature → {@link IllegalStateException} is thrown with an upgrade message.</li>
 * </ul>
 *
 * <p>Usage in a service method:
 * <pre>{@code
 *   subscriptionGuardService.requireFeature(PlanFeature.BULK_UPLOAD);
 * }</pre>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionGuardService {

    private final TenantSubscriptionRepository subscriptionRepository;

    /**
     * Asserts that the current tenant's active subscription includes the given feature.
     * If no active subscription exists the check is skipped (fail-open for backward compatibility).
     *
     * @param feature the feature to check
     * @throws IllegalStateException if the plan does not include the feature
     */
    @Transactional(readOnly = true)
    public void requireFeature(PlanFeature feature) {
        String tenantId = TenantContext.getTenant();
        if (TenantContext.DEFAULT_SCHEMA.equals(tenantId)) {
            // Super-admin context — skip plan check
            return;
        }

        Optional<TenantSubscription> activeSub = subscriptionRepository
                .findTopByTenantIdAndStatusOrderByCreatedAtDesc(tenantId, SubscriptionStatus.ACTIVE);

        if (activeSub.isEmpty()) {
            // No subscription on record → fail-open (backward compatible)
            log.debug("No active subscription for tenant={}, feature check skipped", tenantId);
            return;
        }

        TenantSubscription subscription = activeSub.get();
        if (!subscription.getPlan().getFeatures().contains(feature)) {
            throw new IllegalStateException(
                    "Your current plan '" + subscription.getPlan().getName()
                    + "' does not include the '" + feature.name()
                    + "' feature. Please upgrade your subscription.");
        }
    }
}
