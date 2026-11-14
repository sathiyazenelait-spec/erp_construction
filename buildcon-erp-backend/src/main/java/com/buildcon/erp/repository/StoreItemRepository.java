package com.buildcon.erp.repository;

import com.buildcon.erp.model.StoreItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StoreItemRepository extends JpaRepository<StoreItem, Long> {
    List<StoreItem> findByOrganizationId(Long organizationId);
    void deleteByOrganizationId(Long organizationId);
}

