package com.buildcon.erp.repository;

import com.buildcon.erp.model.BusinessDirector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BusinessDirectorRepository extends JpaRepository<BusinessDirector, Long> {
    Optional<BusinessDirector> findByUsername(String username);
    Optional<BusinessDirector> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    java.util.List<BusinessDirector> findByOrganizationId(Long organizationId);
}
