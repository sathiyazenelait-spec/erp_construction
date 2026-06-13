package com.buildcon.erp.controller;

import com.buildcon.erp.model.ERole;
import com.buildcon.erp.model.Role;
import com.buildcon.erp.model.User;
import com.buildcon.erp.payload.request.LoginRequest;
import com.buildcon.erp.payload.request.SignupRequest;
import com.buildcon.erp.payload.response.JwtResponse;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.repository.RoleRepository;
import com.buildcon.erp.repository.UserRepository;
import com.buildcon.erp.security.jwt.JwtUtils;
import com.buildcon.erp.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/roles")
    public ResponseEntity<List<String>> getAllRoles() {
        List<String> roles = java.util.Arrays.stream(ERole.values())
                .map(Enum::name)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(roles);
    }
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getOrganizationId(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                    case "super_admin":
                    case "superadmin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "project_manager":
                    case "projectmanager":
                        Role pmRole = roleRepository.findByName(ERole.ROLE_PROJECT_MANAGER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(pmRole);
                        break;
                    case "subcontractor":
                    case "tl":
                        Role subcontractorRole = roleRepository.findByName(ERole.ROLE_SUBCONTRACTOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(subcontractorRole);
                        break;
                    case "chairman":
                        Role chairmanRole = roleRepository.findByName(ERole.ROLE_CHAIRMAN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(chairmanRole);
                        break;
                    case "project_director":
                    case "projectdirector":
                        Role pdRole = roleRepository.findByName(ERole.ROLE_PROJECT_DIRECTOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(pdRole);
                        break;
                    case "digital_marketing_executive":
                    case "digitalmarketingexecutive":
                        Role dmeRole = roleRepository.findByName(ERole.ROLE_DIGITAL_MARKETING_EXECUTIVE)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(dmeRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
