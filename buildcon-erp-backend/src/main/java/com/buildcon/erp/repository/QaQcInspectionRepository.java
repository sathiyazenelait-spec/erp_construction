package com.buildcon.erp.repository;

import com.buildcon.erp.model.QaQcInspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QaQcInspectionRepository extends JpaRepository<QaQcInspection, Long> {
    List<QaQcInspection> findByOrganizationId(Long organizationId);
    void deleteByOrganizationId(Long organizationId);
}

