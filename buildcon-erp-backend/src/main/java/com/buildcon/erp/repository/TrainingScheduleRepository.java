package com.buildcon.erp.repository;

import com.buildcon.erp.model.TrainingSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrainingScheduleRepository extends JpaRepository<TrainingSchedule, Long> {
    List<TrainingSchedule> findByOrganizationId(Long organizationId);
}
