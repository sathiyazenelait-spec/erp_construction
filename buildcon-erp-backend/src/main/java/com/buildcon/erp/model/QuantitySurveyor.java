package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "quantity_surveyors")
@Getter
@Setter
@NoArgsConstructor
public class QuantitySurveyor extends BaseUserEntity {

    private String roleName = "ROLE_QUANTITY_SURVEYOR";

    public QuantitySurveyor(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
