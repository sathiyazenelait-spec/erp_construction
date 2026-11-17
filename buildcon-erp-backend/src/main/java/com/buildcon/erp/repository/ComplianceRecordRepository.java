package com.buildcon.erp.repository;

import com.buildcon.erp.model.ComplianceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ComplianceRecordRepository extends JpaRepository<ComplianceRecord, Long> {
    List<ComplianceRecord> findByOrganizationIdOrderByExpiryDateAsc(Long organizationId);
    List<ComplianceRecord> findByOrganizationIdAndCategory(Long organizationId, String category);
    List<ComplianceRecord> findByOrganizationIdAndExpiryDateBetween(Long organizationId, LocalDate start, LocalDate end);
}
