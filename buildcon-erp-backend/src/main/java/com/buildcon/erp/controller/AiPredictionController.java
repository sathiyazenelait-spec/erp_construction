package com.buildcon.erp.controller;

import com.buildcon.erp.model.AiPredictionReport;
import com.buildcon.erp.service.AiPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai-predictions")
public class AiPredictionController {

    @Autowired
    private AiPredictionService predictionService;

    @GetMapping("/org/{orgId}")
    public ResponseEntity<List<AiPredictionReport>> getPredictionsByOrg(@PathVariable Long orgId) {
        return ResponseEntity.ok(predictionService.getPredictionsByOrg(orgId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<AiPredictionReport> getLatestProjectPrediction(@PathVariable Long projectId) {
        return predictionService.getLatestPrediction(projectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    public ResponseEntity<AiPredictionReport> generatePrediction(@RequestBody Map<String, Object> body) {
        Long projectId = body.get("projectId") != null ? Long.valueOf(body.get("projectId").toString()) : 1L;
        String projectName = body.get("projectName") != null ? body.get("projectName").toString() : "Skyline Tech Park - Tower B";
        Long orgId = body.get("organizationId") != null ? Long.valueOf(body.get("organizationId").toString()) : 1L;

        AiPredictionReport report = predictionService.generatePrediction(projectId, projectName, orgId);
        return ResponseEntity.ok(report);
    }
}
