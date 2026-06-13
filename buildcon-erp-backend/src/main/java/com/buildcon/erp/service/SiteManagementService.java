package com.buildcon.erp.service;

import com.buildcon.erp.model.SiteManagement;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface SiteManagementService {
    SiteManagement register(GenericSignupRequest request);
}
