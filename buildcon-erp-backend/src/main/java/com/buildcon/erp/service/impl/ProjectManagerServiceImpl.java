package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.ProjectManager;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.repository.ProjectManagerRepository;
import com.buildcon.erp.service.ProjectManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ProjectManagerServiceImpl implements ProjectManagerService {

    @Autowired
    private ProjectManagerRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public ProjectManager register(GenericSignupRequest request) {
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

        ProjectManager item = new ProjectManager(
            request.getUsername(),
            request.getEmail(),
            encoder.encode(request.getPassword())
        );
        item.setOrganizationId(request.getOrganizationId());

        String initials = java.util.Arrays.stream(request.getUsername().split(" "))
            .filter(n -> !n.isEmpty())
            .map(n -> String.valueOf(n.charAt(0)))
            .collect(java.util.stream.Collectors.joining(""))
            .toUpperCase();
        if (initials.length() > 2) {
            initials = initials.substring(0, 2);
        }
        item.setAvatarInitials(initials.isEmpty() ? "PM" : initials);

        return repository.save(item);
    }
}
