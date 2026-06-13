package com.buildcon.erp.repository;

import com.buildcon.erp.model.ConstructionManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConstructionManagerRepository extends JpaRepository<ConstructionManager, Long> {
    Optional<ConstructionManager> findByUsername(String username);
    Optional<ConstructionManager> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
}
