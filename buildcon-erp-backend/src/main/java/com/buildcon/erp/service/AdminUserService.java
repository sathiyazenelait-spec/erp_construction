package com.buildcon.erp.service;

import com.buildcon.erp.model.AdminUser;
import com.buildcon.erp.payload.request.GenericSignupRequest;

public interface AdminUserService {
    AdminUser register(GenericSignupRequest request);
}
