package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fa_transactions")
public class FaTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tx_id")
    private String txId;

    private String party;
    private String type; // Receivable, Payable
    private Double amount;

    @Column(name = "due_date")
    private String dueDate;

    private String status; // Paid, Pending, Overdue

    @Column(name = "organization_id")
    private Long organizationId;

    public FaTransaction() {}

    public FaTransaction(String txId, String party, String type, Double amount, String dueDate, String status, Long organizationId) {
        this.txId = txId;
        this.party = party;
        this.type = type;
        this.amount = amount;
        this.dueDate = dueDate;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTxId() {
        return txId;
    }

    public void setTxId(String txId) {
        this.txId = txId;
    }

    public String getParty() {
        return party;
    }

    public void setParty(String party) {
        this.party = party;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
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
