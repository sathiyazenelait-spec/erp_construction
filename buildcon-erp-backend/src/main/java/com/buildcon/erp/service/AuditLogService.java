package com.buildcon.erp.service;

import com.buildcon.erp.model.AuditLog;
import com.buildcon.erp.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public AuditLog logAction(String action, String entityName, String entityId, String performedBy, String userRole, String details, String ipAddress, String status, Long organizationId) {
        AuditLog log = new AuditLog(
            LocalDateTime.now(),
            action,
            entityName,
            entityId,
            performedBy != null ? performedBy : "SYSTEM",
            userRole,
            details,
            ipAddress != null ? ipAddress : "127.0.0.1",
            status != null ? status : "SUCCESS",
            organizationId != null ? organizationId : 1L
        );
        return auditLogRepository.save(log);
    }

    public List<AuditLog> getLogsByOrg(Long organizationId) {
        return auditLogRepository.findByOrganizationIdOrderByTimestampDesc(organizationId);
    }

    public void seedInitialLogs(Long orgId) {
        if (auditLogRepository.findByOrganizationIdOrderByTimestampDesc(orgId).isEmpty()) {
            LocalDateTime now = LocalDateTime.now();
            auditLogRepository.save(new AuditLog(now.minusHours(4), "APPROVE", "PurchaseOrder", "PO-102", "procurement", "ROLE_PROCUREMENT_MANAGER", "Approved TMT Rebar supply contract $3,000,000", "192.168.1.42", "SUCCESS", orgId));
            auditLogRepository.save(new AuditLog(now.minusHours(3), "CREATE", "GoodsReceiptNote", "GRN-2026-082", "storemanager", "ROLE_STORE_MANAGER", "Acknowledged delivery of 15 MT bundles from Tata Tiscon", "192.168.1.55", "SUCCESS", orgId));
            auditLogRepository.save(new AuditLog(now.minusHours(2), "UPDATE", "QaQcNcr", "NCR-2026-001", "qaqc", "ROLE_QA_QC_ENGINEER", "Shear wall honeycombing repair marked UNDER_REVIEW", "192.168.1.61", "SUCCESS", orgId));
            auditLogRepository.save(new AuditLog(now.minusHours(1), "CREATE", "RunningAccountBill", "RA-BILL-401", "subcontractor", "ROLE_SUBCONTRACTOR", "Submitted RA bill #04 for $420,000 formwork casting", "192.168.1.80", "SUCCESS", orgId));
            auditLogRepository.save(new AuditLog(now.minusMinutes(20), "APPROVE", "ClientMilestone", "UNIT-402", "projectmanager", "ROLE_PROJECT_MANAGER", "Certified 88% completion for Tower A handover readiness", "192.168.1.12", "SUCCESS", orgId));
        }
    }
}
