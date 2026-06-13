package com.buildcon.erp.service;

import com.buildcon.erp.model.FinanceDirector;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface FinanceDirectorService {
    FinanceDirector register(GenericSignupRequest request);
}
