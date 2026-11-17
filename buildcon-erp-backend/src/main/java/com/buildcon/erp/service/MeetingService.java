package com.buildcon.erp.service;

import com.buildcon.erp.model.MeetingActionItem;
import com.buildcon.erp.model.MeetingRecord;
import com.buildcon.erp.repository.MeetingActionItemRepository;
import com.buildcon.erp.repository.MeetingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MeetingService {

    @Autowired
    private MeetingRecordRepository meetingRecordRepository;

    @Autowired
    private MeetingActionItemRepository actionItemRepository;

    public List<MeetingRecord> getMeetings(Long orgId) {
        seedMeetingData(orgId);
        return meetingRecordRepository.findByOrganizationIdOrderByMeetingDateDesc(orgId);
    }

    public List<MeetingActionItem> getActionItems(Long orgId) {
        seedMeetingData(orgId);
        return actionItemRepository.findByOrganizationIdOrderByDueDateAsc(orgId);
    }

    public MeetingRecord createMeeting(MeetingRecord meeting) {
        if (meeting.getMeetingCode() == null || meeting.getMeetingCode().isBlank()) {
            meeting.setMeetingCode("MOM-" + LocalDate.now().getYear() + "-" + (System.currentTimeMillis() % 1000));
        }
        if (meeting.getMeetingDate() == null) {
            meeting.setMeetingDate(LocalDate.now());
        }
        if (meeting.getStatus() == null) {
            meeting.setStatus("COMPLETED");
        }
        return meetingRecordRepository.save(meeting);
    }

    public MeetingActionItem createActionItem(MeetingActionItem item) {
        if (item.getStatus() == null) {
            item.setStatus("OPEN");
        }
        if (item.getDueDate() == null) {
            item.setDueDate(LocalDate.now().plusDays(7));
        }
        return actionItemRepository.save(item);
    }

    public Optional<MeetingActionItem> updateActionItemStatus(Long id, String status) {
        return actionItemRepository.findById(id).map(item -> {
            item.setStatus(status);
            return actionItemRepository.save(item);
        });
    }

    public void seedMeetingData(Long orgId) {
        if (meetingRecordRepository.findByOrganizationIdOrderByMeetingDateDesc(orgId).isEmpty()) {
            LocalDate today = LocalDate.now();

            MeetingRecord m1 = new MeetingRecord(
                "MOM-2026-081",
                "Weekly Site Progress & Tower B Casting Coordination",
                "Skyline Residences",
                today.minusDays(3),
                "10:30 AM - 12:00 PM",
                "Site Conference Room A",
                "Er. K. Natarajan (Project Director)",
                "Site Manager, Structural Consultant, L&T Subcontractor Lead, QA/QC Head, Store In-charge",
                "1. Tower B 14th floor slab concrete pour schedule\n2. Rebar staging bottlenecks at Bay 3\n3. Monsoon waterproofing slurry inspection",
                "Discussion emphasized that transit mixers must be batched with retarded admixture to prevent cold joints. Store confirmed 28 MT Fe550 rebar is reserved. QA confirmed cover blocks verified.",
                "1. Approved Sunday night concrete pour (320 cum).\n2. Assigned extra transit mixer backup from Guindy plant.\n3. Mandatory safety harness checklist before faÃ§ade scaffolding climb.",
                "COMPLETED",
                orgId
            );
            m1 = meetingRecordRepository.save(m1);

            actionItemRepository.save(new MeetingActionItem(
                m1.getId(),
                m1.getMeetingCode(),
                "Mobilize 2 additional concrete boom pumps by Saturday 18:00 hrs",
                "Construction Manager",
                today.plusDays(2),
                "HIGH",
                "OPEN",
                "Coordinated with Schwing Stetter vendor",
                orgId
            ));

            actionItemRepository.save(new MeetingActionItem(
                m1.getId(),
                m1.getMeetingCode(),
                "Submit non-shrink grout cube test reports for Shear Wall SW-03",
                "QA/QC Engineer",
                today.plusDays(4),
                "MEDIUM",
                "IN_PROGRESS",
                "7-day cube curing underway in site lab",
                orgId
            ));

            MeetingRecord m2 = new MeetingRecord(
                "MOM-2026-082",
                "Commercial Procurement & Vendor Quotation Negotiation",
                "Phoenix Commercial Complex",
                today.minusDays(6),
                "03:00 PM - 04:30 PM",
                "Corporate Boardroom 2",
                "V. Ramanathan (Finance Director)",
                "Procurement Head, Tata Tiscon Rep, UltraTech Area Lead, Chief QS",
                "1. Q3 bulk steel rate locking\n2. Credit term extension to 45 days for cement indents\n3. Weighbridge slip integration",
                "Suppliers agreed to hold price parity at $54,500/MT for 60 days on condition of minimum monthly drawdown of 120 MT.",
                "Approved procurement agreement with Tata Tiscon. Finance cleared $1.56M advance cheque release.",
                "COMPLETED",
                orgId
            );
            m2 = meetingRecordRepository.save(m2);

            actionItemRepository.save(new MeetingActionItem(
                m2.getId(),
                m2.getMeetingCode(),
                "Issue finalized Purchase Order PO-2026-118 with signed price schedule",
                "Purchase Manager",
                today.minusDays(1),
                "HIGH",
                "COMPLETED",
                "PO issued & acknowledged on vendor extranet",
                orgId
            ));
        }
    }
}
