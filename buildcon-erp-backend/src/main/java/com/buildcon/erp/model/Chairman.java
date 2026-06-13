package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chairmen")
@Getter
@Setter
@NoArgsConstructor
public class Chairman {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(length = 50, unique = true, nullable = false)
    private String email;

    @Column(length = 120, nullable = false)
    private String password;

    @Column(length = 50)
    private String chairmanRole = "ROLE_CHAIRMAN";

    @Column(name = "organization_id")
    private Long organizationId;

    public Chairman(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Chairman(String username, String email, String password, Long organizationId) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getChairmanRole() {
        return chairmanRole;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
