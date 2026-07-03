package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "training_schedules")
public class TrainingSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String assignedGroup;

    @Column(nullable = false, length = 50)
    private String attendeesCount;

    @Column(nullable = false, length = 50)
    private String completionDate;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public TrainingSchedule() {
    }

    public TrainingSchedule(String name, String assignedGroup, String attendeesCount, String completionDate, String status, Long organizationId) {
        this.name = name;
        this.assignedGroup = assignedGroup;
        this.attendeesCount = attendeesCount;
        this.completionDate = completionDate;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAssignedGroup() {
        return assignedGroup;
    }

    public void setAssignedGroup(String assignedGroup) {
        this.assignedGroup = assignedGroup;
    }

    public String getAttendeesCount() {
        return attendeesCount;
    }

    public void setAttendeesCount(String attendeesCount) {
        this.attendeesCount = attendeesCount;
    }

    public String getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(String completionDate) {
        this.completionDate = completionDate;
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
