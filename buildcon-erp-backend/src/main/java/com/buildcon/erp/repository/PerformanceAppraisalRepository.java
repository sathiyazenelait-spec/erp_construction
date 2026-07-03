package com.buildcon.erp.repository;

import com.buildcon.erp.model.PerformanceAppraisal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PerformanceAppraisalRepository extends JpaRepository<PerformanceAppraisal, Long> {
    List<PerformanceAppraisal> findByOrganizationId(Long organizationId);
}
