package com.buildcon.erp.repository;

import com.buildcon.erp.model.MarketingTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarketingTaskRepository extends JpaRepository<MarketingTask, Long> {
    List<MarketingTask> findByOrganizationId(Long organizationId);
}
