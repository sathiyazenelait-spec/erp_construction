package com.buildcon.erp.repository;

import com.buildcon.erp.model.RevenueEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RevenueEntryRepository extends JpaRepository<RevenueEntry, Long> {
    List<RevenueEntry> findByOrganizationId(Long organizationId);
}
