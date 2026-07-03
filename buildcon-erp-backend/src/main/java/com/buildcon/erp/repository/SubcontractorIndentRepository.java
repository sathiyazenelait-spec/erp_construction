package com.buildcon.erp.repository;

import com.buildcon.erp.model.SubcontractorIndent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubcontractorIndentRepository extends JpaRepository<SubcontractorIndent, Long> {
    List<SubcontractorIndent> findByOrganizationId(Long organizationId);
    List<SubcontractorIndent> findBySubcontractorId(Long subcontractorId);
}
