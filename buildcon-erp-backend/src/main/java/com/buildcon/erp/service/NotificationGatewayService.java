package com.buildcon.erp.service;

import com.buildcon.erp.model.NotificationLog;
import com.buildcon.erp.repository.NotificationLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class NotificationGatewayService {

    @Autowired
    private NotificationLogRepository notificationLogRepository;

    public NotificationLog dispatch(NotificationLog request) {
        if (request.getSentAt() == null) {
            request.setSentAt(LocalDateTime.now());
        }
        if (request.getExternalMessageId() == null || request.getExternalMessageId().isBlank()) {
            String prefix = "WHATSAPP".equalsIgnoreCase(request.getChannel()) ? "WA-MSG-" : "SMS-GW-";
            request.setExternalMessageId(prefix + System.currentTimeMillis());
        }
        if (request.getDeliveryStatus() == null) {
            request.setDeliveryStatus("DELIVERED");
        }
        return notificationLogRepository.save(request);
    }

    public List<NotificationLog> getLogs(Long orgId) {
        seedNotificationData(orgId);
        return notificationLogRepository.findByOrganizationIdOrderBySentAtDesc(orgId);
    }

    public Map<String, Object> getGatewayStats(Long orgId) {
        List<NotificationLog> logs = getLogs(orgId);
        long total = logs.size();
        long whatsappCount = logs.stream().filter(l -> "WHATSAPP".equalsIgnoreCase(l.getChannel())).count();
        long smsCount = logs.stream().filter(l -> "SMS".equalsIgnoreCase(l.getChannel())).count();
        long delivered = logs.stream().filter(l -> "DELIVERED".equalsIgnoreCase(l.getDeliveryStatus()) || "READ".equalsIgnoreCase(l.getDeliveryStatus())).count();

        double deliveryRate = total > 0 ? ((double) delivered / total) * 100.0 : 100.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDispatched", total);
        stats.put("whatsappCount", whatsappCount);
        stats.put("smsCount", smsCount);
        stats.put("deliveredCount", delivered);
        stats.put("deliveryRate", Math.round(deliveryRate * 10.0) / 10.0);
        stats.put("logs", logs);
        return stats;
    }

    public void seedNotificationData(Long orgId) {
        if (notificationLogRepository.findByOrganizationIdOrderBySentAtDesc(orgId).isEmpty()) {
            LocalDateTime now = LocalDateTime.now();

            notificationLogRepository.save(new NotificationLog(
                "WHATSAPP",
                "+91 98401 22345",
                "Tata Tiscon Authorized Vendor",
                "PO_RELEASE_TEMPLATE",
                "New Purchase Order Released: PO-2026-118",
                "Dear Partner, BuildWell has released Purchase Order PO-2026-118 for 25.5 MT Fe550 TMT Rebar. Please review specs and confirm delivery slot: https://buildcon.erp/vendor-portal",
                "READ",
                "WA-MSG-88192019",
                now.minusHours(5),
                "{\"poNumber\":\"PO-2026-118\",\"amount\":\"$1,560,000\"}",
                orgId
            ));

            notificationLogRepository.save(new NotificationLog(
                "WHATSAPP",
                "+91 98840 99120",
                "Rajesh Kumar (Homeowner Unit 402)",
                "MILESTONE_PROGRESS_ALERT",
                "Skyline Residences Tower A Handover Update",
                "Namaste Mr. Rajesh Kumar, your unit Tower A - 402 has completed 88% finishing milestones (Flooring & Joinery). View progress photos & inspection docs: https://buildcon.erp/client-portal",
                "DELIVERED",
                "WA-MSG-88192025",
                now.minusHours(3),
                "{\"unit\":\"Tower A - 402\",\"progress\":\"88%\"}",
                orgId
            ));

            notificationLogRepository.save(new NotificationLog(
                "SMS",
                "+91 97909 33211",
                "Safety Officer Sharma",
                "SAFETY_CRITICAL_ALERT",
                "Urgent: Mandatory Perimeter Scaffolding Inspection",
                "ALERT: Tower B faÃ§ade wind gusts exceeding 35 km/h. Mandatory halt on external cradle movement until re-certification. Check QA/QC hub.",
                "DELIVERED",
                "SMS-GW-490219",
                now.minusHours(2),
                "{\"severity\":\"HIGH\",\"site\":\"Tower B FaÃ§ade\"}",
                orgId
            ));

            notificationLogRepository.save(new NotificationLog(
                "WHATSAPP",
                "+91 94440 11982",
                "Apex Civil Contractors Lead",
                "NCR_RECTIFICATION_NOTICE",
                "Quality Notice: NCR-2026-001 Under Review",
                "Notice: Honeycombing rectification for Shear Wall SW-03 requires micro-concrete cube test submission by 18-Nov-2026. Non-compliance halts pour clearance.",
                "DELIVERED",
                "WA-MSG-88192040",
                now.minusMinutes(45),
                "{\"ncrCode\":\"NCR-2026-001\",\"targetDate\":\"2026-11-18\"}",
                orgId
            ));

            notificationLogRepository.save(new NotificationLog(
                "SMS",
                "+91 98410 77651",
                "Chairman Executive Office",
                "FINANCIAL_APPROVAL_REMINDER",
                "Pending Approval: Subcontractor RA Bill #04",
                "BuildWell ERP: Subcontractor L&T Struct RA Bill #04 for $420,000 awaits executive sign-off for Friday RTGS cycle.",
                "DELIVERED",
                "SMS-GW-490233",
                now.minusMinutes(10),
                "{\"billId\":\"RA-BILL-401\",\"amount\":\"$420,000\"}",
                orgId
            ));
        }
    }
}
