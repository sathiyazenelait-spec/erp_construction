package com.buildcon.erp.repository;

import com.buildcon.erp.model.ComplianceChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplianceChecklistRepository extends JpaRepository<ComplianceChecklist, Long> {
    List<ComplianceChecklist> findByOrganizationId(Long organizationId);
}
