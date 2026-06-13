package com.buildcon.erp.service;

import com.buildcon.erp.model.SeniorSiteEngineer;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface SeniorSiteEngineerService {
    SeniorSiteEngineer register(GenericSignupRequest request);
}
