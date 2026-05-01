package com.cloudcampus.exam.service;

import com.cloudcampus.exam.dto.ExamCreateRequest;
import com.cloudcampus.exam.dto.ExamResponse;
import com.cloudcampus.exam.dto.ExamResultCreateRequest;
import com.cloudcampus.exam.dto.ExamResultResponse;
import jakarta.annotation.Nullable;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface ExamService {

    ExamResponse createExam(ExamCreateRequest request);

    List<ExamResponse> getExamsByClass(UUID classId);

    ExamResultResponse createExamResult(ExamResultCreateRequest request);

    /**
     * Fetch results for an exam. If {@code allowedStudentIds} is non-null, only results for
     * those students are returned.
     */
    List<ExamResultResponse> getExamResults(UUID examId, @Nullable Set<UUID> allowedStudentIds);
}
