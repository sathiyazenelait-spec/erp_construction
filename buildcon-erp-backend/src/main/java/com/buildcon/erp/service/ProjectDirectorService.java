package com.buildcon.erp.service;

import com.buildcon.erp.model.ProjectDirector;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface ProjectDirectorService {
    ProjectDirector register(GenericSignupRequest request);
}
