package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "project_managers")
@Getter
@Setter
@NoArgsConstructor
public class ProjectManager extends BaseUserEntity {

    private String roleName = "ROLE_PROJECT_MANAGER";

    public ProjectManager(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
