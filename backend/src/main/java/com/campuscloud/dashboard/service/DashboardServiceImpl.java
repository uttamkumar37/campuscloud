package com.campuscloud.dashboard.service;

import com.campuscloud.attendance.entity.AttendanceRecord;
import com.campuscloud.attendance.entity.AttendanceStatus;
import com.campuscloud.attendance.repository.AttendanceRecordRepository;
import com.campuscloud.dashboard.dto.MetricPointResponse;
import com.campuscloud.dashboard.dto.RecentActivityResponse;
import com.campuscloud.dashboard.dto.SuperAdminDashboardSummaryResponse;
import com.campuscloud.dashboard.dto.TenantBrandingResponse;
import com.campuscloud.dashboard.dto.TenantDashboardSummaryResponse;
import com.campuscloud.fees.entity.FeePayment;
import com.campuscloud.fees.repository.FeePaymentRepository;
import com.campuscloud.student.repository.StudentRepository;
import com.campuscloud.teacher.repository.TeacherRepository;
import com.campuscloud.tenant.dto.TenantResponse;
import com.campuscloud.tenant.entity.Tenant;
import com.campuscloud.tenant.repository.TenantRepository;
import com.campuscloud.tenant.service.TenantContext;
import com.campuscloud.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private static final EnumSet<AttendanceStatus> PRESENT_STATUSES =
            EnumSet.of(AttendanceStatus.PRESENT, AttendanceStatus.LATE, AttendanceStatus.EXCUSED);

    private final TenantService tenantService;
    private final TenantRepository tenantRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final FeePaymentRepository feePaymentRepository;

    @Override
    @Transactional(readOnly = true)
    public TenantDashboardSummaryResponse getTenantDashboardSummary() {
        validateTenantContext();

        TenantResponse tenant = tenantService.getCurrentTenant();
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        LocalDate attendanceWindowStart = today.minusDays(6);
        LocalDate feesWindowStart = today.withDayOfMonth(1).minusMonths(5);

        long totalAttendanceRecords = attendanceRecordRepository.countByAttendanceDateBetween(attendanceWindowStart, today);
        long presentAttendanceRecords = attendanceRecordRepository.countByAttendanceDateBetweenAndStatusIn(
                attendanceWindowStart,
                today,
                PRESENT_STATUSES
        );

        BigDecimal feesCollected = feePaymentRepository.findAllByPaymentDateBetween(feesWindowStart, today).stream()
                .map(FeePayment::getAmountPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new TenantDashboardSummaryResponse(
                new TenantBrandingResponse(
                        tenant.tenantId(),
                        tenant.schoolName(),
                        tenant.logoUrl(),
                        tenant.primaryColor()
                ),
                studentRepository.countByActiveTrue(),
                teacherRepository.countByActiveTrue(),
                calculatePercentage(presentAttendanceRecords, totalAttendanceRecords),
                feesCollected,
                buildAttendanceTrend(attendanceWindowStart, today),
                buildMonthlyFeeCollection(YearMonth.from(today).minusMonths(5), YearMonth.from(today)),
                buildRecentActivity(),
                buildQuickInsights()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public SuperAdminDashboardSummaryResponse getSuperAdminDashboardSummary() {
        long totalTenants = tenantRepository.count();
        long activeTenants = tenantRepository.countByActiveTrue();
        Instant monthStart = LocalDate.now(ZoneOffset.UTC)
                .withDayOfMonth(1)
                .atStartOfDay()
                .toInstant(ZoneOffset.UTC);

        List<TenantResponse> newestTenants = tenantRepository.findAll().stream()
                .sorted(Comparator.comparing(Tenant::getCreatedAt).reversed())
                .limit(6)
                .map(this::mapTenant)
                .toList();

        long tenantsCreatedThisMonth = tenantRepository.findAll().stream()
                .filter(tenant -> tenant.getCreatedAt() != null && !tenant.getCreatedAt().isBefore(monthStart))
                .count();

        return new SuperAdminDashboardSummaryResponse(
                totalTenants,
                activeTenants,
                tenantsCreatedThisMonth,
                Math.max(0, totalTenants - activeTenants),
                newestTenants
        );
    }

    private List<MetricPointResponse> buildAttendanceTrend(LocalDate startDate, LocalDate endDate) {
        List<MetricPointResponse> trend = new ArrayList<>();
        for (LocalDate cursor = startDate; !cursor.isAfter(endDate); cursor = cursor.plusDays(1)) {
            List<AttendanceRecord> dailyRecords = attendanceRecordRepository.findAllByAttendanceDate(cursor);
            long attended = dailyRecords.stream()
                    .filter(record -> PRESENT_STATUSES.contains(record.getStatus()))
                    .count();
            trend.add(new MetricPointResponse(
                    cursor.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    calculatePercentage(attended, dailyRecords.size())
            ));
        }
        return trend;
    }

    private List<MetricPointResponse> buildMonthlyFeeCollection(YearMonth startMonth, YearMonth endMonth) {
        List<FeePayment> payments = feePaymentRepository.findAllByPaymentDateBetween(
                startMonth.atDay(1),
                endMonth.atEndOfMonth()
        );

        List<MetricPointResponse> points = new ArrayList<>();
        for (YearMonth month = startMonth; !month.isAfter(endMonth); month = month.plusMonths(1)) {
            YearMonth currentMonth = month;
            BigDecimal total = payments.stream()
                    .filter(payment -> YearMonth.from(payment.getPaymentDate()).equals(currentMonth))
                    .map(FeePayment::getAmountPaid)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            points.add(new MetricPointResponse(
                    month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    total.doubleValue()
            ));
        }
        return points;
    }

    private List<RecentActivityResponse> buildRecentActivity() {
        List<RecentActivityResponse> activity = new ArrayList<>();

        studentRepository.findTop5ByOrderByCreatedAtDesc().forEach(student -> activity.add(
                new RecentActivityResponse(
                        "New student enrolled",
                        student.getFirstName() + " " + student.getLastName() + " joined with admission no " + student.getAdmissionNo(),
                        "STUDENT",
                        student.getCreatedAt()
                )
        ));

        teacherRepository.findTop5ByOrderByCreatedAtDesc().forEach(teacher -> activity.add(
                new RecentActivityResponse(
                        "Teacher onboarded",
                        teacher.getFirstName() + " " + teacher.getLastName() + " added to the faculty roster",
                        "TEACHER",
                        teacher.getCreatedAt()
                )
        ));

        attendanceRecordRepository.findTop8ByOrderByCreatedAtDesc().forEach(record -> activity.add(
                new RecentActivityResponse(
                        "Attendance recorded",
                        "Attendance marked for " + record.getAttendanceDate(),
                        "ATTENDANCE",
                        record.getCreatedAt()
                )
        ));

        feePaymentRepository.findTop8ByOrderByCreatedAtDesc().forEach(payment -> activity.add(
                new RecentActivityResponse(
                        "Fee payment received",
                        "Collected " + payment.getAmountPaid() + " via " + payment.getPaymentMethod(),
                        "FEE",
                        payment.getCreatedAt()
                )
        ));

        return activity.stream()
                .filter(item -> item.occurredAt() != null)
                .sorted(Comparator.comparing(RecentActivityResponse::occurredAt).reversed())
                .limit(8)
                .toList();
    }

    private List<String> buildQuickInsights() {
        Instant last30Days = Instant.now().minusSeconds(30L * 24 * 60 * 60);
        return List.of(
                studentRepository.countByCreatedAtAfter(last30Days) + " new students joined in the last 30 days",
                teacherRepository.countByCreatedAtAfter(last30Days) + " teachers were onboarded this month",
                "Tenant theme color is " + tenantService.getCurrentTenant().primaryColor()
        );
    }

    private double calculatePercentage(long numerator, long denominator) {
        if (denominator == 0) {
            return 0.0;
        }
        return BigDecimal.valueOf((numerator * 100.0) / denominator)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private TenantResponse mapTenant(Tenant tenant) {
        return new TenantResponse(
                tenant.getId(),
                tenant.getTenantId(),
                tenant.getSchoolName(),
                tenant.getSchemaName(),
                tenant.getLogoUrl(),
                tenant.getPrimaryColor(),
                tenant.isActive(),
                tenant.getCreatedAt()
        );
    }

    private void validateTenantContext() {
        if (TenantContext.DEFAULT_SCHEMA.equals(TenantContext.getTenant())) {
            throw new IllegalArgumentException("X-Tenant-ID header is required for tenant dashboard operations");
        }
    }
}
