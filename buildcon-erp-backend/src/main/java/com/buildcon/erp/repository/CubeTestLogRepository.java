package com.buildcon.erp.repository;

import com.buildcon.erp.model.CubeTestLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CubeTestLogRepository extends JpaRepository<CubeTestLog, Long> {
    List<CubeTestLog> findByProjectId(Long projectId);
    void deleteByProjectId(Long projectId);
}
