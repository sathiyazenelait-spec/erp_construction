package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "finance_accounts")
@Getter
@Setter
@NoArgsConstructor
public class FinanceAccounts extends BaseUserEntity {

    private String roleName = "ROLE_FINANCE_ACCOUNTS";

    public FinanceAccounts(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
