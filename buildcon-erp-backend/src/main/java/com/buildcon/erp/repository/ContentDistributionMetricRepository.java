package com.buildcon.erp.repository;

import com.buildcon.erp.model.ContentDistributionMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentDistributionMetricRepository extends JpaRepository<ContentDistributionMetric, Long> {
    List<ContentDistributionMetric> findByOrganizationId(Long organizationId);
}
