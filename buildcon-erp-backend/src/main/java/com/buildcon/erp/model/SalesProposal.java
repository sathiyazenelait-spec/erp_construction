package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sales_proposals")
public class SalesProposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lead_name", nullable = false, length = 100)
    private String leadName;

    @Column(name = "proposal_no", nullable = false, length = 50)
    private String proposalNo;

    @Column(nullable = false, length = 50)
    private String amount;

    @Column(name = "sent_on", nullable = false, length = 50)
    private String sentOn;

    @Column(nullable = false, length = 50)
    private String status; // Under Review, Negotiation, Approved, Rejected

    @Column(name = "organization_id")
    private Long organizationId;

    public SalesProposal() {
    }

    public SalesProposal(String leadName, String proposalNo, String amount, String sentOn, String status, Long organizationId) {
        this.leadName = leadName;
        this.proposalNo = proposalNo;
        this.amount = amount;
        this.sentOn = sentOn;
        this.status = status;
        this.organizationId = organizationId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLeadName() {
        return leadName;
    }

    public void setLeadName(String leadName) {
        this.leadName = leadName;
    }

    public String getProposalNo() {
        return proposalNo;
    }

    public void setProposalNo(String proposalNo) {
        this.proposalNo = proposalNo;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getSentOn() {
        return sentOn;
    }

    public void setSentOn(String sentOn) {
        this.sentOn = sentOn;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
