package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository repository;

    @Override
    public Project createProject(Project project) {
        if (project.getName() == null || project.getName().trim().isEmpty()) {
            throw new CustomValidationException("Error: Project name cannot be empty!");
        }
        return repository.save(project);
    }

    @Override
    public List<Project> getAllProjects() {
        return repository.findAll();
    }

    @Override
    public List<Project> getProjectsByOrganization(Long organizationId) {
        return repository.findByOrganizationId(organizationId);
    }

    @Override
    public Project getProjectById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CustomValidationException("Error: Project not found with id: " + id));
    }

    @Override
    public void deleteProject(Long id) {
        if (!repository.existsById(id)) {
            throw new CustomValidationException("Error: Project not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public Project updateProject(Long id, Project details) {
        Project existing = getProjectById(id);
        if (details.getName() != null) existing.setName(details.getName());
        if (details.getLocation() != null) existing.setLocation(details.getLocation());
        if (details.getBudget() != null) existing.setBudget(details.getBudget());
        if (details.getStartDate() != null) existing.setStartDate(details.getStartDate());
        if (details.getEndDate() != null) existing.setEndDate(details.getEndDate());
        if (details.getStatus() != null) existing.setStatus(details.getStatus());
        if (details.getDesignPlanName() != null) existing.setDesignPlanName(details.getDesignPlanName());
        if (details.getArchitectSpecName() != null) existing.setArchitectSpecName(details.getArchitectSpecName());
        if (details.getWorkforceDetails() != null) existing.setWorkforceDetails(details.getWorkforceDetails());
        if (details.getAiSuggestedBudget() != null) existing.setAiSuggestedBudget(details.getAiSuggestedBudget());
        if (details.getAiEstimatedHours() != null) existing.setAiEstimatedHours(details.getAiEstimatedHours());
        if (details.getAiHazardWarnings() != null) existing.setAiHazardWarnings(details.getAiHazardWarnings());
        if (details.getBuiltupSqft() != null) existing.setBuiltupSqft(details.getBuiltupSqft());
        if (details.getFloors() != null) existing.setFloors(details.getFloors());
        if (details.getLocationType() != null) existing.setLocationType(details.getLocationType());
        if (details.getPlanningImage() != null) existing.setPlanningImage(details.getPlanningImage());
        if (details.getConstructionImage() != null) existing.setConstructionImage(details.getConstructionImage());
        if (details.getBuildingModelImage() != null) existing.setBuildingModelImage(details.getBuildingModelImage());
        if (details.getArchitectName() != null) existing.setArchitectName(details.getArchitectName());
        if (details.getSiteManagementId() != null) existing.setSiteManagementId(details.getSiteManagementId());
        if (details.getPlannedProgress() != null) existing.setPlannedProgress(details.getPlannedProgress());
        if (details.getActualProgress() != null) existing.setActualProgress(details.getActualProgress());
        return repository.save(existing);
    }

    @Override
    public Project approveProject(Long id) {
        Project project = getProjectById(id);
        project.setStatus("Active");
        return repository.save(project);
    }
}
