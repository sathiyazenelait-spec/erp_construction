package com.buildcon.erp.repository;

import com.buildcon.erp.model.PmInventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PmInventoryItemRepository extends JpaRepository<PmInventoryItem, Long> {
    List<PmInventoryItem> findByOrganizationId(Long organizationId);
}
