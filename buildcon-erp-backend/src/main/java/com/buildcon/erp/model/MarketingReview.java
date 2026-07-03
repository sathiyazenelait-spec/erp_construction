package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "marketing_reviews")
public class MarketingReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String author;
    private Integer rating;

    @Column(length = 2000)
    private String text;

    private String date;

    @Column(length = 2000)
    private String reply;

    @Column(name = "organization_id")
    private Long organizationId;

    public MarketingReview() {}

    public MarketingReview(String author, Integer rating, String text, String date, String reply, Long organizationId) {
        this.author = author;
        this.rating = rating;
        this.text = text;
        this.date = date;
        this.reply = reply;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
