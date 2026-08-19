package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/forgot-password")
public class ForgotPasswordController {

    @Autowired
    private ForgotPasswordRequestRepository requestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Repositories for searching users
    @Autowired private ChairmanRepository chairmanRepository;
    @Autowired private MDRepository mdRepository;
    @Autowired private ProjectDirectorRepository projectDirectorRepository;
    @Autowired private BusinessDirectorRepository businessDirectorRepository;
    @Autowired private FinanceDirectorRepository financeDirectorRepository;
    @Autowired private ConstructionManagerRepository constructionManagerRepository;
    @Autowired private ProjectManagerRepository projectManagerRepository;
    @Autowired private QuantitySurveyorRepository quantitySurveyorRepository;
    @Autowired private ProcurementManagerRepository procurementManagerRepository;
    @Autowired private FinanceAccountsRepository financeAccountsRepository;
    @Autowired private SiteManagementRepository siteManagementRepository;
    @Autowired private WorkforceManagerRepository workforceManagerRepository;
    @Autowired private SubcontractorRepository subcontractorRepository;
    @Autowired private SeniorSiteEngineerRepository seniorSiteEngineerRepository;
    @Autowired private DigitalMarketingTLRepository digitalMarketingTLRepository;
    @Autowired private DigitalMarketingExecutiveRepository digitalMarketingExecutiveRepository;
    @Autowired private SalesExecutiveRepository salesExecutiveRepository;
    @Autowired private MarketingManagerRepository marketingManagerRepository;
    @Autowired private HRManagerRepository hrManagerRepository;
    @Autowired private AdminUserRepository adminUserRepository;

    private static class FoundUser {
        String username;
        String email;
        String role;
        Long organizationId;

        FoundUser(String username, String email, String role, Long organizationId) {
            this.username = username;
            this.email = email;
            this.role = role;
            this.organizationId = organizationId;
        }
    }

