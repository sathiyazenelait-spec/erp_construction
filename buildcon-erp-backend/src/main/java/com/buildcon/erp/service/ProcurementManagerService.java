package com.buildcon.erp.service;

import com.buildcon.erp.model.ProcurementManager;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface ProcurementManagerService {
    ProcurementManager register(GenericSignupRequest request);
}
