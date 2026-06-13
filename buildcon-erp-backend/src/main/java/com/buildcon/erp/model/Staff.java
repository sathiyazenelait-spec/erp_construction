package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "staffs")
@Getter
@Setter
@NoArgsConstructor
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(length = 50, unique = true, nullable = false)
    private String email;

    @Column(length = 120, nullable = false)
    private String password;

    // e.g. ROLE_PROJECT_MANAGER, ROLE_SUBCONTRACTOR, etc.
    @Column(length = 50, nullable = false)
    private String staffRole;

    public Staff(String username, String email, String password, String staffRole) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.staffRole = staffRole;
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

    public String getStaffRole() {
        return staffRole;
    }
}
