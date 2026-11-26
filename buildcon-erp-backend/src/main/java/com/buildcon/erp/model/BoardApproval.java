package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "board_approvals")
@Getter
@Setter
@NoArgsConstructor
public class BoardApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String type; // PO, Capex, Opex, Material, Investment, Variation, Site Advance

    @Column(nullable = false, length = 250)
    private String details;

    @Column(nullable = false, length = 100)
    private String requester;

    @Column(name = "requester_role", length = 100)
    private String requesterRole;

    @Column(nullable = false, length = 50)
    private String amount;

    @Column(nullable = false, length = 20)
    private String priority = "Medium"; // High, Medium, Low

    @Column(nullable = false, length = 50)
    private String date;

    @Column(nullable = false, length = 30)
    private String status = "Pending"; // Pending, Approved, Rejected

    @Column(name = "chairman_remarks", length = 1500)
    private String chairmanRemarks;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "action_date", length = 50)
    private String actionDate;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(name = "ai_analysis_json", columnDefinition = "LONGTEXT")
    private String aiAnalysisJson;

    public BoardApproval(String type, String details, String requester, String requesterRole, String amount, String priority, String date, String status, String chairmanRemarks, String approvedBy, String actionDate, Long organizationId) {
        this.type = type;
        this.details = details;
        this.requester = requester;
        this.requesterRole = requesterRole;
        this.amount = amount;
        this.priority = priority;
        this.date = date;
        this.status = status;
        this.chairmanRemarks = chairmanRemarks;
        this.approvedBy = approvedBy;
        this.actionDate = actionDate;
        this.organizationId = organizationId;
    }
}
