package com.buildcon.erp.repository;

import com.buildcon.erp.model.SseNcr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SseNcrRepository extends JpaRepository<SseNcr, Long> {
    List<SseNcr> findByOrganizationId(Long organizationId);
}
