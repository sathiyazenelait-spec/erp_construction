package com.buildcon.erp.repository;

import com.buildcon.erp.model.MD;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MDRepository extends JpaRepository<MD, Long> {
    Optional<MD> findByUsername(String username);
    Optional<MD> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
}
