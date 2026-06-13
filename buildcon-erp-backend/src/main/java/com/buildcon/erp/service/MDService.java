package com.buildcon.erp.service;

import com.buildcon.erp.model.MD;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface MDService {
    MD register(GenericSignupRequest request);
}
