package com.buildcon.erp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vendor_suppliers")
@Getter
@Setter
@NoArgsConstructor
public class VendorSupplier extends BaseUserEntity {

    private String roleName = "ROLE_VENDOR";

    public VendorSupplier(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}

