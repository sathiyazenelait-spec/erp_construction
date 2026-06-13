package com.buildcon.erp.service;

import com.buildcon.erp.model.DigitalMarketingTL;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface DigitalMarketingTLService {
    DigitalMarketingTL register(GenericSignupRequest request);
}
