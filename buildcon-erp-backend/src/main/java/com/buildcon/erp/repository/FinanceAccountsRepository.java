package com.buildcon.erp.repository;

import com.buildcon.erp.model.FinanceAccounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FinanceAccountsRepository extends JpaRepository<FinanceAccounts, Long> {
    Optional<FinanceAccounts> findByUsername(String username);
    Optional<FinanceAccounts> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    java.util.List<FinanceAccounts> findByOrganizationId(Long organizationId);
}
