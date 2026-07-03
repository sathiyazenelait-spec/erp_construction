package com.buildcon.erp.repository;

import com.buildcon.erp.model.WmAttendanceTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WmAttendanceTrendRepository extends JpaRepository<WmAttendanceTrend, Long> {
    List<WmAttendanceTrend> findByOrganizationId(Long organizationId);
}
