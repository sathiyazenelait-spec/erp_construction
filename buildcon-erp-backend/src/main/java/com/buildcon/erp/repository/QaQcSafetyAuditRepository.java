package com.buildcon.erp.repository;

import com.buildcon.erp.model.QaQcSafetyAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QaQcSafetyAuditRepository extends JpaRepository<QaQcSafetyAudit, Long> {
    List<QaQcSafetyAudit> findByOrganizationId(Long organizationId);
    void deleteByOrganizationId(Long organizationId);
}

