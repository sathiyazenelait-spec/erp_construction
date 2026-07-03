package com.buildcon.erp.repository;

import com.buildcon.erp.model.MarketingMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarketingMetricRepository extends JpaRepository<MarketingMetric, Long> {
    List<MarketingMetric> findByOrganizationId(Long organizationId);
}
