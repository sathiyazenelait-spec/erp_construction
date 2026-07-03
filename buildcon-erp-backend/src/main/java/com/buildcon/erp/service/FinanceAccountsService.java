package com.buildcon.erp.service;

import com.buildcon.erp.model.FinanceAccounts;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface FinanceAccountsService {
    FinanceAccounts register(GenericSignupRequest request);
    void seedFinanceData(Long orgId);
}
