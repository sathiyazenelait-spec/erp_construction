package com.buildcon.erp.service;

import com.buildcon.erp.model.Subcontractor;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface SubcontractorService {
    Subcontractor register(GenericSignupRequest request);
}
