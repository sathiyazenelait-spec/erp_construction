package com.buildcon.erp.repository;

import com.buildcon.erp.model.SalesLead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalesLeadRepository extends JpaRepository<SalesLead, Long> {
    List<SalesLead> findByOrganizationId(Long organizationId);
}
