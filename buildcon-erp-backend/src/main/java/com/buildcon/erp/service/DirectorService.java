package com.buildcon.erp.service;

import com.buildcon.erp.model.Director;
import com.buildcon.erp.payload.request.DirectorSignupRequest;

public interface DirectorService {
    Director registerDirector(DirectorSignupRequest request);
}
