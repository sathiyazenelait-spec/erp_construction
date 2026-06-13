package com.buildcon.erp.service;

import com.buildcon.erp.model.QuantitySurveyor;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface QuantitySurveyorService {
    QuantitySurveyor register(GenericSignupRequest request);
}
