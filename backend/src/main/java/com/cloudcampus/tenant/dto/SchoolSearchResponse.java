package com.cloudcampus.tenant.dto;

public record SchoolSearchResponse(
        String slug,
        String schoolName,
        String logoUrl,
        String primaryColor
) {
}