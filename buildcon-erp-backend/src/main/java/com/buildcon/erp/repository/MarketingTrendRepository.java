package com.buildcon.erp.repository;

import com.buildcon.erp.model.MarketingTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarketingTrendRepository extends JpaRepository<MarketingTrend, Long> {
    List<MarketingTrend> findByOrganizationId(Long organizationId);
}
