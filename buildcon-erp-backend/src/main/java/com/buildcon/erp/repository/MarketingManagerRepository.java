package com.buildcon.erp.repository;

import com.buildcon.erp.model.MarketingManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MarketingManagerRepository extends JpaRepository<MarketingManager, Long> {
    Optional<MarketingManager> findByUsername(String username);
    Optional<MarketingManager> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
}
