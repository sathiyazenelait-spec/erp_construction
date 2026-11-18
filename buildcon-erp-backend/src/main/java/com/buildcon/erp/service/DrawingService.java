package com.buildcon.erp.service;

import com.buildcon.erp.model.DrawingClashRecord;
import com.buildcon.erp.model.DrawingRecord;
import com.buildcon.erp.repository.DrawingClashRecordRepository;
import com.buildcon.erp.repository.DrawingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class DrawingService {

    @Autowired
    private DrawingRecordRepository drawingRepository;

    @Autowired
    private DrawingClashRecordRepository clashRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<DrawingRecord> getDrawings(Long orgId) {
        return drawingRepository.findByOrganizationIdOrderByUploadDateDesc(orgId);
    }

    public Optional<DrawingRecord> getDrawingById(Long id) {
        return drawingRepository.findById(id);
    }

    public DrawingRecord saveDrawing(DrawingRecord drawing) {
        if (drawing.getUploadDate() == null || drawing.getUploadDate().isEmpty()) {
            drawing.setUploadDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
        }
        if (drawing.getStatus() == null || drawing.getStatus().isEmpty()) {
            drawing.setStatus("UNDER_REVIEW");
        }
        DrawingRecord saved = drawingRepository.save(drawing);

        auditLogService.logAction(
            "CREATE",
            "DrawingRecord",
            String.valueOf(saved.getId()),
            saved.getUploadedBy() != null ? saved.getUploadedBy() : "Lead Architect",
            "ROLE_PROJECT_MANAGER",
            "Uploaded drawing " + saved.getDrawingNumber() + " (" + saved.getTitle() + ") - Revision " + saved.getRevision(),
            "127.0.0.1",
            "SUCCESS",
            saved.getOrganizationId()
        );

        return saved;
    }

    public DrawingRecord approveDrawing(Long id, String approvedBy) {
        Optional<DrawingRecord> opt = drawingRepository.findById(id);
        if (opt.isEmpty()) {
            throw new RuntimeException("Drawing record not found with id: " + id);
        }
        DrawingRecord dwg = opt.get();
        dwg.setStatus("APPROVED_FOR_CONSTRUCTION");
        dwg.setApprovedBy(approvedBy != null && !approvedBy.isBlank() ? approvedBy : "Chief Structural Consultant");
        dwg.setApprovalDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));

        DrawingRecord saved = drawingRepository.save(dwg);

        auditLogService.logAction(
            "APPROVE",
            "DrawingRecord",
            String.valueOf(saved.getId()),
            saved.getApprovedBy(),
            "ROLE_PROJECT_DIRECTOR",
            "Approved drawing " + saved.getDrawingNumber() + " for construction release (IFC)",
            "127.0.0.1",
            "SUCCESS",
            saved.getOrganizationId()
        );

        return saved;
    }

    public DrawingRecord rejectDrawing(Long id, String remarks, String rejectedBy) {
        Optional<DrawingRecord> opt = drawingRepository.findById(id);
        if (opt.isEmpty()) {
            throw new RuntimeException("Drawing record not found with id: " + id);
        }
        DrawingRecord dwg = opt.get();
        dwg.setStatus("REJECTED");
        dwg.setRevisionNotes(remarks != null ? remarks : "Rejected during technical scrutiny. Revisions requested.");
        DrawingRecord saved = drawingRepository.save(dwg);

        auditLogService.logAction(
            "REJECT",
            "DrawingRecord",
            String.valueOf(saved.getId()),
            rejectedBy != null ? rejectedBy : "QA/QC Structural Lead",
            "ROLE_QA_QC_ENGINEER",
            "Rejected drawing " + saved.getDrawingNumber() + ". Remarks: " + saved.getRevisionNotes(),
            "127.0.0.1",
            "SUCCESS",
            saved.getOrganizationId()
        );

        return saved;
    }

    public List<DrawingClashRecord> getClashes(Long drawingId) {
        return clashRepository.findByDrawingId(drawingId);
    }

    public List<DrawingClashRecord> getAllClashesByOrg(Long orgId) {
        return clashRepository.findByOrganizationId(orgId);
    }

    public DrawingClashRecord resolveClash(Long clashId, String resolutionNotes, String resolvedBy) {
        Optional<DrawingClashRecord> opt = clashRepository.findById(clashId);
        if (opt.isEmpty()) {
            throw new RuntimeException("Clash record not found with id: " + clashId);
        }
        DrawingClashRecord clash = opt.get();
        clash.setResolutionStatus("RESOLVED");
        clash.setResolutionNotes(resolutionNotes != null ? resolutionNotes : "Rerouted with adequate physical clearance.");
        clash.setResolvedDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
        DrawingClashRecord saved = clashRepository.save(clash);

        // Update drawing clashes count
        List<DrawingClashRecord> openClashes = clashRepository.findByDrawingId(clash.getDrawingId())
                .stream().filter(c -> "OPEN".equalsIgnoreCase(c.getResolutionStatus())).toList();
        
        drawingRepository.findById(clash.getDrawingId()).ifPresent(dwg -> {
            dwg.setClashesCount(openClashes.size());
            drawingRepository.save(dwg);
        });

        auditLogService.logAction(
            "UPDATE",
            "DrawingClashRecord",
            String.valueOf(saved.getId()),
            resolvedBy != null ? resolvedBy : "MEP Consultant",
            "ROLE_SENIOR_SITE_ENGINEER",
            "Resolved clash ID " + saved.getId() + " on " + saved.getDrawingNumber() + ": " + saved.getResolutionNotes(),
            "127.0.0.1",
            "SUCCESS",
            saved.getOrganizationId()
        );

        return saved;
    }

    public void seedDrawingData() {
        if (drawingRepository.count() > 0) {
            return;
        }

        Long orgId = 1L;
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);

        // Drawing 1: Tower B Structural Ground Slab
        DrawingRecord d1 = new DrawingRecord();
        d1.setDrawingNumber("DWG-STR-TWB-001");
        d1.setTitle("Tower B Ground Floor Raft & Column Reinforcement Plan");
        d1.setCategory("STRUCTURAL");
        d1.setDiscipline("Structural RCC");
        d1.setRevision("v2.0-IFC");
        d1.setRevisionNotes("Reinforcement density upgraded to Fe550D for high seismic load tolerance");
        d1.setFileName("tower_b_ground_slab_rebar_v2.dwg");
        d1.setFileType("DWG");
        d1.setFileSizeBytes(14850000L); // 14.8 MB
        d1.setStatus("APPROVED_FOR_CONSTRUCTION");
        d1.setApprovedBy("Er. V. Ramanathan (FIE, Structural Auditor)");
        d1.setApprovalDate(today);
        d1.setUploadedBy("Studio Matrix CAD Cell");
        d1.setUploadDate(today);
        d1.setProjectName("Skyline Tech Park - Tower B");
        d1.setProjectId(1L);
        d1.setLinkedTaskId("WBS-TWB-CONC-02: Raft Foundation Pour");
        d1.setScaleRatio("1:50");
        d1.setCarpetAreaSqft(18500.0);
        d1.setBuiltupAreaSqft(24600.0);
        d1.setWallLengthMeters(420.5);
        d1.setOpeningCount(28);
        d1.setClashesCount(1);
        d1.setAiAnalysisJson("""
            {
              "scaleDetected": "1:50 Metric",
              "confidence": 0.982,
              "roomDetections": [
                {"name": "Core Lift Lobby", "dimensions": "12.4m x 8.6m", "areaSqft": 1148, "status": "VERIFIED"},
                {"name": "Substation & Electrical Room", "dimensions": "9.2m x 6.5m", "areaSqft": 643, "status": "VERIFIED"},
                {"name": "Commercial Office Wing A", "dimensions": "28.5m x 18.2m", "areaSqft": 5580, "status": "VERIFIED"},
                {"name": "Commercial Office Wing B", "dimensions": "32.0m x 20.4m", "areaSqft": 7025, "status": "VERIFIED"},
                {"name": "Fire Exit Stairwell North", "dimensions": "6.0m x 4.5m", "areaSqft": 290, "status": "VERIFIED"}
              ],
              "structuralTakeoff": {
                "totalRCCVolumeM3": 890.0,
                "rebarTonnage": 71.2,
                "shutteringAreaM2": 1840.0,
                "predictedPourDurationDays": 6
              },
              "potentialRisks": [
                "Congested rebar bundle at Column C-4 intersection requires 20mm aggregate slump mix"
              ]
            }
            """);
        d1.setOrganizationId(orgId);
        d1 = drawingRepository.save(d1);

        // Drawing 2: Architectural Master Layout
        DrawingRecord d2 = new DrawingRecord();
        d2.setDrawingNumber("DWG-ARC-TWB-004");
        d2.setTitle("Tower B 1st to 5th Floor Typical Architectural Floor Plan");
        d2.setCategory("ARCHITECTURAL");
        d2.setDiscipline("Architectural Planning");
        d2.setRevision("v2.1");
        d2.setRevisionNotes("Acoustic partition layout refined for Tier-1 IT tenant guidelines");
        d2.setFileName("tower_b_typical_arch_v2_1.pdf");
        d2.setFileType("PDF");
        d2.setFileSizeBytes(8240000L);
        d2.setStatus("UNDER_REVIEW");
        d2.setUploadedBy("Architect Priya & Associates");
        d2.setUploadDate(today);
        d2.setProjectName("Skyline Tech Park - Tower B");
        d2.setProjectId(1L);
        d2.setLinkedTaskId("WBS-TWB-FITOUT-01: Drywall Partitions");
        d2.setScaleRatio("1:100");
        d2.setCarpetAreaSqft(16800.0);
        d2.setBuiltupAreaSqft(21500.0);
        d2.setWallLengthMeters(580.0);
        d2.setOpeningCount(64);
        d2.setClashesCount(2);
        d2.setAiAnalysisJson("""
            {
              "scaleDetected": "1:100 Metric",
              "confidence": 0.965,
              "roomDetections": [
                {"name": "Executive Conference Suite", "dimensions": "14.0m x 9.0m", "areaSqft": 1356, "status": "VERIFIED"},
                {"name": "Open Workstation Hall", "dimensions": "42.0m x 24.0m", "areaSqft": 10845, "status": "VERIFIED"},
                {"name": "Server & Telecom Hub", "dimensions": "7.5m x 5.0m", "areaSqft": 403, "status": "VERIFIED"}
              ],
              "openings": {
                "doorsCount": 38,
                "windowsCurtainWallCount": 26,
                "fireDoorsCount": 6
              }
            }
            """);
        d2.setOrganizationId(orgId);
        d2 = drawingRepository.save(d2);

        // Drawing 3: HVAC & MEP Coordination Drawing
        DrawingRecord d3 = new DrawingRecord();
        d3.setDrawingNumber("DWG-MEP-HVAC-002");
        d3.setTitle("Basement & Podium Central Chiller Ducting & Chilled Water Piping");
        d3.setCategory("HVAC");
        d3.setDiscipline("Mechanical HVAC");
        d3.setRevision("v1.2");
        d3.setRevisionNotes("Chilled water riser lines moved 350mm east to avert storm sewer line");
        d3.setFileName("podium_hvac_chiller_duct_v1_2.dwg");
        d3.setFileType("DWG");
        d3.setFileSizeBytes(19200000L);
        d3.setStatus("UNDER_REVIEW");
        d3.setUploadedBy("AirTech Climate Solutions");
        d3.setUploadDate(today);
        d3.setProjectName("Skyline Tech Park - Tower B");
        d3.setProjectId(1L);
        d3.setLinkedTaskId("WBS-TWB-MEP-03: Primary Chiller Rigging");
        d3.setScaleRatio("1:50");
        d3.setCarpetAreaSqft(12000.0);
        d3.setBuiltupAreaSqft(14500.0);
        d3.setWallLengthMeters(310.0);
        d3.setOpeningCount(12);
        d3.setClashesCount(2);
        d3.setAiAnalysisJson("""
            {
              "scaleDetected": "1:50 Metric",
              "confidence": 0.978,
              "ductTakeoff": {
                "totalSheetMetalDuctAreaM2": 1420.0,
                "chilledWaterPipingMeters": 460.0,
                "insulationVolumeM3": 85.0
              }
            }
            """);
        d3.setOrganizationId(orgId);
        d3 = drawingRepository.save(d3);

        // Drawing 4: Plumbing & Firefighting
        DrawingRecord d4 = new DrawingRecord();
        d4.setDrawingNumber("DWG-PLB-FIRE-003");
        d4.setTitle("Tower B Fire Sprinkler Network & Wet Riser Hydraulic Layout");
        d4.setCategory("PLUMBING");
        d4.setDiscipline("Plumbing & Firefighting");
        d4.setRevision("v1.0-IFC");
        d4.setRevisionNotes("Initial release approved by Chief Fire Officer (NOC Ref: CFO/2026/781)");
        d4.setFileName("fire_sprinkler_tower_b_rev1.pdf");
        d4.setFileType("PDF");
        d4.setFileSizeBytes(6100000L);
        d4.setStatus("APPROVED_FOR_CONSTRUCTION");
        d4.setApprovedBy("Divisional Fire Officer & Safety Directorate");
        d4.setApprovalDate(today);
        d4.setUploadedBy("SafeFlow Systems Ltd");
        d4.setUploadDate(today);
        d4.setProjectName("Skyline Tech Park - Tower B");
        d4.setProjectId(1L);
        d4.setLinkedTaskId("WBS-TWB-SAFETY-01: Sprinkler Droppers");
        d4.setScaleRatio("1:100");
        d4.setCarpetAreaSqft(18500.0);
        d4.setBuiltupAreaSqft(24600.0);
        d4.setWallLengthMeters(450.0);
        d4.setOpeningCount(32);
        d4.setClashesCount(0);
        d4.setAiAnalysisJson("""
            {
              "scaleDetected": "1:100 Metric",
              "confidence": 0.991,
              "sprinklerHeadsDetected": 242,
              "hydraulicZoneRating": "Extra Light Hazard (NFPA 13 Compliant)",
              "pressureHeadBar": 4.5
            }
            """);
        d4.setOrganizationId(orgId);
        d4 = drawingRepository.save(d4);

        // Seed Clashes
        DrawingClashRecord c1 = new DrawingClashRecord();
        c1.setDrawingId(d1.getId());
        c1.setDrawingNumber(d1.getDrawingNumber());
        c1.setProjectName(d1.getProjectName());
        c1.setClashType("MEP_STRUCTURAL_CLASH");
        c1.setSeverity("CRITICAL");
        c1.setZoneDescription("Primary 450x300mm HVAC Supply Air Duct routing directly through RCC Transfer Beam TB-04 soffit");
        c1.setElementA("HVAC Air Duct 450x300mm");
        c1.setElementB("RCC Transfer Beam TB-04 (Depth 800mm)");
        c1.setCoordinates("Grid C4-D4, Elevation +3.85m");
        c1.setResolutionStatus("OPEN");
        c1.setAssignedTo("Er. Ramesh (Lead MEP Engineer)");
        c1.setDetectedDate(today);
        c1.setOrganizationId(orgId);
        clashRepository.save(c1);

        DrawingClashRecord c2 = new DrawingClashRecord();
        c2.setDrawingId(d2.getId());
        c2.setDrawingNumber(d2.getDrawingNumber());
        c2.setProjectName(d2.getProjectName());
        c2.setClashType("CLEARANCE_CLASH");
        c2.setSeverity("MODERATE");
        c2.setZoneDescription("Acoustic partition drywall studs intrude into 1.2m mandatory fire escape path envelope by 140mm");
        c2.setElementA("Drywall Frame Stud 100mm");
        c2.setElementB("Fire Corridor Clear Width Egress");
        c2.setCoordinates("North Core Fire Door FD-02");
        c2.setResolutionStatus("OPEN");
        c2.setAssignedTo("Architect Priya");
        c2.setDetectedDate(today);
        c2.setOrganizationId(orgId);
        clashRepository.save(c2);

        DrawingClashRecord c3 = new DrawingClashRecord();
        c3.setDrawingId(d3.getId());
        c3.setDrawingNumber(d3.getDrawingNumber());
        c3.setProjectName(d3.getProjectName());
        c3.setClashType("HARD_CLASH");
        c3.setSeverity("CRITICAL");
        c3.setZoneDescription("150mm Chilled Water Return Pipe collides with 250mm Stormwater Gravity Downcomer");
        c3.setElementA("Chilled Water Pipe Ø150mm");
        c3.setElementB("Stormwater Pipe Ø250mm");
        c3.setCoordinates("Podium Shaft P-03, Level -1.80m");
        c3.setResolutionStatus("RESOLVED");
        c3.setResolutionNotes("Offset stormwater downcomer by 45-degree elbow with cleanout inspection trap.");
        c3.setAssignedTo("Er. Ramesh (Lead MEP Engineer)");
        c3.setDetectedDate(today);
        c3.setResolvedDate(today);
        c3.setOrganizationId(orgId);
        clashRepository.save(c3);
    }
}
