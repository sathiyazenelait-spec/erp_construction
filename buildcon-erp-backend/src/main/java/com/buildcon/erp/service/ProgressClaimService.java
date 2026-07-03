package com.buildcon.erp.service;

import com.buildcon.erp.model.ProgressClaim;
import java.util.List;

public interface ProgressClaimService {
    ProgressClaim submitClaim(ProgressClaim claim);
    ProgressClaim approveClaim(Long id);
    ProgressClaim rejectClaim(Long id);
    ProgressClaim holdClaim(Long id);
    ProgressClaim payClaim(Long id, String paymentReference);
    List<ProgressClaim> getClaimsByProject(Long projectId);
    List<ProgressClaim> getClaimsBySubcontractor(Long subcontractorId);
    List<ProgressClaim> getClaimsByStatus(String status);
    List<ProgressClaim> getAllClaims();
    ProgressClaim getClaimById(Long id);
}
