package com.buildcon.erp.repository;

import com.buildcon.erp.model.PayrollDepartmentSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PayrollDepartmentSummaryRepository extends JpaRepository<PayrollDepartmentSummary, Long> {
    List<PayrollDepartmentSummary> findByOrganizationId(Long organizationId);
}
