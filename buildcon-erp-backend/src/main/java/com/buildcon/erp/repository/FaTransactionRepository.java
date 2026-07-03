package com.buildcon.erp.repository;

import com.buildcon.erp.model.FaTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FaTransactionRepository extends JpaRepository<FaTransaction, Long> {
    List<FaTransaction> findByOrganizationId(Long organizationId);
}
