package com.buildcon.erp.repository;

import com.buildcon.erp.model.EngagementEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EngagementEventRepository extends JpaRepository<EngagementEvent, Long> {
    List<EngagementEvent> findByOrganizationId(Long organizationId);
}
