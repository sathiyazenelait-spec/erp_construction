package com.buildcon.erp.service;

import com.buildcon.erp.model.QaQcEngineer;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface QaQcEngineerService {
    QaQcEngineer register(GenericSignupRequest request);
    void seedQaQcData(Long organizationId);
}

