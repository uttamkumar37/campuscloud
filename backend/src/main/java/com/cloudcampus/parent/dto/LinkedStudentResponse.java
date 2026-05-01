package com.cloudcampus.parent.dto;

import java.util.UUID;

public record LinkedStudentResponse(
        UUID studentId,
        String admissionNo,
        String firstName,
        String lastName
) {
}
