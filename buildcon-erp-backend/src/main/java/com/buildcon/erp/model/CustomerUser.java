package com.buildcon.erp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "customer_users")
@Getter
@Setter
@NoArgsConstructor
public class CustomerUser extends BaseUserEntity {

    private String roleName = "ROLE_CUSTOMER";

    public CustomerUser(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}

