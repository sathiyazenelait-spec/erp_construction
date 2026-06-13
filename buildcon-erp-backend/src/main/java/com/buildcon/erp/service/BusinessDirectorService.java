package com.buildcon.erp.service;

import com.buildcon.erp.model.BusinessDirector;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface BusinessDirectorService {
    BusinessDirector register(GenericSignupRequest request);
}
