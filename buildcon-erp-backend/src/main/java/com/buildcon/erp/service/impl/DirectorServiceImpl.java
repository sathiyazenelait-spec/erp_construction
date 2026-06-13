package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.Director;
import com.buildcon.erp.payload.request.DirectorSignupRequest;
import com.buildcon.erp.repository.DirectorRepository;
import com.buildcon.erp.service.DirectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DirectorServiceImpl implements DirectorService {

    @Autowired
    private DirectorRepository directorRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public Director registerDirector(DirectorSignupRequest request) {
        // Validation calls
        ValidationUtils.validateNotNull(request.getUsername(), "username");
        ValidationUtils.validateSpecialCharacters(request.getUsername(), "username");
        ValidationUtils.validateEmail(request.getEmail());
        ValidationUtils.validateNotNull(request.getPassword(), "password");
        ValidationUtils.validateNotNull(request.getDirectorRole(), "directorRole");

        if (directorRepository.existsByUsername(request.getUsername())) {
            throw new CustomValidationException("Error: Username is already taken!");
        }

        if (directorRepository.existsByEmail(request.getEmail())) {
            throw new CustomValidationException("Error: Email is already in use!");
        }

        Director director = new Director(
                request.getUsername(),
                request.getEmail(),
                encoder.encode(request.getPassword()),
                request.getDirectorRole()
        );

        return directorRepository.save(director);
    }
}
