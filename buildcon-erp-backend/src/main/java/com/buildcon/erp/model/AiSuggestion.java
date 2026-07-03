package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ai_suggestions")
public class AiSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String suggestionText;

    @Column(name = "organization_id")
    private Long organizationId;

    public AiSuggestion() {}

    public AiSuggestion(String suggestionText, Long organizationId) {
        this.suggestionText = suggestionText;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSuggestionText() { return suggestionText; }
    public void setSuggestionText(String suggestionText) { this.suggestionText = suggestionText; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
