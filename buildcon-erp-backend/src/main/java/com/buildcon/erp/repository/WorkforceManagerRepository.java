package com.buildcon.erp.repository;

import com.buildcon.erp.model.WorkforceManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WorkforceManagerRepository extends JpaRepository<WorkforceManager, Long> {
    Optional<WorkforceManager> findByUsername(String username);
    Optional<WorkforceManager> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
}
