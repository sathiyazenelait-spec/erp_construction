package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.service.QaQcEngineerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class QaQcEngineerServiceImpl implements QaQcEngineerService {

    @Autowired
    private QaQcEngineerRepository repository;

    @Autowired
    private QaQcInspectionRepository inspectionRepository;

    @Autowired
    private QaQcNcrRepository ncrRepository;

    @Autowired
    private QaQcMaterialTestRepository materialTestRepository;

    @Autowired
    private QaQcSafetyAuditRepository safetyAuditRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public QaQcEngineer register(GenericSignupRequest request) {
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

        QaQcEngineer item = new QaQcEngineer(
            request.getUsername(),
            request.getEmail(),
            encoder.encode(request.getPassword())
        );
        item.setOrganizationId(request.getOrganizationId());
        return repository.save(item);
    }

    @Override
    public void seedQaQcData(Long organizationId) {
        List<QaQcInspection> inspections = inspectionRepository.findByOrganizationId(organizationId);
        if (inspections.isEmpty()) {
            inspectionRepository.save(new QaQcInspection("INSP-101", "Pre-Pour Concrete Check: Basement Slab 2", "Pre-Pour Concrete", "Basement B2, Grid C4-E8", "Arun Kumar", "PASSED", LocalDate.now().minusDays(2), "Cover blocks verified at 50mm. Rebar reinforcement binds double checked.", organizationId));
            inspectionRepository.save(new QaQcInspection("INSP-102", "Column C14 Rebar Lap Length Verification", "Structural", "Tower A, 3rd Floor", "Arun Kumar", "CONDITIONAL", LocalDate.now().minusDays(1), "Lap length 48d observed; needs extra 50mm welding at staggered zones.", organizationId));
            inspectionRepository.save(new QaQcInspection("INSP-103", "HVAC Sleeve Embedment & Fire Damper Quality", "MEP", "Tower B, Level 2", "Deepak Verma", "PASSED", LocalDate.now(), "Fire stop sealant application complete and compliant with NBC Part 4.", organizationId));
            inspectionRepository.save(new QaQcInspection("INSP-104", "External Wall Plaster Verticality & Plumb", "Civil Finishing", "Tower A West Elevation", "Arun Kumar", "FAILED", LocalDate.now(), "Plaster plumb deviation exceeded 6mm over 3m straight edge. Corrective re-dressing needed.", organizationId));
        }

        List<QaQcNcr> ncrs = ncrRepository.findByOrganizationId(organizationId);
        if (ncrs.isEmpty()) {
            ncrRepository.save(new QaQcNcr("NCR-2026-001", "Honeycombing observed in Shear Wall SW-03", "MAJOR", "Apex Civil Contractors", "Tower A, Ground Floor", "Moderate honeycomb segregation at wall-footing junction due to inadequate needle vibrator compaction.", "Vibrator poker diameter too large to navigate congested 25mm rebar bundle.", "Chipping loose aggregate, application of epoxy bonding agent and non-shrink micro-concrete grout.", "UNDER_REVIEW", LocalDate.now().plusDays(4), organizationId));
            ncrRepository.save(new QaQcNcr("NCR-2026-002", "Substandard Aggregate Sieve Flakiness Index", "CRITICAL", "National Quarry Works", "Central Batching Yard", "Flakiness Index tested at 34% (Max allowable limit 25% per IS 383:2016).", "Crusher screen damaged at quarry facility.", "Entire 40 Ton batch rejected and quarantined. Replacement batch requested.", "RECTIFIED", LocalDate.now().minusDays(1), organizationId));
            ncrRepository.save(new QaQcNcr("NCR-2026-003", "Missing Scaffolding Toe-Boards & Mid-Rails", "MINOR", "Skyline Scaffolding Services", "Tower B North Façade", "Perimeter scaffolding platform at 18m height missing mandatory kickboards.", "Erection checklist skipped by sub-tier supervisor.", "Fitted certified toe-boards and barricaded perimeter before shift resumption.", "CLOSED", LocalDate.now().minusDays(3), organizationId));
        }

        List<QaQcMaterialTest> tests = materialTestRepository.findByOrganizationId(organizationId);
        if (tests.isEmpty()) {
            materialTestRepository.save(new QaQcMaterialTest("TEST-801", "TMT Steel Rebar Fe500D (16mm)", "Tensile & Elongation Test", "BATCH-TMT-884", "Tata Tiscon", "Yield Stress >= 500 N/mm², Elongation >= 16%", "Yield: 542 N/mm², Elongation: 18.4%", "PASS", LocalDate.now().minusDays(5), "LAB-CERT-NABL-4102", organizationId));
            materialTestRepository.save(new QaQcMaterialTest("TEST-802", "OPC 53 Grade Cement", "Standard Consistency & Setting Time", "LOT-CEM-991", "UltraTech Cement", "Initial Setting >= 30 min, Final <= 600 min", "Initial: 42 min, Final: 285 min", "PASS", LocalDate.now().minusDays(3), "LAB-CERT-NABL-4120", organizationId));
            materialTestRepository.save(new QaQcMaterialTest("TEST-803", "Subgrade Embankment Soil", "Standard Proctor Compaction Test", "PIT-SOIL-04", "Local Earthworks", "Max Dry Density >= 1.82 g/cc, OMC 12.5%", "MDD: 1.85 g/cc, OMC: 12.1%", "PASS", LocalDate.now().minusDays(2), "LAB-CERT-GEO-109", organizationId));
            materialTestRepository.save(new QaQcMaterialTest("TEST-804", "Coarse Aggregate (20mm)", "Aggregate Impact Value (AIV)", "AGG-LOT-302", "Sri Ganesh Blue Metals", "AIV <= 24% for structural concrete", "AIV: 21.8%", "PASS", LocalDate.now().minusDays(1), "LAB-CERT-NABL-4135", organizationId));
        }

        List<QaQcSafetyAudit> audits = safetyAuditRepository.findByOrganizationId(organizationId);
        if (audits.isEmpty()) {
            safetyAuditRepository.save(new QaQcSafetyAudit("AUD-01", "Tower A Superstructure & Formwork", 98, "Compliant", "Inspected & Active", "Rajesh Sharma (Safety Officer)", LocalDate.now().minusDays(1), "Safety harnesses hooked to life-lines 100%. Safety net intact.", organizationId));
            safetyAuditRepository.save(new QaQcSafetyAudit("AUD-02", "Basement Excavation & Shoring Wall", 94, "Compliant", "Inspected & Active", "Rajesh Sharma (Safety Officer)", LocalDate.now(), "Dewatering pump cables grounded with 30mA RCCB trip switch.", organizationId));
        }
    }
}