    private Optional<FoundUser> searchUser(String query) {
        // 1. Chairman
        var chairman = chairmanRepository.findByUsername(query).or(() -> chairmanRepository.findByEmail(query));
        if (chairman.isPresent()) {
            return Optional.of(new FoundUser(chairman.get().getUsername(), chairman.get().getEmail(), "ROLE_CHAIRMAN", chairman.get().getOrganizationId()));
        }
        // 2. MD
        var md = mdRepository.findByUsername(query).or(() -> mdRepository.findByEmail(query));
        if (md.isPresent()) {
            return Optional.of(new FoundUser(md.get().getUsername(), md.get().getEmail(), "ROLE_MD", md.get().getOrganizationId()));
        }
        // 3. Project Director
        var pd = projectDirectorRepository.findByUsername(query).or(() -> projectDirectorRepository.findByEmail(query));
        if (pd.isPresent()) {
            return Optional.of(new FoundUser(pd.get().getUsername(), pd.get().getEmail(), "ROLE_PROJECT_DIRECTOR", pd.get().getOrganizationId()));
        }
        // 4. Business Director
        var bd = businessDirectorRepository.findByUsername(query).or(() -> businessDirectorRepository.findByEmail(query));
        if (bd.isPresent()) {
            return Optional.of(new FoundUser(bd.get().getUsername(), bd.get().getEmail(), "ROLE_BUSINESS_DIRECTOR", bd.get().getOrganizationId()));
        }
        // 5. Finance Director
        var fd = financeDirectorRepository.findByUsername(query).or(() -> financeDirectorRepository.findByEmail(query));
        if (fd.isPresent()) {
            return Optional.of(new FoundUser(fd.get().getUsername(), fd.get().getEmail(), "ROLE_FINANCE_DIRECTOR", fd.get().getOrganizationId()));
        }
        // 6. Construction Manager
        var cm = constructionManagerRepository.findByUsername(query).or(() -> constructionManagerRepository.findByEmail(query));
        if (cm.isPresent()) {
            return Optional.of(new FoundUser(cm.get().getUsername(), cm.get().getEmail(), "ROLE_CONSTRUCTION_MANAGER", cm.get().getOrganizationId()));
        }
        // 7. Project Manager
        var pm = projectManagerRepository.findByUsername(query).or(() -> projectManagerRepository.findByEmail(query));
        if (pm.isPresent()) {
            return Optional.of(new FoundUser(pm.get().getUsername(), pm.get().getEmail(), "ROLE_PROJECT_MANAGER", pm.get().getOrganizationId()));
        }
        // 8. Quantity Surveyor
        var qs = quantitySurveyorRepository.findByUsername(query).or(() -> quantitySurveyorRepository.findByEmail(query));
        if (qs.isPresent()) {
            return Optional.of(new FoundUser(qs.get().getUsername(), qs.get().getEmail(), "ROLE_QUANTITY_SURVEYOR", qs.get().getOrganizationId()));
        }
        // 9. Procurement Manager
        var pr = procurementManagerRepository.findByUsername(query).or(() -> procurementManagerRepository.findByEmail(query));
        if (pr.isPresent()) {
            return Optional.of(new FoundUser(pr.get().getUsername(), pr.get().getEmail(), "ROLE_PROCUREMENT_MANAGER", pr.get().getOrganizationId()));
        }
        // 10. Finance Accounts
        var fa = financeAccountsRepository.findByUsername(query).or(() -> financeAccountsRepository.findByEmail(query));
        if (fa.isPresent()) {
            return Optional.of(new FoundUser(fa.get().getUsername(), fa.get().getEmail(), "ROLE_FINANCE_ACCOUNTS", fa.get().getOrganizationId()));
        }
        // 11. Site Management
        var sm = siteManagementRepository.findByUsername(query).or(() -> siteManagementRepository.findByEmail(query));
        if (sm.isPresent()) {
            return Optional.of(new FoundUser(sm.get().getUsername(), sm.get().getEmail(), "ROLE_SITE_MANAGEMENT", sm.get().getOrganizationId()));
        }
        // 12. Workforce Manager
        var wm = workforceManagerRepository.findByUsername(query).or(() -> workforceManagerRepository.findByEmail(query));
        if (wm.isPresent()) {
            return Optional.of(new FoundUser(wm.get().getUsername(), wm.get().getEmail(), "ROLE_WORKFORCE_MANAGER", wm.get().getOrganizationId()));
        }
        // 13. Subcontractor
        var sub = subcontractorRepository.findByUsername(query).or(() -> subcontractorRepository.findByEmail(query));
        if (sub.isPresent()) {
            return Optional.of(new FoundUser(sub.get().getUsername(), sub.get().getEmail(), "ROLE_SUBCONTRACTOR", sub.get().getOrganizationId()));
        }
        // 14. Senior Site Engineer
        var sse = seniorSiteEngineerRepository.findByUsername(query).or(() -> seniorSiteEngineerRepository.findByEmail(query));
        if (sse.isPresent()) {
            return Optional.of(new FoundUser(sse.get().getUsername(), sse.get().getEmail(), "ROLE_SENIOR_SITE_ENGINEER", sse.get().getOrganizationId()));
        }
        // 15. Digital Marketing TL
        var dtl = digitalMarketingTLRepository.findByUsername(query).or(() -> digitalMarketingTLRepository.findByEmail(query));
        if (dtl.isPresent()) {
            return Optional.of(new FoundUser(dtl.get().getUsername(), dtl.get().getEmail(), "ROLE_DIGITAL_MARKETING_TL", dtl.get().getOrganizationId()));
        }
        // 16. Digital Marketing Executive
        var dme = digitalMarketingExecutiveRepository.findByUsername(query).or(() -> digitalMarketingExecutiveRepository.findByEmail(query));
        if (dme.isPresent()) {
            return Optional.of(new FoundUser(dme.get().getUsername(), dme.get().getEmail(), "ROLE_DIGITAL_MARKETING_EXECUTIVE", dme.get().getOrganizationId()));
        }
        // 17. Sales Executive
        var se = salesExecutiveRepository.findByUsername(query).or(() -> salesExecutiveRepository.findByEmail(query));
        if (se.isPresent()) {
            return Optional.of(new FoundUser(se.get().getUsername(), se.get().getEmail(), "ROLE_SALES_EXECUTIVE", se.get().getOrganizationId()));
        }
        // 18. Marketing Manager
        var mm = marketingManagerRepository.findByUsername(query).or(() -> marketingManagerRepository.findByEmail(query));
        if (mm.isPresent()) {
            return Optional.of(new FoundUser(mm.get().getUsername(), mm.get().getEmail(), "ROLE_MARKETING_MANAGER", mm.get().getOrganizationId()));
        }
        // 19. HR Manager
        var hr = hrManagerRepository.findByUsername(query).or(() -> hrManagerRepository.findByEmail(query));
        if (hr.isPresent()) {
            return Optional.of(new FoundUser(hr.get().getUsername(), hr.get().getEmail(), "ROLE_HR_MANAGER", hr.get().getOrganizationId()));
        }
        // 20. AdminUser
        var au = adminUserRepository.findByUsername(query).or(() -> adminUserRepository.findByEmail(query));
        if (au.isPresent()) {
            return Optional.of(new FoundUser(au.get().getUsername(), au.get().getEmail(), "ROLE_ADMIN", null));
        }

        return Optional.empty();
    }

