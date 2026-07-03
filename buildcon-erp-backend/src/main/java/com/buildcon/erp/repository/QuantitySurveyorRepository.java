package com.buildcon.erp.repository;

import com.buildcon.erp.model.QuantitySurveyor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface QuantitySurveyorRepository extends JpaRepository<QuantitySurveyor, Long> {
    Optional<QuantitySurveyor> findByUsername(String username);
    Optional<QuantitySurveyor> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    java.util.List<QuantitySurveyor> findByOrganizationId(Long organizationId);
}
