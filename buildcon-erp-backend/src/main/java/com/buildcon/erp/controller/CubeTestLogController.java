package com.buildcon.erp.controller;

import com.buildcon.erp.model.CubeTestLog;
import com.buildcon.erp.service.CubeTestLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cube-tests")
public class CubeTestLogController {

    @Autowired
    private CubeTestLogService service;

    @PostMapping
    public ResponseEntity<CubeTestLog> logCubeTest(@RequestBody CubeTestLog log) {
        return ResponseEntity.ok(service.logCubeTest(log));
    }

    @GetMapping
    public ResponseEntity<List<CubeTestLog>> getAllLogs() {
        return ResponseEntity.ok(service.getAllLogs());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<CubeTestLog>> getLogsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(service.getLogsByProject(projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CubeTestLog> getLogById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getLogById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CubeTestLog> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}
