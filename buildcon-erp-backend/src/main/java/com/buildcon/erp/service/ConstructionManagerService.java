package com.buildcon.erp.service;

import com.buildcon.erp.model.ConstructionManager;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface ConstructionManagerService {
    ConstructionManager register(GenericSignupRequest request);
}
