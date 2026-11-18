package com.buildcon.erp.repository;

import com.buildcon.erp.model.AiPredictionReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiPredictionReportRepository extends JpaRepository<AiPredictionReport, Long> {
    List<AiPredictionReport> findByOrganizationId(Long organizationId);
    Optional<AiPredictionReport> findFirstByProjectIdOrderByGeneratedAtDesc(Long projectId);
    List<AiPredictionReport> findByOrganizationIdOrderByGeneratedAtDesc(Long organizationId);
}
