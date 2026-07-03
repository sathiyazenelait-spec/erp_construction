package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.model.ProjectAlert;
import com.buildcon.erp.repository.ProjectAlertRepository;
import com.buildcon.erp.service.ProjectAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectAlertServiceImpl implements ProjectAlertService {

    @Autowired
    private ProjectAlertRepository repository;

    @Override
    public ProjectAlert createAlert(ProjectAlert alert) {
        if (alert.getProjectId() == null) {
            throw new CustomValidationException("Error: Project ID is required for progress alerts!");
        }
        return repository.save(alert);
    }

    @Override
    public List<ProjectAlert> getAlertsByOrganization(Long organizationId) {
        return repository.findByOrganizationId(organizationId);
    }

    @Override
    public List<ProjectAlert> getAlertsByProject(Long projectId) {
        return repository.findByProjectId(projectId);
    }

    @Override
    public ProjectAlert getAlertById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CustomValidationException("Error: Project alert not found with ID: " + id));
    }

    @Override
    public ProjectAlert submitJustification(Long id, String justification) {
        ProjectAlert alert = getAlertById(id);
        alert.setSiteEngineerJustification(justification);
        return repository.save(alert);
    }

    @Override
    public ProjectAlert resolveAlert(Long id) {
        ProjectAlert alert = getAlertById(id);
        alert.setResolved(true);
        return repository.save(alert);
    }
}
