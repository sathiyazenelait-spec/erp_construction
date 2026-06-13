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
    public Project approveProject(Long id) {
        Project project = getProjectById(id);
        project.setStatus("Active");
        return repository.save(project);
    }
}
