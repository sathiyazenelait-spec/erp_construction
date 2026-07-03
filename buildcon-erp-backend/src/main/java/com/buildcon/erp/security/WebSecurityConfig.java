package com.buildcon.erp.security;

import com.buildcon.erp.security.jwt.AuthEntryPointJwt;
import com.buildcon.erp.security.jwt.AuthTokenFilter;
import com.buildcon.erp.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.http.HttpMethod;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                .requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/organizations").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/organizations/authenticate").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/packages").permitAll()
                                .requestMatchers("/api/test/**").permitAll()
                                .requestMatchers("/api/md/signup").permitAll()
                                .requestMatchers("/api/project-director/signup").permitAll()
                                .requestMatchers("/api/business-director/signup").permitAll()
                                .requestMatchers("/api/finance-director/signup").permitAll()
                                .requestMatchers("/api/construction-manager/signup").permitAll()
                                .requestMatchers("/api/project-manager/signup").permitAll()
                                .requestMatchers("/api/quantity-surveyor/signup").permitAll()
                                .requestMatchers("/api/procurement-manager/signup").permitAll()
                                .requestMatchers("/api/finance-accounts/signup").permitAll()
                                .requestMatchers("/api/site-management/signup").permitAll()
                                .requestMatchers("/api/workforce-manager/signup").permitAll()
                                .requestMatchers("/api/subcontractor/signup").permitAll()
                                .requestMatchers("/api/senior-site-engineer/signup").permitAll()
                                .requestMatchers("/api/digital-marketing-tl/signup").permitAll()
                                .requestMatchers("/api/digital-marketing-executive/signup").permitAll()
                                .requestMatchers("/api/sales-executive/signup").permitAll()
                                .requestMatchers("/api/marketing-manager/signup").permitAll()
                                .requestMatchers("/api/hr-manager/signup").permitAll()
                                .requestMatchers("/api/chairman/signup").permitAll()
                                .requestMatchers("/api/admin/signup").permitAll()
                                .requestMatchers("/error").permitAll()
                                .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