    private boolean updateUserPassword(String username, String role, String newPassword) {
        String encoded = passwordEncoder.encode(newPassword);
        switch (role) {
            case "ROLE_CHAIRMAN":
                return chairmanRepository.findByUsername(username).map(u -> { u.setPassword(encoded); chairmanRepository.save(u); return true; }).orElse(false);
            case "ROLE_MD":
                return mdRepository.findByUsername(username).map(u -> { u.setPassword(encoded); mdRepository.save(u); return true; }).orElse(false);
            case "ROLE_PROJECT_DIRECTOR":
                return projectDirectorRepository.findByUsername(username).map(u -> { u.setPassword(encoded); projectDirectorRepository.save(u); return true; }).orElse(false);
            case "ROLE_BUSINESS_DIRECTOR":
                return businessDirectorRepository.findByUsername(username).map(u -> { u.setPassword(encoded); businessDirectorRepository.save(u); return true; }).orElse(false);
            case "ROLE_FINANCE_DIRECTOR":
                return financeDirectorRepository.findByUsername(username).map(u -> { u.setPassword(encoded); financeDirectorRepository.save(u); return true; }).orElse(false);
            case "ROLE_CONSTRUCTION_MANAGER":
                return constructionManagerRepository.findByUsername(username).map(u -> { u.setPassword(encoded); constructionManagerRepository.save(u); return true; }).orElse(false);
            case "ROLE_PROJECT_MANAGER":
                return projectManagerRepository.findByUsername(username).map(u -> { u.setPassword(encoded); projectManagerRepository.save(u); return true; }).orElse(false);
            case "ROLE_QUANTITY_SURVEYOR":
                return quantitySurveyorRepository.findByUsername(username).map(u -> { u.setPassword(encoded); quantitySurveyorRepository.save(u); return true; }).orElse(false);
            case "ROLE_PROCUREMENT_MANAGER":
                return procurementManagerRepository.findByUsername(username).map(u -> { u.setPassword(encoded); procurementManagerRepository.save(u); return true; }).orElse(false);
            case "ROLE_FINANCE_ACCOUNTS":
                return financeAccountsRepository.findByUsername(username).map(u -> { u.setPassword(encoded); financeAccountsRepository.save(u); return true; }).orElse(false);
            case "ROLE_SITE_MANAGEMENT":
                return siteManagementRepository.findByUsername(username).map(u -> { u.setPassword(encoded); siteManagementRepository.save(u); return true; }).orElse(false);
            case "ROLE_WORKFORCE_MANAGER":
                return workforceManagerRepository.findByUsername(username).map(u -> { u.setPassword(encoded); workforceManagerRepository.save(u); return true; }).orElse(false);
            case "ROLE_SUBCONTRACTOR":
                return subcontractorRepository.findByUsername(username).map(u -> { u.setPassword(encoded); subcontractorRepository.save(u); return true; }).orElse(false);
            case "ROLE_SENIOR_SITE_ENGINEER":
                return seniorSiteEngineerRepository.findByUsername(username).map(u -> { u.setPassword(encoded); seniorSiteEngineerRepository.save(u); return true; }).orElse(false);
            case "ROLE_DIGITAL_MARKETING_TL":
                return digitalMarketingTLRepository.findByUsername(username).map(u -> { u.setPassword(encoded); digitalMarketingTLRepository.save(u); return true; }).orElse(false);
            case "ROLE_DIGITAL_MARKETING_EXECUTIVE":
                return digitalMarketingExecutiveRepository.findByUsername(username).map(u -> { u.setPassword(encoded); digitalMarketingExecutiveRepository.save(u); return true; }).orElse(false);
            case "ROLE_SALES_EXECUTIVE":
                return salesExecutiveRepository.findByUsername(username).map(u -> { u.setPassword(encoded); salesExecutiveRepository.save(u); return true; }).orElse(false);
            case "ROLE_MARKETING_MANAGER":
                return marketingManagerRepository.findByUsername(username).map(u -> { u.setPassword(encoded); marketingManagerRepository.save(u); return true; }).orElse(false);
            case "ROLE_HR_MANAGER":
                return hrManagerRepository.findByUsername(username).map(u -> { u.setPassword(encoded); hrManagerRepository.save(u); return true; }).orElse(false);
            case "ROLE_ADMIN":
                return adminUserRepository.findByUsername(username).map(u -> { u.setPassword(encoded); adminUserRepository.save(u); return true; }).orElse(false);
            default:
                return false;
        }
    }

