package com.buildcon.erp.repository;

import com.buildcon.erp.model.DigitalMarketingExecutive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DigitalMarketingExecutiveRepository extends JpaRepository<DigitalMarketingExecutive, Long> {
    Optional<DigitalMarketingExecutive> findByUsername(String username);
    Optional<DigitalMarketingExecutive> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
}
