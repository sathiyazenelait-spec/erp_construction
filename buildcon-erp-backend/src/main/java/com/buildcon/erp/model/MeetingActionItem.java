package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "meeting_action_items")
@Getter
@Setter
@NoArgsConstructor
public class MeetingActionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_id")
    private Long meetingId;

    @Column(name = "meeting_code", length = 50)
    private String meetingCode;

    @Column(name = "task_description", nullable = false, length = 500)
    private String taskDescription;

    @Column(name = "assigned_to", nullable = false, length = 100)
    private String assignedTo;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(length = 30)
    private String priority; // HIGH, MEDIUM, LOW

    @Column(length = 30)
    private String status; // OPEN, IN_PROGRESS, COMPLETED

    @Column(length = 500)
    private String remarks;

    @Column(name = "organization_id")
    private Long organizationId;

    public MeetingActionItem(Long meetingId, String meetingCode, String taskDescription, String assignedTo, LocalDate dueDate, String priority, String status, String remarks, Long organizationId) {
        this.meetingId = meetingId;
        this.meetingCode = meetingCode;
        this.taskDescription = taskDescription;
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.priority = priority != null ? priority : "MEDIUM";
        this.status = status != null ? status : "OPEN";
        this.remarks = remarks;
        this.organizationId = organizationId;
    }
}
