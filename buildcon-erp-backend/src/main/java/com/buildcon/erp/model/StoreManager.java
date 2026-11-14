package com.buildcon.erp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "store_managers")
@Getter
@Setter
@NoArgsConstructor
public class StoreManager extends BaseUserEntity {

    private String roleName = "ROLE_STORE_MANAGER";

    public StoreManager(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}

