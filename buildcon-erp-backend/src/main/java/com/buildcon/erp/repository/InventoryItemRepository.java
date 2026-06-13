package com.buildcon.erp.repository;

import com.buildcon.erp.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByProjectId(Long projectId);
    void deleteByProjectId(Long projectId);
}
