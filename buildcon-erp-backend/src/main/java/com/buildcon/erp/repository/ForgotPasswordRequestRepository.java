package com.buildcon.erp.repository;

import com.buildcon.erp.model.ForgotPasswordRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForgotPasswordRequestRepository extends JpaRepository<ForgotPasswordRequest, Long> {
    List<ForgotPasswordRequest> findByStatus(String status);
    List<ForgotPasswordRequest> findByRoleAndStatus(String role, String status);
    List<ForgotPasswordRequest> findByRoleNotAndOrganizationIdAndStatus(String role, Long organizationId, String status);
}
