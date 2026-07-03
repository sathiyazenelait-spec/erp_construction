package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.Chairman;
import com.buildcon.erp.payload.request.ChairmanSignupRequest;
import com.buildcon.erp.repository.ChairmanRepository;
import com.buildcon.erp.service.ChairmanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ChairmanServiceImpl implements ChairmanService {

    @Autowired
    private ChairmanRepository chairmanRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public Chairman registerChairman(ChairmanSignupRequest request) {
        // Validation calls
        ValidationUtils.validateNotNull(request.getUsername(), "username");
        ValidationUtils.validateSpecialCharacters(request.getUsername(), "username");
        ValidationUtils.validateEmail(request.getEmail());
        ValidationUtils.validateNotNull(request.getPassword(), "password");

        if (chairmanRepository.existsByUsername(request.getUsername())) {
            throw new CustomValidationException("Error: Username is already taken!");
        }

        if (chairmanRepository.existsByEmail(request.getEmail())) {
            throw new CustomValidationException("Error: Email is already in use!");
        }

        if (request.getOrganizationId() != null) {
            java.util.List<Chairman> existingChairmen = chairmanRepository.findByOrganizationId(request.getOrganizationId());
            if (!existingChairmen.isEmpty()) {
                throw new CustomValidationException("Error: An organization cannot have more than one Chairman!");
            }
        }

        Chairman chairman = new Chairman(
                request.getUsername(),
                request.getEmail(),
                encoder.encode(request.getPassword())
        );
        chairman.setOrganizationId(request.getOrganizationId());

        String initials = java.util.Arrays.stream(request.getUsername().split(" "))
            .filter(n -> !n.isEmpty())
            .map(n -> String.valueOf(n.charAt(0)))
            .collect(java.util.stream.Collectors.joining(""))
            .toUpperCase();
        if (initials.length() > 2) {
            initials = initials.substring(0, 2);
        }
        chairman.setAvatarInitials(initials.isEmpty() ? "CH" : initials);

        return chairmanRepository.save(chairman);
    }
}
