package com.buildcon.erp.repository;

import com.buildcon.erp.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByOrganizationIdOrderByTimestampDesc(Long organizationId);
    List<AuditLog> findByOrganizationIdAndActionOrderByTimestampDesc(Long organizationId, String action);
    List<AuditLog> findByOrganizationIdAndEntityNameOrderByTimestampDesc(Long organizationId, String entityName);
}
