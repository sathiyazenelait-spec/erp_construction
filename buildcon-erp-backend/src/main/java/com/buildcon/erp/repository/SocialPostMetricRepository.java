package com.buildcon.erp.repository;

import com.buildcon.erp.model.SocialPostMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SocialPostMetricRepository extends JpaRepository<SocialPostMetric, Long> {
    List<SocialPostMetric> findByOrganizationId(Long organizationId);
}
