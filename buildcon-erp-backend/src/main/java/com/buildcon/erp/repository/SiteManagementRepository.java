package com.buildcon.erp.repository;

import com.buildcon.erp.model.SiteManagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SiteManagementRepository extends JpaRepository<SiteManagement, Long> {
    Optional<SiteManagement> findByUsername(String username);
    Optional<SiteManagement> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
}
