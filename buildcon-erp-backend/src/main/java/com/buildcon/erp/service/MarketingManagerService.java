package com.buildcon.erp.service;

import com.buildcon.erp.model.MarketingManager;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface MarketingManagerService {
    MarketingManager register(GenericSignupRequest request);
}
