package com.buildcon.erp.repository;

import com.buildcon.erp.model.SeniorSiteEngineer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SeniorSiteEngineerRepository extends JpaRepository<SeniorSiteEngineer, Long> {
    Optional<SeniorSiteEngineer> findByUsername(String username);
    Optional<SeniorSiteEngineer> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    java.util.List<SeniorSiteEngineer> findByOrganizationId(Long organizationId);
}
