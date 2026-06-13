package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "digital_marketing_executives")
@Getter
@Setter
@NoArgsConstructor
public class DigitalMarketingExecutive extends BaseUserEntity {

    private String roleName = "ROLE_DIGITAL_MARKETING_EXECUTIVE";

    public DigitalMarketingExecutive(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
