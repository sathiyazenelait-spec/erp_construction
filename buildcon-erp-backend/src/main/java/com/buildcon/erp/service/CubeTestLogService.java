package com.buildcon.erp.service;

import com.buildcon.erp.model.CubeTestLog;
import java.util.List;

public interface CubeTestLogService {
    CubeTestLog logCubeTest(CubeTestLog log);
    List<CubeTestLog> getLogsByProject(Long projectId);
    List<CubeTestLog> getAllLogs();
    CubeTestLog getLogById(Long id);
    CubeTestLog updateStatus(Long id, String status);
}
