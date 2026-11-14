package com.buildcon.erp.repository;

import com.buildcon.erp.model.StoreManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StoreManagerRepository extends JpaRepository<StoreManager, Long> {
    Optional<StoreManager> findByUsername(String username);
    Optional<StoreManager> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    List<StoreManager> findByOrganizationId(Long organizationId);
}

