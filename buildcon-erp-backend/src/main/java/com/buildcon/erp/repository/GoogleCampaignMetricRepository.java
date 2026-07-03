package com.buildcon.erp.repository;

import com.buildcon.erp.model.GoogleCampaignMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoogleCampaignMetricRepository extends JpaRepository<GoogleCampaignMetric, Long> {
    List<GoogleCampaignMetric> findByOrganizationId(Long organizationId);
}
