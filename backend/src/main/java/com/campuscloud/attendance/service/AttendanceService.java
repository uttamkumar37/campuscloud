package com.campuscloud.attendance.service;

import com.campuscloud.attendance.dto.AttendanceCreateRequest;
import com.campuscloud.attendance.dto.AttendanceResponse;
import jakarta.annotation.Nullable;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface AttendanceService {

    AttendanceResponse markAttendance(AttendanceCreateRequest request);

    /**
     * Fetch a single attendance record. If {@code allowedStudentIds} is non-null, the record's
     * studentId must be in that set or an AccessDeniedException is thrown.
     */
    AttendanceResponse getAttendanceById(UUID attendanceId, @Nullable Set<UUID> allowedStudentIds);

    /**
     * Fetch all attendance records for a date. If {@code allowedStudentIds} is non-null, only
     * records for those students are returned.
     */
    List<AttendanceResponse> getAttendanceByDate(LocalDate date, @Nullable Set<UUID> allowedStudentIds);
}
