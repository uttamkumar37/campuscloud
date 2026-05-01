package com.cloudcampus.tenant.repository;

import com.cloudcampus.tenant.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {

    Optional<Tenant> findByTenantId(String tenantId);

        Optional<Tenant> findBySlug(String slug);

    Optional<Tenant> findBySchemaName(String schemaName);

    boolean existsByTenantId(String tenantId);

        boolean existsBySlug(String slug);

    boolean existsBySchemaName(String schemaName);

    long countByActiveTrue();

        @Query("""
                        select t from Tenant t
                        where t.active = true
                            and (
                                lower(t.schoolName) like lower(concat('%', :query, '%'))
                                or lower(t.slug) like lower(concat('%', :query, '%'))
                            )
                        order by t.schoolName asc
                        """)
        List<Tenant> searchActiveSchools(@Param("query") String query);
}
