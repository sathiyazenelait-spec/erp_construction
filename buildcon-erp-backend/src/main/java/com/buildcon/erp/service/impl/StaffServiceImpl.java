package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.Staff;
import com.buildcon.erp.payload.request.StaffSignupRequest;
import com.buildcon.erp.repository.StaffRepository;
import com.buildcon.erp.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public Staff registerStaff(StaffSignupRequest request) {
        // Validation calls
        ValidationUtils.validateNotNull(request.getUsername(), "username");
        ValidationUtils.validateSpecialCharacters(request.getUsername(), "username");
        ValidationUtils.validateEmail(request.getEmail());
        ValidationUtils.validateNotNull(request.getPassword(), "password");
        ValidationUtils.validateNotNull(request.getStaffRole(), "staffRole");

        if (staffRepository.existsByUsername(request.getUsername())) {
            throw new CustomValidationException("Error: Username is already taken!");
        }

        if (staffRepository.existsByEmail(request.getEmail())) {
            throw new CustomValidationException("Error: Email is already in use!");
        }

        Staff staff = new Staff(
                request.getUsername(),
                request.getEmail(),
                encoder.encode(request.getPassword()),
                request.getStaffRole()
        );

        return staffRepository.save(staff);
    }
}
