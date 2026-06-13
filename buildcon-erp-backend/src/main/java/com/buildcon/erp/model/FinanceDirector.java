package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "finance_directors")
@Getter
@Setter
@NoArgsConstructor
public class FinanceDirector extends BaseUserEntity {

    private String roleName = "ROLE_FINANCE_DIRECTOR";

    public FinanceDirector(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
