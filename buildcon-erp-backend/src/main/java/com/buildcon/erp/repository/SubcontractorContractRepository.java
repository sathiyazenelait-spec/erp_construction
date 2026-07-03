package com.buildcon.erp.repository;

import com.buildcon.erp.model.SubcontractorContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubcontractorContractRepository extends JpaRepository<SubcontractorContract, Long> {
    List<SubcontractorContract> findByOrganizationId(Long organizationId);
    List<SubcontractorContract> findBySubcontractorId(Long subcontractorId);
}
