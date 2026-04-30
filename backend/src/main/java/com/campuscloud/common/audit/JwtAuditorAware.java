package com.campuscloud.common.audit;

import com.campuscloud.auth.security.CampusUserDetails;
import lombok.NonNull;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Supplies the current user's UUID to Spring Data JPA auditing.
 * Returns empty for unauthenticated / bootstrap-admin requests (null userId).
 */
@Component("jwtAuditorAware")
public class JwtAuditorAware implements AuditorAware<UUID> {

    @Override
    public @NonNull Optional<UUID> getCurrentAuditor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return Optional.empty();
        }
        if (auth.getPrincipal() instanceof CampusUserDetails details) {
            return Optional.ofNullable(details.getUserId());
        }
        return Optional.empty();
    }
}
