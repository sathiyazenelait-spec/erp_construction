package com.buildcon.erp.repository;

import com.buildcon.erp.model.QaQcEngineer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface QaQcEngineerRepository extends JpaRepository<QaQcEngineer, Long> {
    Optional<QaQcEngineer> findByUsername(String username);
    Optional<QaQcEngineer> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    List<QaQcEngineer> findByOrganizationId(Long organizationId);
}

