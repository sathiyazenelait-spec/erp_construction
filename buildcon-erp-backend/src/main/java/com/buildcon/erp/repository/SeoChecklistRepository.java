package com.buildcon.erp.repository;

import com.buildcon.erp.model.SeoChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeoChecklistRepository extends JpaRepository<SeoChecklist, Long> {
    List<SeoChecklist> findByOrganizationId(Long organizationId);
}
