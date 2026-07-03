package com.buildcon.erp.repository;

import com.buildcon.erp.model.FinanceDirector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FinanceDirectorRepository extends JpaRepository<FinanceDirector, Long> {
    Optional<FinanceDirector> findByUsername(String username);
    Optional<FinanceDirector> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    java.util.List<FinanceDirector> findByOrganizationId(Long organizationId);
}
