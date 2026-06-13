package com.buildcon.erp.service;

import com.buildcon.erp.model.Project;
import java.util.List;

public interface ProjectService {
    Project createProject(Project project);
    List<Project> getAllProjects();
    List<Project> getProjectsByOrganization(Long organizationId);
    Project getProjectById(Long id);
    void deleteProject(Long id);
    Project approveProject(Long id);
}
