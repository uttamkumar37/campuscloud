package com.cloudcampus.dashboard.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record TeacherDashboardResponse(
        TeacherProfileInfo profile,
        List<AssignedClassInfo> assignedClasses,
        List<HomeworkSummary> recentHomework,
        List<ExamSummary> recentExams,
        List<TimetableSlotSummary> todayTimetable
) {

    public record TeacherProfileInfo(
            UUID id,
            String employeeNo,
            String firstName,
            String lastName,
            String email
    ) {}

    public record AssignedClassInfo(
            UUID classId,
            String className,
            UUID sectionId,
            String sectionName
    ) {}

    public record HomeworkSummary(
            UUID id,
            String title,
            LocalDate dueDate,
            String className
    ) {}

    public record ExamSummary(
            UUID id,
            String title,
            LocalDate examDate,
            String className
    ) {}

    public record TimetableSlotSummary(
            String subjectName,
            String className,
            String sectionName,
            LocalTime startTime,
            LocalTime endTime,
            String label
    ) {}
}
