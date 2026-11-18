package com.buildcon.erp.repository;

import com.buildcon.erp.model.DrawingClashRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DrawingClashRecordRepository extends JpaRepository<DrawingClashRecord, Long> {
    List<DrawingClashRecord> findByDrawingId(Long drawingId);
    List<DrawingClashRecord> findByOrganizationId(Long organizationId);
    List<DrawingClashRecord> findByOrganizationIdAndResolutionStatus(Long organizationId, String resolutionStatus);
}