    @PostMapping("/request")
    public ResponseEntity<?> createRequest(@RequestBody java.util.Map<String, String> request) {
        String usernameOrEmail = request.get("usernameOrEmail");
        String requestedPassword = request.get("requestedPassword");

        if (usernameOrEmail == null || usernameOrEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username or Email is required!"));
        }
        if (requestedPassword == null || requestedPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Requested password is required!"));
        }

        Optional<FoundUser> userOpt = searchUser(usernameOrEmail.trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found with given username or email!"));
        }

        FoundUser user = userOpt.get();
        ForgotPasswordRequest resetReq = new ForgotPasswordRequest(
            user.username,
            user.email,
            user.role,
            user.organizationId,
            requestedPassword.trim()
        );
        requestRepository.save(resetReq);

        return ResponseEntity.ok(new MessageResponse("Password reset request submitted successfully!"));
    }

    @GetMapping("/superadmin/pending")
    public ResponseEntity<List<ForgotPasswordRequest>> getSuperAdminPending() {
        // Super Admin gets requests from Chairman (ROLE_CHAIRMAN)
        List<ForgotPasswordRequest> list = requestRepository.findByRoleAndStatus("ROLE_CHAIRMAN", "PENDING");
        return ResponseEntity.ok(list);
    }

    @GetMapping("/chairman/pending/{orgId}")
    public ResponseEntity<List<ForgotPasswordRequest>> getChairmanPending(@PathVariable Long orgId) {
        // Chairman gets requests from non-Chairman of their organization
        List<ForgotPasswordRequest> list = requestRepository.findByRoleNotAndOrganizationIdAndStatus("ROLE_CHAIRMAN", orgId, "PENDING");
        return ResponseEntity.ok(list);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        Optional<ForgotPasswordRequest> reqOpt = requestRepository.findById(id);
        if (reqOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Request not found!"));
        }

        ForgotPasswordRequest resetReq = reqOpt.get();
        if (!"PENDING".equals(resetReq.getStatus())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Request is already processed!"));
        }

        boolean updated = updateUserPassword(resetReq.getUsername(), resetReq.getRole(), resetReq.getRequestedPassword());
        if (!updated) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Failed to update user password (user may no longer exist)!"));
        }

        resetReq.setStatus("APPROVED");
        requestRepository.save(resetReq);

        return ResponseEntity.ok(new MessageResponse("Password request approved and reset successfully!"));
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        Optional<ForgotPasswordRequest> reqOpt = requestRepository.findById(id);
        if (reqOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Request not found!"));
        }

        ForgotPasswordRequest resetReq = reqOpt.get();
        if (!"PENDING".equals(resetReq.getStatus())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Request is already processed!"));
        }

        resetReq.setStatus("REJECTED");
        requestRepository.save(resetReq);

        return ResponseEntity.ok(new MessageResponse("Password request rejected."));
    }
}
