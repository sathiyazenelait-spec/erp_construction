package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "managing_directors")
@Getter
@Setter
@NoArgsConstructor
public class MD extends BaseUserEntity {

    private String roleName = "ROLE_MD";

    public MD(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
