package com.buildcon.erp.repository;

import com.buildcon.erp.model.WmHeadcountAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WmHeadcountAuditRepository extends JpaRepository<WmHeadcountAudit, Long> {
    List<WmHeadcountAudit> findByOrganizationId(Long organizationId);
}
