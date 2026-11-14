package com.buildcon.erp.service;

import com.buildcon.erp.model.StoreManager;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface StoreManagerService {
    StoreManager register(GenericSignupRequest request);
    void seedStoreData(Long organizationId);
}

