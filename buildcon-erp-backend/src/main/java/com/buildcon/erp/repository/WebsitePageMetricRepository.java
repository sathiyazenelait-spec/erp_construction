package com.buildcon.erp.repository;

import com.buildcon.erp.model.WebsitePageMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WebsitePageMetricRepository extends JpaRepository<WebsitePageMetric, Long> {
    List<WebsitePageMetric> findByOrganizationId(Long organizationId);
}
