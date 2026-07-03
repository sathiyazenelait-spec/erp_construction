package com.buildcon.erp.repository;

import com.buildcon.erp.model.ChannelPerformanceMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelPerformanceMetricRepository extends JpaRepository<ChannelPerformanceMetric, Long> {
    List<ChannelPerformanceMetric> findByOrganizationId(Long organizationId);
}
