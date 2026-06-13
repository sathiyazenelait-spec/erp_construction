package com.buildcon.erp.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DirectorSignupRequest {
    private String username;
    private String email;
    private String password;
    private String directorRole; // e.g. ROLE_PROJECT_DIRECTOR

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
