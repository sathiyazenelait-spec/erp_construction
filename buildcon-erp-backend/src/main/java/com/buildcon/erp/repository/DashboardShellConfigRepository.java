package com.buildcon.erp.repository;

import com.buildcon.erp.model.DashboardShellConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DashboardShellConfigRepository extends JpaRepository<DashboardShellConfig, Long> {
    List<DashboardShellConfig> findByOrganizationIdAndDashboardType(Long organizationId, String dashboardType);
}
