package com.buildcon.erp.repository;

import com.buildcon.erp.model.Chairman;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChairmanRepository extends JpaRepository<Chairman, Long> {
    Optional<Chairman> findByUsername(String username);
    Optional<Chairman> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    java.util.List<Chairman> findByOrganizationId(Long organizationId);
}
