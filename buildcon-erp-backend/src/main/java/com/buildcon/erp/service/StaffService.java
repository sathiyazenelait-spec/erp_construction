package com.buildcon.erp.service;

import com.buildcon.erp.model.Staff;
import com.buildcon.erp.payload.request.StaffSignupRequest;

public interface StaffService {
    Staff registerStaff(StaffSignupRequest request);
}
