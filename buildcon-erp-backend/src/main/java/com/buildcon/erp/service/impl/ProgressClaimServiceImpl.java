package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.model.ProgressClaim;
import com.buildcon.erp.repository.ProgressClaimRepository;
import com.buildcon.erp.service.ProgressClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ProgressClaimServiceImpl implements ProgressClaimService {

    @Autowired
    private ProgressClaimRepository repository;

    @Override
    public ProgressClaim submitClaim(ProgressClaim claim) {
        if (claim.getAmountRequested() == null || claim.getAmountRequested() <= 0) {
            throw new CustomValidationException("Error: Requested amount must be greater than zero!");
        }
        claim.setStatus("PENDING");
        claim.setSubmittedDate(LocalDate.now());
        return repository.save(claim);
    }

    @Override
    public ProgressClaim approveClaim(Long id) {
        ProgressClaim claim = getClaimById(id);
        claim.setStatus("APPROVED");
        claim.setApprovedDate(LocalDate.now());
        return repository.save(claim);
    }

    @Override
    public ProgressClaim rejectClaim(Long id) {
        ProgressClaim claim = getClaimById(id);
        claim.setStatus("REJECTED");
        return repository.save(claim);
    }

    @Override
    public ProgressClaim payClaim(Long id, String paymentReference) {
        ProgressClaim claim = getClaimById(id);
        if (!"APPROVED".equals(claim.getStatus())) {
            throw new CustomValidationException("Error: Claim must be APPROVED before payment release!");
        }
        claim.setStatus("PAID");
        claim.setPaymentReference(paymentReference);
        return repository.save(claim);
    }

    @Override
    public List<ProgressClaim> getClaimsByProject(Long projectId) {
        return repository.findByProjectId(projectId);
    }

    @Override
    public List<ProgressClaim> getClaimsBySubcontractor(Long subcontractorId) {
        return repository.findBySubcontractorId(subcontractorId);
    }

    @Override
    public List<ProgressClaim> getClaimsByStatus(String status) {
        return repository.findByStatus(status);
    }

    @Override
    public List<ProgressClaim> getAllClaims() {
        return repository.findAll();
    }

    @Override
    public ProgressClaim getClaimById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CustomValidationException("Error: Progress claim not found with id: " + id));
    }
}
