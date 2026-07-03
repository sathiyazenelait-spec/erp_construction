package com.buildcon.erp.repository;

import com.buildcon.erp.model.ProjectAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectAlertRepository extends JpaRepository<ProjectAlert, Long> {
    List<ProjectAlert> findByOrganizationId(Long organizationId);
    List<ProjectAlert> findByProjectId(Long projectId);
}
