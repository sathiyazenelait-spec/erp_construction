package com.buildcon.erp.repository;

import com.buildcon.erp.model.SwotItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SwotItemRepository extends JpaRepository<SwotItem, Long> {
    List<SwotItem> findByOrganizationId(Long organizationId);
}
