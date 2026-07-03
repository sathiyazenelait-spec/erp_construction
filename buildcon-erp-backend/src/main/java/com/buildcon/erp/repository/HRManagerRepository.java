package com.buildcon.erp.repository;

import com.buildcon.erp.model.HRManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HRManagerRepository extends JpaRepository<HRManager, Long> {
    Optional<HRManager> findByUsername(String username);
    Optional<HRManager> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    java.util.List<HRManager> findByOrganizationId(Long organizationId);
}
