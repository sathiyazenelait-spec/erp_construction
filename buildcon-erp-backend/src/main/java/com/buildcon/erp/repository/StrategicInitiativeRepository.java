package com.buildcon.erp.repository;

import com.buildcon.erp.model.StrategicInitiative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StrategicInitiativeRepository extends JpaRepository<StrategicInitiative, Long> {
    List<StrategicInitiative> findByOrganizationId(Long organizationId);
}
