package com.buildcon.erp.repository;

import com.buildcon.erp.model.ProcurementManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProcurementManagerRepository extends JpaRepository<ProcurementManager, Long> {
    Optional<ProcurementManager> findByUsername(String username);
    Optional<ProcurementManager> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    java.util.List<ProcurementManager> findByOrganizationId(Long organizationId);
}
