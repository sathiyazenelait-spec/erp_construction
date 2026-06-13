package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.SeniorSiteEngineer;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.repository.SeniorSiteEngineerRepository;
import com.buildcon.erp.service.SeniorSiteEngineerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SeniorSiteEngineerServiceImpl implements SeniorSiteEngineerService {

    @Autowired
    private SeniorSiteEngineerRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public SeniorSiteEngineer register(GenericSignupRequest request) {
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

        SeniorSiteEngineer item = new SeniorSiteEngineer(
            request.getUsername(),
            request.getEmail(),
            encoder.encode(request.getPassword())
        );
        item.setOrganizationId(request.getOrganizationId());
        return repository.save(item);
    }
}
