package com.campuscloud.common.security;

import com.campuscloud.auth.security.CampusUserDetails;
import com.campuscloud.parent.entity.ParentStudent;
import com.campuscloud.parent.repository.ParentStudentRepository;
import com.campuscloud.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Spring Security helper bean for ownership-aware authorization.
 * <p>
 * Used in {@code @PreAuthorize} SpEL expressions (via bean reference {@code @ownershipChecker})
 * and directly in controllers to resolve which student IDs a caller may view.
 */
@Component("ownershipChecker")
@RequiredArgsConstructor
public class OwnershipChecker {

    private final StudentRepository studentRepository;
    private final ParentStudentRepository parentStudentRepository;

    /**
     * Returns {@code true} when the authenticated caller is allowed to view data for the
     * given {@code studentId}. Intended for use in {@code @PreAuthorize} expressions, e.g.:
     * <pre>
     * @PreAuthorize("hasAnyRole('SUPER_ADMIN','SCHOOL_ADMIN','TEACHER')
     *               or @ownershipChecker.canViewStudentData(authentication, #studentId)")
     * </pre>
     */
    public boolean canViewStudentData(Authentication auth, UUID studentId) {
        if (auth == null || !auth.isAuthenticated() || studentId == null) {
            return false;
        }
        if (hasAdminOrTeacherRole(auth.getAuthorities())) {
            return true;
        }

        if (!(auth.getPrincipal() instanceof CampusUserDetails caller)) {
            return false;
        }
        if (caller.getUserId() == null) {
            return false;
        }

        if (hasAuthority(auth.getAuthorities(), "ROLE_STUDENT")) {
            return studentRepository.findByLinkedUser_Id(caller.getUserId())
                    .map(s -> s.getId().equals(studentId))
                    .orElse(false);
        }

        if (hasAuthority(auth.getAuthorities(), "ROLE_PARENT")) {
            return parentStudentRepository.existsByParentUserIdAndStudentId(caller.getUserId(), studentId);
        }

        return false;
    }

    /**
     * Returns the set of student IDs that {@code caller} is allowed to see, wrapped in an
     * {@link Optional}:
     * <ul>
     *   <li>{@link Optional#empty()} — caller has unrestricted access (admin / teacher)</li>
     *   <li>{@code Optional.of(set)} — caller may only view records for those student IDs</li>
     * </ul>
     * Pass the result to service methods as a filter ({@code null} = unrestricted).
     */
    public Optional<Set<UUID>> resolveAllowedStudentIds(CampusUserDetails caller) {
        if (caller == null || caller.getUserId() == null) {
            return Optional.of(Collections.emptySet());
        }

        Collection<? extends GrantedAuthority> authorities = caller.getAuthorities();

        if (hasAdminOrTeacherRole(authorities)) {
            return Optional.empty(); // unrestricted
        }

        if (hasAuthority(authorities, "ROLE_STUDENT")) {
            Set<UUID> ids = studentRepository.findByLinkedUser_Id(caller.getUserId())
                    .map(s -> Set.of(s.getId()))
                    .orElse(Collections.emptySet());
            return Optional.of(ids);
        }

        if (hasAuthority(authorities, "ROLE_PARENT")) {
            Set<UUID> childIds = parentStudentRepository.findByParentUserId(caller.getUserId())
                    .stream()
                    .map(ParentStudent::getStudentId)
                    .collect(Collectors.toSet());
            return Optional.of(childIds);
        }

        return Optional.of(Collections.emptySet()); // unknown role — deny all
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private boolean hasAdminOrTeacherRole(Collection<? extends GrantedAuthority> authorities) {
        return hasAuthority(authorities, "ROLE_SUPER_ADMIN")
                || hasAuthority(authorities, "ROLE_SCHOOL_ADMIN")
                || hasAuthority(authorities, "ROLE_TEACHER");
    }

    private boolean hasAuthority(Collection<? extends GrantedAuthority> authorities, String role) {
        return authorities.stream().anyMatch(a -> a.getAuthority().equals(role));
    }
}
