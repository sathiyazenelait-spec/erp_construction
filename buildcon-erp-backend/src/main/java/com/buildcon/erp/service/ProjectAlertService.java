package com.buildcon.erp.service;

import com.buildcon.erp.model.ProjectAlert;
import java.util.List;

public interface ProjectAlertService {
    ProjectAlert createAlert(ProjectAlert alert);
    List<ProjectAlert> getAlertsByOrganization(Long organizationId);
    List<ProjectAlert> getAlertsByProject(Long projectId);
    ProjectAlert getAlertById(Long id);
    ProjectAlert submitJustification(Long id, String justification);
    ProjectAlert resolveAlert(Long id);
}
