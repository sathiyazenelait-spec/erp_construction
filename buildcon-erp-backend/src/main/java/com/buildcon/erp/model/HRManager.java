package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hr_managers")
@Getter
@Setter
@NoArgsConstructor
public class HRManager extends BaseUserEntity {

    private String roleName = "ROLE_HR_MANAGER";

    public HRManager(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
