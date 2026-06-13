package com.buildcon.erp.config;

import com.buildcon.erp.model.ERole;
import com.buildcon.erp.model.Role;
import com.buildcon.erp.model.Organization;
import com.buildcon.erp.repository.RoleRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed roles
        Arrays.stream(ERole.values()).forEach(roleName -> {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(new Role(roleName));
            }
        });

        // Seed default Organization if none exist
        if (organizationRepository.count() == 0) {
            Organization defaultOrg = new Organization(
                "BuildWell Constructions Ltd",
                "buildcon.com",
                "info@buildcon.com",
                "+91 99999 88888",
                "Chennai, India",
                "Active",
                "Enterprise"
            );
            organizationRepository.save(defaultOrg);
        }
    }
}
