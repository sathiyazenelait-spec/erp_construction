package com.buildcon.erp.service;

import com.buildcon.erp.model.SalesExecutive;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface SalesExecutiveService {
    SalesExecutive register(GenericSignupRequest request);
}
