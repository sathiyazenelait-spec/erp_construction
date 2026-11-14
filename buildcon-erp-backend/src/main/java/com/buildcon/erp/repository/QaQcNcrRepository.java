package com.buildcon.erp.repository;

import com.buildcon.erp.model.QaQcNcr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QaQcNcrRepository extends JpaRepository<QaQcNcr, Long> {
    List<QaQcNcr> findByOrganizationId(Long organizationId);
    void deleteByOrganizationId(Long organizationId);
}

