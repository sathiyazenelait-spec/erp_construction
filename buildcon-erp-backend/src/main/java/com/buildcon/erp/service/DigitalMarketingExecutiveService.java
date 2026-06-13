package com.buildcon.erp.service;

import com.buildcon.erp.model.DigitalMarketingExecutive;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface DigitalMarketingExecutiveService {
    DigitalMarketingExecutive register(GenericSignupRequest request);
}
