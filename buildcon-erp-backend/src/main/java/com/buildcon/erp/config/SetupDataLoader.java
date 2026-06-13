package com.buildcon.erp.config;

import com.buildcon.erp.model.ERole;
import com.buildcon.erp.model.Role;
import com.buildcon.erp.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SetupDataLoader {

    @Bean
    public CommandLineRunner loadRoles(RoleRepository roleRepository) {
        return args -> {
            for (ERole eRole : ERole.values()) {
                roleRepository.findByName(eRole).orElseGet(() -> {
                    Role role = new Role(eRole);
                    return roleRepository.save(role);
                });
            }
        };
    }
}
