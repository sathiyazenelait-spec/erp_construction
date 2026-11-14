package com.buildcon.erp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "qa_qc_engineers")
@Getter
@Setter
@NoArgsConstructor
public class QaQcEngineer extends BaseUserEntity {

    private String roleName = "ROLE_QA_QC_ENGINEER";

    public QaQcEngineer(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}

