package com.buildcon.erp.service;

import com.buildcon.erp.model.Chairman;
import com.buildcon.erp.payload.request.ChairmanSignupRequest;

public interface ChairmanService {
    Chairman registerChairman(ChairmanSignupRequest request);
}
