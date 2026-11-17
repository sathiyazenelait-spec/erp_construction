package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "meeting_records")
@Getter
@Setter
@NoArgsConstructor
public class MeetingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_code", length = 50)
    private String meetingCode;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "project_ref", length = 100)
    private String projectRef;

    @Column(name = "meeting_date", nullable = false)
    private LocalDate meetingDate;

    @Column(name = "meeting_time", length = 30)
    private String meetingTime;

    @Column(length = 150)
    private String location;

    @Column(length = 100)
    private String chairperson;

    @Column(length = 1000)
    private String attendees;

    @Column(length = 1500)
    private String agenda;

    @Column(name = "discussion_notes", length = 3000)
    private String discussionNotes;

    @Column(name = "decisions_taken", length = 2000)
    private String decisionsTaken;

    @Column(length = 30)
    private String status; // SCHEDULED, COMPLETED, ADJOURNED

    @Column(name = "organization_id")
    private Long organizationId;

    public MeetingRecord(String meetingCode, String title, String projectRef, LocalDate meetingDate, String meetingTime, String location, String chairperson, String attendees, String agenda, String discussionNotes, String decisionsTaken, String status, Long organizationId) {
        this.meetingCode = meetingCode;
        this.title = title;
        this.projectRef = projectRef;
        this.meetingDate = meetingDate;
        this.meetingTime = meetingTime;
        this.location = location;
        this.chairperson = chairperson;
        this.attendees = attendees;
        this.agenda = agenda;
        this.discussionNotes = discussionNotes;
        this.decisionsTaken = decisionsTaken;
        this.status = status != null ? status : "COMPLETED";
        this.organizationId = organizationId;
    }
}
