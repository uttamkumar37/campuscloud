package com.cloudcampus.subscription.service;

import com.cloudcampus.subscription.dto.PlatformPaymentResponse;
import com.cloudcampus.subscription.dto.RecordPaymentRequest;
import com.cloudcampus.subscription.entity.PlatformPayment;
import com.cloudcampus.subscription.entity.SubscriptionPaymentStatus;
import com.cloudcampus.subscription.entity.TenantSubscription;
import com.cloudcampus.subscription.repository.PlatformPaymentRepository;
import com.cloudcampus.subscription.repository.TenantSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformPaymentServiceImpl implements PlatformPaymentService {

    private final PlatformPaymentRepository paymentRepository;
    private final TenantSubscriptionRepository subscriptionRepository;

    @Override
    @Transactional
    public PlatformPaymentResponse recordPayment(RecordPaymentRequest request) {
        PlatformPayment payment = new PlatformPayment();
        payment.setTenantId(request.tenantId().trim().toLowerCase());
        payment.setSubscriptionId(request.subscriptionId());
        payment.setAmount(request.amount());
        payment.setStatus(SubscriptionPaymentStatus.PAID);
        payment.setPaymentDate(request.paymentDate());
        payment.setPaymentMethod(request.paymentMethod());
        payment.setReferenceNo(request.referenceNo());
        payment.setNotes(request.notes());

        PlatformPayment saved = paymentRepository.save(payment);

        // Mark the linked subscription as PAID if provided
        if (request.subscriptionId() != null) {
            subscriptionRepository.findById(request.subscriptionId()).ifPresent(sub -> {
                sub.setPaymentStatus(SubscriptionPaymentStatus.PAID);
                subscriptionRepository.save(sub);
            });
        }

        log.info("Payment recorded: tenantId={}, amount={}, method={}",
                saved.getTenantId(), saved.getAmount(), saved.getPaymentMethod());
        return map(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlatformPaymentResponse> getPaymentsByTenant(String tenantId) {
        return paymentRepository.findByTenantIdOrderByCreatedAtDesc(tenantId.trim().toLowerCase())
                .stream().map(this::map).toList();
    }

    private PlatformPaymentResponse map(PlatformPayment p) {
        return new PlatformPaymentResponse(
                p.getId(),
                p.getTenantId(),
                p.getSubscriptionId(),
                p.getAmount(),
                p.getStatus(),
                p.getPaymentDate(),
                p.getPaymentMethod(),
                p.getReferenceNo(),
                p.getNotes(),
                p.getCreatedAt()
        );
    }
}
