package com.buildcon.erp.repository;

import com.buildcon.erp.model.ProjectDirector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProjectDirectorRepository extends JpaRepository<ProjectDirector, Long> {
    Optional<ProjectDirector> findByUsername(String username);
    Optional<ProjectDirector> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    java.util.List<ProjectDirector> findByOrganizationId(Long organizationId);
}
