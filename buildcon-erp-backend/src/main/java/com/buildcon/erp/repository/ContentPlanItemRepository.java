package com.buildcon.erp.repository;

import com.buildcon.erp.model.ContentPlanItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContentPlanItemRepository extends JpaRepository<ContentPlanItem, Long> {
    List<ContentPlanItem> findByOrganizationId(Long organizationId);
}
