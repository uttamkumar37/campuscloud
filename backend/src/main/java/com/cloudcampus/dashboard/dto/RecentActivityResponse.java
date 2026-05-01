package com.cloudcampus.dashboard.dto;

import java.time.Instant;

public record RecentActivityResponse(
        String title,
        String description,
        String type,
        Instant occurredAt
) {
}
