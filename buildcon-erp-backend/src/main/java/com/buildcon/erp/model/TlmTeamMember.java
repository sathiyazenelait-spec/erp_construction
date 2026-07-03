package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tlm_team_members")
public class TlmTeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String role;
    private Integer tasksAssigned;
    private Integer tasksCompleted;
    private Integer leadsGenerated;
    private String avatar;

    @Column(name = "organization_id")
    private Long organizationId;

    public TlmTeamMember() {}

    public TlmTeamMember(String name, String role, Integer tasksAssigned, Integer tasksCompleted, Integer leadsGenerated, String avatar, Long organizationId) {
        this.name = name;
        this.role = role;
        this.tasksAssigned = tasksAssigned;
        this.tasksCompleted = tasksCompleted;
        this.leadsGenerated = leadsGenerated;
        this.avatar = avatar;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getTasksAssigned() {
        return tasksAssigned;
    }

    public void setTasksAssigned(Integer tasksAssigned) {
        this.tasksAssigned = tasksAssigned;
    }

    public Integer getTasksCompleted() {
        return tasksCompleted;
    }

    public void setTasksCompleted(Integer tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }

    public Integer getLeadsGenerated() {
        return leadsGenerated;
    }

    public void setLeadsGenerated(Integer leadsGenerated) {
        this.leadsGenerated = leadsGenerated;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
