package com.buildcon.erp.service;

import com.buildcon.erp.model.ProjectManager;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface ProjectManagerService {
    ProjectManager register(GenericSignupRequest request);
}
