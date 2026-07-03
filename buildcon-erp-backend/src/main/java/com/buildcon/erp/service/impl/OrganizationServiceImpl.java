package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.Organization;
import com.buildcon.erp.model.Chairman;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.payload.request.OrgCreationRequest;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    private OrganizationRepository repository;

    @Autowired
    private ChairmanRepository chairmanRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProgressClaimRepository progressClaimRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private CubeTestLogRepository cubeTestLogRepository;

    @Autowired
    private BusinessDirectorRepository businessDirectorRepository;

    @Autowired
    private ConstructionManagerRepository constructionManagerRepository;

    @Autowired
    private DigitalMarketingExecutiveRepository digitalMarketingExecutiveRepository;

    @Autowired
    private DigitalMarketingTLRepository digitalMarketingTLRepository;

    @Autowired
    private FinanceAccountsRepository financeAccountsRepository;

    @Autowired
    private FinanceDirectorRepository financeDirectorRepository;

    @Autowired
    private HRManagerRepository hrManagerRepository;

    @Autowired
    private MDRepository mdRepository;

    @Autowired
    private MarketingManagerRepository marketingManagerRepository;

    @Autowired
    private ProcurementManagerRepository procurementManagerRepository;

    @Autowired
    private ProjectDirectorRepository projectDirectorRepository;

    @Autowired
    private ProjectManagerRepository projectManagerRepository;

    @Autowired
    private QuantitySurveyorRepository quantitySurveyorRepository;

    @Autowired
    private SalesExecutiveRepository salesExecutiveRepository;

    @Autowired
    private SeniorSiteEngineerRepository seniorSiteEngineerRepository;

    @Autowired
    private SiteManagementRepository siteManagementRepository;

    @Autowired
    private SubcontractorRepository subcontractorRepository;

    @Autowired
    private WorkforceManagerRepository workforceManagerRepository;

    @Override
    @Transactional
    public Organization createOrganization(OrgCreationRequest request) {
        // Validate Organization info
        ValidationUtils.validateNotNull(request.getName(), "name");
        ValidationUtils.validateSpecialCharacters(request.getName(), "name");
        
        if (repository.existsByName(request.getName())) {
            throw new CustomValidationException("Error: Organization name is already registered!");
        }

        // Validate Chairman info
        ValidationUtils.validateNotNull(request.getChairmanEmail(), "chairmanEmail");
        ValidationUtils.validateEmail(request.getChairmanEmail());
        ValidationUtils.validateNotNull(request.getChairmanPassword(), "chairmanPassword");

        String username = request.getChairmanEmail().split("@")[0];
        
        if (chairmanRepository.existsByUsername(username)) {
            throw new CustomValidationException("Error: Chairman username '" + username + "' is already taken!");
        }
        if (chairmanRepository.existsByEmail(request.getChairmanEmail())) {
            throw new CustomValidationException("Error: Chairman email is already registered!");
        }

        // 1. Create and save Organization
        Organization org = new Organization(
            request.getName(),
            request.getDomain(),
            request.getChairmanEmail(),
            request.getPhone(),
            request.getLocation(),
            "Active",
            request.getSubscriptionTier()
        );
        String defaultOrgUsername = org.getName().toLowerCase().replace(" ", "") + "&0123";
        String defaultOrgPassword = org.getName().toLowerCase().split(" ")[0] + "@123";
        org.setOrgUsername(defaultOrgUsername);
        org.setOrgPassword(defaultOrgPassword);
        org = repository.save(org);

        // 2. Create and save Chairman
        Chairman chairman = new Chairman(
            username,
            request.getChairmanEmail(),
            encoder.encode(request.getChairmanPassword()),
            org.getId()
        );
        chairmanRepository.save(chairman);

        return org;
    }

    @Override
    public List<Organization> getAllOrganizations() {
        return repository.findAll();
    }

    @Override
    public Organization getOrganizationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CustomValidationException("Error: Organization not found with ID: " + id));
    }

    @Override
    @Transactional
    public void deleteOrganization(Long id) {
        if (!repository.existsById(id)) {
            throw new CustomValidationException("Error: Organization not found with ID: " + id);
        }

        // 1. Find and delete all project-related entities (claims, inventory, logs)
        List<Project> projects = projectRepository.findByOrganizationId(id);
        for (Project project : projects) {
            progressClaimRepository.deleteByProjectId(project.getId());
            inventoryItemRepository.deleteByProjectId(project.getId());
            cubeTestLogRepository.deleteByProjectId(project.getId());
        }

        // 2. Delete all projects
        projectRepository.deleteByOrganizationId(id);

        // 3. Delete all role-based users of this organization
        chairmanRepository.deleteByOrganizationId(id);
        businessDirectorRepository.deleteByOrganizationId(id);
        constructionManagerRepository.deleteByOrganizationId(id);
        digitalMarketingExecutiveRepository.deleteByOrganizationId(id);
        digitalMarketingTLRepository.deleteByOrganizationId(id);
        financeAccountsRepository.deleteByOrganizationId(id);
        financeDirectorRepository.deleteByOrganizationId(id);
        hrManagerRepository.deleteByOrganizationId(id);
        mdRepository.deleteByOrganizationId(id);
        marketingManagerRepository.deleteByOrganizationId(id);
        procurementManagerRepository.deleteByOrganizationId(id);
        projectDirectorRepository.deleteByOrganizationId(id);
        projectManagerRepository.deleteByOrganizationId(id);
        quantitySurveyorRepository.deleteByOrganizationId(id);
        salesExecutiveRepository.deleteByOrganizationId(id);
        seniorSiteEngineerRepository.deleteByOrganizationId(id);
        siteManagementRepository.deleteByOrganizationId(id);
        subcontractorRepository.deleteByOrganizationId(id);
        workforceManagerRepository.deleteByOrganizationId(id);

        // 4. Finally delete the organization itself
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public Organization updateOrganizationStatus(Long id, String status) {
        Organization org = repository.findById(id)
                .orElseThrow(() -> new CustomValidationException("Error: Organization not found with ID: " + id));
        org.setStatus(status);
        return repository.save(org);
    }

    @Override
    @Transactional
    public Organization updateOrganizationSubscription(Long id, String tier) {
        Organization org = repository.findById(id)
                .orElseThrow(() -> new CustomValidationException("Error: Organization not found with ID: " + id));
        org.setSubscriptionTier(tier);
        return repository.save(org);
    }
}
