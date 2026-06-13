package com.buildcon.erp.repository;

import com.buildcon.erp.model.ProjectManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProjectManagerRepository extends JpaRepository<ProjectManager, Long> {
    Optional<ProjectManager> findByUsername(String username);
    Optional<ProjectManager> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    java.util.List<ProjectManager> findByOrganizationId(Long organizationId);
}
