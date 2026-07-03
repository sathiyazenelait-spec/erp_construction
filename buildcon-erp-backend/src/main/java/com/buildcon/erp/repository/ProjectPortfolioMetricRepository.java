package com.buildcon.erp.repository;

import com.buildcon.erp.model.ProjectPortfolioMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectPortfolioMetricRepository extends JpaRepository<ProjectPortfolioMetric, Long> {
    List<ProjectPortfolioMetric> findByOrganizationId(Long organizationId);
}
