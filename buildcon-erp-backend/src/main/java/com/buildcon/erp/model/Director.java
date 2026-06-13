package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "directors")
@Getter
@Setter
@NoArgsConstructor
public class Director {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(length = 50, unique = true, nullable = false)
    private String email;

    @Column(length = 120, nullable = false)
    private String password;

    // e.g. ROLE_PROJECT_DIRECTOR, ROLE_FINANCE_DIRECTOR, etc.
    @Column(length = 50, nullable = false)
    private String directorRole;

    public Director(String username, String email, String password, String directorRole) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.directorRole = directorRole;
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

    public String getDirectorRole() {
        return directorRole;
    }
}
