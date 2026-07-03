package com.buildcon.erp.repository;

import com.buildcon.erp.model.SalesActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalesActivityRepository extends JpaRepository<SalesActivity, Long> {
    List<SalesActivity> findByOrganizationId(Long organizationId);
}
