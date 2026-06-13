package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "business_directors")
@Getter
@Setter
@NoArgsConstructor
public class BusinessDirector extends BaseUserEntity {

    private String roleName = "ROLE_BUSINESS_DIRECTOR";

    public BusinessDirector(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
