package com.buildcon.erp.repository;

import com.buildcon.erp.model.SubcontractorAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubcontractorAttendanceRepository extends JpaRepository<SubcontractorAttendance, Long> {
    List<SubcontractorAttendance> findByOrganizationId(Long organizationId);
    List<SubcontractorAttendance> findBySubcontractorId(Long subcontractorId);
}
