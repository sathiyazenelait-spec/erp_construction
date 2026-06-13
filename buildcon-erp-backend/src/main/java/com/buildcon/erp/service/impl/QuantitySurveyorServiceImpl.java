package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.QuantitySurveyor;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.repository.QuantitySurveyorRepository;
import com.buildcon.erp.service.QuantitySurveyorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class QuantitySurveyorServiceImpl implements QuantitySurveyorService {

    @Autowired
    private QuantitySurveyorRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public QuantitySurveyor register(GenericSignupRequest request) {
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

        QuantitySurveyor item = new QuantitySurveyor(
            request.getUsername(),
            request.getEmail(),
            encoder.encode(request.getPassword())
        );
        item.setOrganizationId(request.getOrganizationId());
        return repository.save(item);
    }
}
