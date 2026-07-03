package com.buildcon.erp.repository;

import com.buildcon.erp.model.AudienceInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AudienceInsightRepository extends JpaRepository<AudienceInsight, Long> {
    List<AudienceInsight> findByOrganizationId(Long organizationId);
}
