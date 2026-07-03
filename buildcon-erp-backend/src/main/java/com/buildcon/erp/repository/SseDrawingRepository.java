package com.buildcon.erp.repository;

import com.buildcon.erp.model.SseDrawing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SseDrawingRepository extends JpaRepository<SseDrawing, Long> {
    List<SseDrawing> findByOrganizationId(Long organizationId);
}
