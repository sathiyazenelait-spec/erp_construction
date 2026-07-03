package com.buildcon.erp.controller;

import com.buildcon.erp.model.Project;
import com.buildcon.erp.service.ProjectService;
import com.buildcon.erp.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService service;

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(service.createProject(project));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(service.getAllProjects());
    }

    @GetMapping("/org/{orgId}")
    public ResponseEntity<List<Project>> getProjectsByOrganization(@PathVariable Long orgId) {
        return ResponseEntity.ok(service.getProjectsByOrganization(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getProjectById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable Long id) {
        service.deleteProject(id);
        return ResponseEntity.ok("Project deleted successfully!");
    }

    @Autowired
    private com.buildcon.erp.repository.SiteManagementRepository siteManagementRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        return ResponseEntity.ok(service.updateProject(id, project));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Project> approveProject(@PathVariable Long id) {
        return ResponseEntity.ok(service.approveProject(id));
    }

    @GetMapping("/assigned-site")
    public ResponseEntity<List<Project>> getProjectsAssignedToSiteManager(java.security.Principal principal) {
        String username = principal.getName();
        com.buildcon.erp.model.SiteManagement sm = siteManagementRepository.findByUsername(username)
                .or(() -> siteManagementRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Site Manager user not found"));

        return ResponseEntity.ok(projectRepository.findBySiteManagementId(sm.getId()));
    }

    @PutMapping("/{id}/assign-site/{managerId}")
    public ResponseEntity<Project> assignSiteManager(@PathVariable Long id, @PathVariable Long managerId) {
        Project project = service.getProjectById(id);
        project.setSiteManagementId(managerId);
        return ResponseEntity.ok(service.updateProject(id, project));
    }
}
