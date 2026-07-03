package com.buildcon.erp.repository;

import com.buildcon.erp.model.StrategicGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StrategicGoalRepository extends JpaRepository<StrategicGoal, Long> {
    List<StrategicGoal> findByOrganizationId(Long organizationId);
}
