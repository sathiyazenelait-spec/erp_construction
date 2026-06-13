package com.buildcon.erp.repository;

import com.buildcon.erp.model.ProgressClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProgressClaimRepository extends JpaRepository<ProgressClaim, Long> {
    List<ProgressClaim> findByProjectId(Long projectId);
    List<ProgressClaim> findBySubcontractorId(Long subcontractorId);
    List<ProgressClaim> findByStatus(String status);
    void deleteByProjectId(Long projectId);
}
