package com.buildcon.erp.repository;

import com.buildcon.erp.model.PmRequisition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PmRequisitionRepository extends JpaRepository<PmRequisition, Long> {
    List<PmRequisition> findByOrganizationId(Long organizationId);
}
