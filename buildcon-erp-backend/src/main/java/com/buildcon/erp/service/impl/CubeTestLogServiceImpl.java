package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.model.CubeTestLog;
import com.buildcon.erp.repository.CubeTestLogRepository;
import com.buildcon.erp.service.CubeTestLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class CubeTestLogServiceImpl implements CubeTestLogService {

    @Autowired
    private CubeTestLogRepository repository;

    @Override
    public CubeTestLog logCubeTest(CubeTestLog log) {
        if (log.getGrade() == null || log.getGrade().trim().isEmpty()) {
            throw new CustomValidationException("Error: Cube concrete grade is required!");
        }
        log.setSampleDate(LocalDate.now());
        log.setStatus("PENDING");
        return repository.save(log);
    }

    @Override
    public List<CubeTestLog> getLogsByProject(Long projectId) {
        return repository.findByProjectId(projectId);
    }

    @Override
    public List<CubeTestLog> getAllLogs() {
        return repository.findAll();
    }

    @Override
    public CubeTestLog getLogById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CustomValidationException("Error: Cube test log not found with id: " + id));
    }

    @Override
    public CubeTestLog updateStatus(Long id, String status) {
        CubeTestLog log = getLogById(id);
        log.setStatus(status);
        return repository.save(log);
    }
}
