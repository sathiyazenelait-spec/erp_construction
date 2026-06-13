package com.buildcon.erp.controller;

import com.buildcon.erp.model.Chairman;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.model.ProgressClaim;
import com.buildcon.erp.payload.request.ChairmanSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.ChairmanService;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.repository.ProgressClaimRepository;
import com.buildcon.erp.repository.ProjectManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chairman")
public class ChairmanController {

    @Autowired
    private ChairmanService chairmanService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProgressClaimRepository progressClaimRepository;

    @Autowired
    private ProjectManagerRepository projectManagerRepository;

    @Autowired
    private com.buildcon.erp.repository.OrganizationRepository organizationRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerChairman(@RequestBody ChairmanSignupRequest signUpRequest) {
        Chairman chairman = chairmanService.registerChairman(signUpRequest);
        return ResponseEntity.ok(new MessageResponse("Chairman registered successfully with ID: " + chairman.getId()));
    }

    @GetMapping("/dashboard/{orgId}")
    public ResponseEntity<?> getDashboardStats(@PathVariable Long orgId) {
        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        
        long totalProjects = projects.size();
        long activeProjects = 0;
        long delayedProjects = 0;
        long planningProjects = 0;
        double totalBudget = 0.0;
        double totalExpenses = 0.0;

        for (Project project : projects) {
            totalBudget += project.getBudget() != null ? project.getBudget() : 0.0;
            
            String status = project.getStatus();
            if ("Active".equalsIgnoreCase(status)) {
                activeProjects++;
            } else if ("Delayed".equalsIgnoreCase(status) || "Suspended".equalsIgnoreCase(status)) {
                delayedProjects++;
            } else {
                planningProjects++;
            }

            // Sum up approved/paid progress claims for totalExpenses
            List<ProgressClaim> claims = progressClaimRepository.findByProjectId(project.getId());
            for (ProgressClaim claim : claims) {
                if ("APPROVED".equalsIgnoreCase(claim.getStatus()) || "PAID".equalsIgnoreCase(claim.getStatus())) {
                    totalExpenses += claim.getAmountRequested() != null ? claim.getAmountRequested() : 0.0;
                }
            }
        }

        // Count PMs to estimate dynamic workforce metrics
        long pmCount = projectManagerRepository.findByOrganizationId(orgId).size();
        long simulatedStaffCount = 12 + (pmCount * 3);
        long simulatedLabourCount = 140 + (activeProjects * 38);

        java.util.Optional<com.buildcon.erp.model.Organization> orgOpt = organizationRepository.findById(orgId);
        String orgName = "BuildCon Organization";
        String subscriptionTier = "Enterprise";
        if (orgOpt.isPresent()) {
            orgName = orgOpt.get().getName();
            subscriptionTier = orgOpt.get().getSubscriptionTier();
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjects", totalProjects);
        stats.put("activeProjects", activeProjects);
        stats.put("delayedProjects", delayedProjects);
        stats.put("planningProjects", planningProjects);
        stats.put("totalBudget", totalBudget);
        stats.put("totalExpenses", totalExpenses);
        stats.put("staffCount", simulatedStaffCount);
        stats.put("labourCount", simulatedLabourCount);
        stats.put("orgName", orgName);
        stats.put("subscriptionTier", subscriptionTier);

        return ResponseEntity.ok(stats);
    }
}
