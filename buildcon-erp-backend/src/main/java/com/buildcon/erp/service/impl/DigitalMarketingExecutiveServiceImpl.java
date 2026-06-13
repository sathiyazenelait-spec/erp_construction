package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.DigitalMarketingExecutive;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.repository.DigitalMarketingExecutiveRepository;
import com.buildcon.erp.service.DigitalMarketingExecutiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DigitalMarketingExecutiveServiceImpl implements DigitalMarketingExecutiveService {

    @Autowired
    private DigitalMarketingExecutiveRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public DigitalMarketingExecutive register(GenericSignupRequest request) {
        ValidationUtils.validateNotNull(request.getUsername(), "username");
        ValidationUtils.validateSpecialCharacters(request.getUsername(), "username");
        ValidationUtils.validateEmail(request.getEmail());
        ValidationUtils.validateNotNull(request.getPassword(), "password");

        if (repository.existsByUsername(request.getUsername())) {
            throw new CustomValidationException("Error: Username is already taken!");
        }
        if (repository.existsByEmail(request.getEmail())) {
            throw new CustomValidationException("Error: Email is already in use!");
        }

        DigitalMarketingExecutive item = new DigitalMarketingExecutive(
            request.getUsername(),
            request.getEmail(),
            encoder.encode(request.getPassword())
        );
        item.setOrganizationId(request.getOrganizationId());
        return repository.save(item);
    }
}
