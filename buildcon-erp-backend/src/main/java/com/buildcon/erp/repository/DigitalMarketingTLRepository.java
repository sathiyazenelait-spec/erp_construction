package com.buildcon.erp.repository;

import com.buildcon.erp.model.DigitalMarketingTL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DigitalMarketingTLRepository extends JpaRepository<DigitalMarketingTL, Long> {
    Optional<DigitalMarketingTL> findByUsername(String username);
    Optional<DigitalMarketingTL> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
}
