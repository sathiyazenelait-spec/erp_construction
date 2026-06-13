package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "project_directors")
@Getter
@Setter
@NoArgsConstructor
public class ProjectDirector extends BaseUserEntity {

    private String roleName = "ROLE_PROJECT_DIRECTOR";

    public ProjectDirector(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
