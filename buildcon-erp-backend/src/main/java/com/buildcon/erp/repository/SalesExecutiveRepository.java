package com.buildcon.erp.repository;

import com.buildcon.erp.model.SalesExecutive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SalesExecutiveRepository extends JpaRepository<SalesExecutive, Long> {
    Optional<SalesExecutive> findByUsername(String username);
    Optional<SalesExecutive> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
}
