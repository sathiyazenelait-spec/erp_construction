package com.buildcon.erp.config;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class NewRolesDataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private QaQcEngineerRepository qaQcEngineerRepository;

    @Autowired
    private StoreManagerRepository storeManagerRepository;

    @Autowired
    private VendorSupplierRepository vendorSupplierRepository;

    @Autowired
    private CustomerUserRepository customerUserRepository;

    @Autowired
    private com.buildcon.erp.repository.ChairmanRepository chairmanRepository;

    @Autowired
    private com.buildcon.erp.repository.MDRepository mdRepository;

    @Autowired
    private com.buildcon.erp.repository.SiteManagementRepository siteManagementRepository;

    @Autowired
    private com.buildcon.erp.repository.ProjectManagerRepository projectManagerRepository;

    @Autowired
    private VendorBidRepository vendorBidRepository;

    @Autowired
    private ClientTicketRepository clientTicketRepository;

    @Autowired
    private QaQcEngineerService qaQcEngineerService;

    @Autowired
    private StoreManagerService storeManagerService;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private ComplianceService complianceService;

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private NotificationGatewayService notificationGatewayService;

    @Autowired
    private DrawingService drawingService;

    @Autowired
    private AiPredictionService aiPredictionService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Expand roles.name column size if needed
        try {
            jdbcTemplate.execute("ALTER TABLE roles MODIFY COLUMN name VARCHAR(60) NOT NULL");
        } catch (Exception ignored) {
        }

        // 1. Ensure all roles in ERole exist in database
        Arrays.stream(ERole.values()).forEach(roleName -> {
            try {
                if (roleRepository.findByName(roleName).isEmpty()) {
                    roleRepository.save(new Role(roleName));
                }
            } catch (Exception ex) {
                // Role already exists or length issue handled
            }
        });

        // 2. Resolve default organization
        Organization defaultOrg;
        if (organizationRepository.count() == 0) {
            defaultOrg = new Organization(
                "BuildWell Constructions Ltd",
                "buildcon.com",
                "info@buildcon.com",
                "+91 99999 88888",
                "Chennai, India",
                "Active",
                "Enterprise"
            );
            defaultOrg.setOrgUsername("buildwellconstructionsltd&0123");
            defaultOrg.setOrgPassword("buildwell@123");
            defaultOrg = organizationRepository.save(defaultOrg);
        } else {
            defaultOrg = organizationRepository.findAll().get(0);
        }
        Long orgId = defaultOrg.getId();

        // Ensure site@buildcon.com has site123 password
        var siteOpt = siteManagementRepository.findByEmail("site@buildcon.com").or(() -> siteManagementRepository.findByUsername("site"));
        if (siteOpt.isPresent()) {
            var sm = siteOpt.get();
            sm.setPassword(passwordEncoder.encode("site123"));
            sm.setOrganizationId(orgId);
            siteManagementRepository.save(sm);
        } else {
            var sm = new com.buildcon.erp.model.SiteManagement("site", "site@buildcon.com", passwordEncoder.encode("site123"));
            sm.setOrganizationId(orgId);
            siteManagementRepository.save(sm);
        }

        // Ensure pm@buildcon.com has pm123 password
        var pmOpt = projectManagerRepository.findByEmail("pm@buildcon.com").or(() -> projectManagerRepository.findByUsername("pm"));
        if (pmOpt.isPresent()) {
            var pm = pmOpt.get();
            pm.setPassword(passwordEncoder.encode("pm123"));
            pm.setOrganizationId(orgId);
            projectManagerRepository.save(pm);
        } else {
            var pm = new com.buildcon.erp.model.ProjectManager("pm", "pm@buildcon.com", passwordEncoder.encode("pm123"));
            pm.setOrganizationId(orgId);
            projectManagerRepository.save(pm);
        }

        // Ensure chairman has chairman123 password
        var chOpt = chairmanRepository.findByEmail("chairman@buildcon.com").or(() -> chairmanRepository.findByUsername("chairman"));
        if (chOpt.isPresent()) {
            var ch = chOpt.get();
            ch.setPassword(passwordEncoder.encode("chairman123"));
            ch.setOrganizationId(orgId);
            chairmanRepository.save(ch);
        } else {
            var ch = new com.buildcon.erp.model.Chairman("chairman", "chairman@buildcon.com", passwordEncoder.encode("chairman123"), orgId);
            chairmanRepository.save(ch);
        }

        // Ensure md has md123 password
        var mdOpt = mdRepository.findByEmail("md@buildcon.com").or(() -> mdRepository.findByUsername("mdbuildcon"));
        if (mdOpt.isPresent()) {
            var m = mdOpt.get();
            m.setPassword(passwordEncoder.encode("md123"));
            m.setOrganizationId(orgId);
            mdRepository.save(m);
        } else {
            var m = new com.buildcon.erp.model.MD("mdbuildcon", "md@buildcon.com", passwordEncoder.encode("md123"));
            m.setOrganizationId(orgId);
            mdRepository.save(m);
        }

        // 3. Seed QA/QC Engineer User
        if (qaQcEngineerRepository.findByOrganizationId(orgId).isEmpty()) {
            QaQcEngineer qa = new QaQcEngineer(
                "qaqc",
                "qaqc@buildcon.com",
                passwordEncoder.encode("qaqc123")
            );
            qa.setOrganizationId(orgId);
            qa.setAvatarInitials("QA");
            qaQcEngineerRepository.save(qa);
        }
        qaQcEngineerService.seedQaQcData(orgId);

        // 4. Seed Store Manager User
        if (storeManagerRepository.findByOrganizationId(orgId).isEmpty()) {
            StoreManager sm = new StoreManager(
                "storemanager",
                "stores@buildcon.com",
                passwordEncoder.encode("store123")
            );
            sm.setOrganizationId(orgId);
            sm.setAvatarInitials("SM");
            storeManagerRepository.save(sm);
        }
        storeManagerService.seedStoreData(orgId);

        // 5. Seed Vendor Supplier User
        if (vendorSupplierRepository.findByOrganizationId(orgId).isEmpty()) {
            VendorSupplier vs = new VendorSupplier(
                "tatatiscon",
                "vendor@tatatiscon.com",
                passwordEncoder.encode("vendor123")
            );
            vs.setOrganizationId(orgId);
            vs.setAvatarInitials("TT");
            vendorSupplierRepository.save(vs);
        }
        if (vendorBidRepository.findByOrganizationId(orgId).isEmpty()) {
            vendorBidRepository.save(new VendorBid("RFQ-2026-01", "TMT Steel Rebar Fe500D (16mm)", "Tata Tiscon Direct", 67500.0, "MT", 3, LocalDate.now().minusDays(1), "ACCEPTED", "Delivery within 72 hrs. Payment 30 days post GRN verification.", orgId));
            vendorBidRepository.save(new VendorBid("RFQ-2026-02", "Structural Steel I-Beams (ISMB 300)", "Jindal Steel & Power", 71000.0, "MT", 7, LocalDate.now(), "UNDER_EVALUATION", "F.O.R. site delivery included.", orgId));
        }

        // 6. Seed Customer User
        if (customerUserRepository.findByOrganizationId(orgId).isEmpty()) {
            CustomerUser cu = new CustomerUser(
                "rajesh",
                "rajesh.k@customer.com",
                passwordEncoder.encode("client123")
            );
            cu.setOrganizationId(orgId);
            cu.setAvatarInitials("RK");
            customerUserRepository.save(cu);
        }
        if (clientTicketRepository.findByOrganizationId(orgId).isEmpty()) {
            clientTicketRepository.save(new ClientTicket("TCK-2026-01", "Dr. Rajesh K.", "Skyline Towers - Unit 402", "Snagging", "Balcony Tile Grouting Minor Void", "Tile joint near rainwater outlet requires epoxy re-grouting before monsoon.", "MEDIUM", "RESOLVED", LocalDate.now().minusDays(5), orgId));
            clientTicketRepository.save(new ClientTicket("TCK-2026-02", "Dr. Rajesh K.", "Skyline Towers - Unit 402", "DLP Warranty", "Master Bedroom Door Lock Catch Alignment", "Mortise lock latch sticks slightly during rainy humidity.", "LOW", "OPEN", LocalDate.now().minusDays(1), orgId));
        }

        // 7. Seed Enterprise Extensions: Audit Logs, Compliance, Meetings, Notifications
        auditLogService.seedInitialLogs(orgId);
        complianceService.seedComplianceData(orgId);
        meetingService.seedMeetingData(orgId);
        notificationGatewayService.seedNotificationData(orgId);

        // 8. Seed Blueprints, CAD Models & AI Predictive Reports
        drawingService.seedDrawingData();
        aiPredictionService.seedPredictionData();
    }
}

