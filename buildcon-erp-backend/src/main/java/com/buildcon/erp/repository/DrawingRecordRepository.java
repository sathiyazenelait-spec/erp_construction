package com.buildcon.erp.repository;

import com.buildcon.erp.model.DrawingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrawingRecordRepository extends JpaRepository<DrawingRecord, Long> {
    List<DrawingRecord> findByOrganizationId(Long organizationId);
    List<DrawingRecord> findByOrganizationIdOrderByUploadDateDesc(Long organizationId);
    List<DrawingRecord> findByProjectId(Long projectId);
    Optional<DrawingRecord> findByDrawingNumberAndRevision(String drawingNumber, String revision);
    List<DrawingRecord> findByDrawingNumberOrderByRevisionDesc(String drawingNumber);
}
