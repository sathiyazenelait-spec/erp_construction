package com.buildcon.erp.service;

import com.buildcon.erp.model.HRManager;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface HRManagerService {
    HRManager register(GenericSignupRequest request);
}
