package com.buildcon.erp.repository;

import com.buildcon.erp.model.WebsiteHealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebsiteHealthMetricRepository extends JpaRepository<WebsiteHealthMetric, Long> {
    List<WebsiteHealthMetric> findByOrganizationId(Long organizationId);
}
