package com.buildcon.erp.service;

import com.buildcon.erp.model.WorkforceManager;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface WorkforceManagerService {
    WorkforceManager register(GenericSignupRequest request);
    void seedWorkforceData(Long orgId);
}
