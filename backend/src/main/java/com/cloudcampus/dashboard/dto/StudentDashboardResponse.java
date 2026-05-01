package com.cloudcampus.dashboard.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record StudentDashboardResponse(
        StudentProfileInfo profile,
        AttendanceSummaryInfo attendance,
        FeesSummaryInfo fees,
        List<ExamResultSummary> recentResults,
        List<HomeworkSummary> recentHomework,
        List<TimetableSlotSummary> todayTimetable
) {

    public record StudentProfileInfo(
            UUID id,
            String admissionNo,
            String firstName,
            String lastName,
            String email
    ) {}

    public record AttendanceSummaryInfo(
            long totalDays,
            long presentDays,
            double presentPercent,
            List<AttendanceDay> lastSevenDays
    ) {}

    public record AttendanceDay(
            LocalDate date,
            String status
    ) {}

    public record FeesSummaryInfo(
            BigDecimal totalAmount,
            BigDecimal paidAmount,
            BigDecimal pendingAmount,
            int totalAssignments,
            int pendingAssignments
    ) {}

    public record ExamResultSummary(
            String examTitle,
            LocalDate examDate,
            BigDecimal marksObtained,
            BigDecimal maxMarks,
            String grade
    ) {}

    public record HomeworkSummary(
            UUID id,
            String title,
            LocalDate dueDate,
            boolean overdue
    ) {}

    public record TimetableSlotSummary(
            String subjectName,
            LocalTime startTime,
            LocalTime endTime,
            String label
    ) {}
}
