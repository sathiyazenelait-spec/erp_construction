package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.HRManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/hr-manager")
public class HRManagerController {

    @Autowired
    private HRManagerService service;

    @Autowired
    private HRManagerRepository hrManagerRepository;

    @Autowired
    private MDRepository mdRepository;

    @Autowired
    private ProjectManagerRepository projectManagerRepository;

    @Autowired
    private SiteManagementRepository siteManagementRepository;

    @Autowired
    private SeniorSiteEngineerRepository seniorSiteEngineerRepository;

    @Autowired
    private ConstructionManagerRepository constructionManagerRepository;

    @Autowired
    private QuantitySurveyorRepository quantitySurveyorRepository;

    @Autowired
    private ProcurementManagerRepository procurementManagerRepository;

    @Autowired
    private FinanceAccountsRepository financeAccountsRepository;

    @Autowired
    private WorkforceManagerRepository workforceManagerRepository;

    @Autowired
    private SubcontractorRepository subcontractorRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EngagementEventRepository engagementEventRepository;

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private RecruitmentOpeningRepository recruitmentOpeningRepository;

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    @Autowired
    private SubcontractorAttendanceRepository subcontractorAttendanceRepository;

    @Autowired
    private PayrollDepartmentSummaryRepository payrollDepartmentSummaryRepository;

    @Autowired
    private PerformanceAppraisalRepository performanceAppraisalRepository;

    @Autowired
    private TrainingScheduleRepository trainingScheduleRepository;

    @Autowired
    private ComplianceAuditRepository complianceAuditRepository;

    @Autowired
    private ComplianceChecklistRepository complianceChecklistRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        HRManager res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    // --- EMPLOYEE MANAGEMENT ENDPOINT ---
    @GetMapping("/employees/org/{orgId}")
    public ResponseEntity<?> getEmployeesByOrg(@PathVariable Long orgId) {
        List<Map<String, Object>> employees = new ArrayList<>();

        java.util.function.BiConsumer<BaseUserEntity, String[]> addEmployee = (user, details) -> {
            Map<String, Object> emp = new HashMap<>();
            emp.put("id", "EMP-" + details[0] + "-" + user.getId());
            emp.put("name", user.getUsername());
            emp.put("role", details[1]);
            emp.put("dept", details[2]);
            emp.put("status", "Active");
            emp.put("joined", "10 Jan 2026");
            employees.add(emp);
        };

        mdRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"MD", "Managing Director", "Management"}));
        hrManagerRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"HR", "HR Manager", "HR"}));
        projectManagerRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"PM", "Project Manager", "Projects"}));
        siteManagementRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"SM", "Site Supervisor", "Projects"}));
        seniorSiteEngineerRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"SSE", "Senior Site Engineer", "Engineering"}));
        constructionManagerRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"CM", "Construction Manager", "Projects"}));
        quantitySurveyorRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"QS", "Quantity Surveyor", "Engineering"}));
        procurementManagerRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"PR", "Procurement Manager", "Projects"}));
        financeAccountsRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"FA", "Finance Lead", "Finance"}));
        workforceManagerRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"WM", "Workforce Supervisor", "HR"}));
        subcontractorRepository.findByOrganizationId(orgId).forEach(u -> addEmployee.accept(u, new String[]{"SUB", "Subcontractor", "Projects"}));

        return ResponseEntity.ok(employees);
    }

    // --- LEAVE MANAGEMENT ENDPOINTS ---
    @GetMapping("/leave/org/{orgId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByOrg(@PathVariable Long orgId) {
        List<LeaveRequest> list = leaveRequestRepository.findByOrganizationId(orgId);
        if (list.isEmpty()) {
            leaveRequestRepository.save(new LeaveRequest("Amit Patel", "Site Supervisor", "Sick Leave", "3 Days (29 May - 31 May)", "Medical Treatment & recovery", "Pending", orgId));
            leaveRequestRepository.save(new LeaveRequest("Rohan Sharma", "Civil Engineer", "Earned Leave", "5 Days (02 Jun - 06 Jun)", "Family wedding event", "Pending", orgId));
            leaveRequestRepository.save(new LeaveRequest("Vikram Singh", "Accounts Lead", "Casual Leave", "1 Day (30 May)", "Personal work at registry office", "Pending", orgId));
            list = leaveRequestRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(list);
    }

    @PutMapping("/leave/{id}/status")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(@PathVariable Long id, @RequestBody String status) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        String cleanStatus = status.replace("\"", "").trim();
        leave.setStatus(cleanStatus);
        return ResponseEntity.ok(leaveRequestRepository.save(leave));
    }

    @PostMapping("/leave")
    public ResponseEntity<LeaveRequest> createLeaveRequest(@RequestBody LeaveRequest request) {
        return ResponseEntity.ok(leaveRequestRepository.save(request));
    }

    // --- ENGAGEMENT EVENTS ENDPOINTS ---
    @GetMapping("/events/org/{orgId}")
    public ResponseEntity<List<EngagementEvent>> getEventsByOrg(@PathVariable Long orgId) {
        List<EngagementEvent> list = engagementEventRepository.findByOrganizationId(orgId);
        if (list.isEmpty()) {
            engagementEventRepository.save(new EngagementEvent("Q2 Townhall & Performance Rewards", "Townhall", "2026-06-20", "Main Headquarters / Zoom", "Scheduled", 145, orgId));
            engagementEventRepository.save(new EngagementEvent("Annual Inter-Site Cricket Tournament", "Team Outing", "2026-07-02", "Decathlon Sports Arena", "Scheduled", 85, orgId));
            engagementEventRepository.save(new EngagementEvent("Safety Awareness & First Aid Workshop", "Training", "2026-05-18", "Site Office B", "Completed", 45, orgId));
            engagementEventRepository.save(new EngagementEvent("Labour Day Celebrations & Buffet", "Celebration", "2026-05-01", "All Site Locations", "Completed", 420, orgId));
            list = engagementEventRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(list);
    }

    @PostMapping("/events")
    public ResponseEntity<EngagementEvent> createEvent(@RequestBody EngagementEvent event) {
        return ResponseEntity.ok(engagementEventRepository.save(event));
    }

    // --- GRIEVANCES ENDPOINTS ---
    @GetMapping("/grievances/org/{orgId}")
    public ResponseEntity<List<Grievance>> getGrievancesByOrg(@PathVariable Long orgId) {
        List<Grievance> list = grievanceRepository.findByOrganizationId(orgId);
        if (list.isEmpty()) {
            grievanceRepository.save(new Grievance("Ramesh Pawar", "Site Facilities", "2026-06-02", "High", "Open", "Drinking water dispenser filter malfunction at site office C.", orgId));
            grievanceRepository.save(new Grievance("Anita Kulkarni", "Payroll Query", "2026-06-04", "Medium", "In Investigation", "Overtime allowance calculation error for May attendance.", orgId));
            grievanceRepository.save(new Grievance("Vikram Rathore", "Workplace Safety", "2026-05-28", "High", "Resolved", "Required urgent replacement of worn-out safety harnesses for structural workers.", orgId));
            list = grievanceRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(list);
    }

    @PutMapping("/grievances/{id}/status")
    public ResponseEntity<Grievance> updateGrievanceStatus(@PathVariable Long id, @RequestBody String status) {
        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));
        String cleanStatus = status.replace("\"", "").trim();
        grievance.setStatus(cleanStatus);
        return ResponseEntity.ok(grievanceRepository.save(grievance));
    }

    @PostMapping("/grievances")
    public ResponseEntity<Grievance> createGrievance(@RequestBody Grievance grievance) {
        return ResponseEntity.ok(grievanceRepository.save(grievance));
    }

    // --- EXECUTIVE SUMMARY ENDPOINT ---
    @GetMapping("/summary/org/{orgId}")
    public ResponseEntity<?> getSummaryStats(@PathVariable Long orgId) {
        Map<String, Object> summary = new HashMap<>();

        // Calculate total staff count dynamically
        long staffCount = 0;
        staffCount += mdRepository.findByOrganizationId(orgId).size();
        staffCount += hrManagerRepository.findByOrganizationId(orgId).size();
        staffCount += projectManagerRepository.findByOrganizationId(orgId).size();
        staffCount += siteManagementRepository.findByOrganizationId(orgId).size();
        staffCount += seniorSiteEngineerRepository.findByOrganizationId(orgId).size();
        staffCount += constructionManagerRepository.findByOrganizationId(orgId).size();
        staffCount += quantitySurveyorRepository.findByOrganizationId(orgId).size();
        staffCount += procurementManagerRepository.findByOrganizationId(orgId).size();
        staffCount += financeAccountsRepository.findByOrganizationId(orgId).size();
        staffCount += workforceManagerRepository.findByOrganizationId(orgId).size();
        staffCount += subcontractorRepository.findByOrganizationId(orgId).size();

        if (staffCount == 0) {
            staffCount = 71; // Fallback default if completely empty
        }

        // Get open positions dynamically from recruitment openings
        List<RecruitmentOpening> openings = recruitmentOpeningRepository.findByOrganizationId(orgId);
        if (openings.isEmpty()) {
            recruitmentOpeningRepository.save(new RecruitmentOpening("Senior Structural Engineer", "Projects / Engineering", "2 Positions", "120 Applied", "Interviewing", orgId));
            recruitmentOpeningRepository.save(new RecruitmentOpening("Billing & Cost Accountant", "Finance / Accounts", "1 Position", "45 Applied", "Selected (Offer Sent)", orgId));
            recruitmentOpeningRepository.save(new RecruitmentOpening("Site Safety Inspector", "EHS / Quality", "3 Positions", "75 Applied", "Screening", orgId));
            recruitmentOpeningRepository.save(new RecruitmentOpening("Senior Procurement Lead", "Procurement / Purchase", "1 Position", "30 Applied", "Interviewing", orgId));
            openings = recruitmentOpeningRepository.findByOrganizationId(orgId);
        }
        
        long openRoles = 0;
        for (RecruitmentOpening opening : openings) {
            try {
                String val = opening.getTargetHires().replaceAll("[^0-9]", "").trim();
                if (!val.isEmpty()) {
                    openRoles += Integer.parseInt(val);
                } else {
                    openRoles += 1;
                }
            } catch (Exception e) {
                openRoles += 1;
            }
        }
        if (openRoles == 0) openRoles = 18;

        // Workforce headcount data
        long engineers = seniorSiteEngineerRepository.findByOrganizationId(orgId).size() + quantitySurveyorRepository.findByOrganizationId(orgId).size();
        long supervisors = siteManagementRepository.findByOrganizationId(orgId).size() + workforceManagerRepository.findByOrganizationId(orgId).size() + subcontractorRepository.findByOrganizationId(orgId).size();
        long hr = hrManagerRepository.findByOrganizationId(orgId).size();
        long finance = financeAccountsRepository.findByOrganizationId(orgId).size();
        
        if (engineers == 0) engineers = 35;
        if (supervisors == 0) supervisors = 22;
        if (hr == 0) hr = 6;
        if (finance == 0) finance = 8;
        long workers = workerRepository.countByOrganizationId(orgId);
        if (workers <= 5) {
            workers = 420;
        } else {
            workers = 420 + (workers - 5);
        }

        List<Map<String, Object>> headcount = new ArrayList<>();
        headcount.add(Map.of("name", "Engineers", "count", engineers, "color", "#3B82F6"));
        headcount.add(Map.of("name", "Supervisors", "count", supervisors, "color", "#10B981"));
        headcount.add(Map.of("name", "HR Staff", "count", hr, "color", "#8B5CF6"));
        headcount.add(Map.of("name", "Finance Staff", "count", finance, "color", "#EC4899"));
        headcount.add(Map.of("name", "Workers", "count", workers, "color", "#F59E0B"));

        List<LeaveRequest> leaves = leaveRequestRepository.findByOrganizationId(orgId);
        if (leaves.isEmpty()) {
            // Seed defaults
            leaveRequestRepository.save(new LeaveRequest("Amit Patel", "Site Supervisor", "Sick Leave", "3 Days (29 May - 31 May)", "Medical Treatment & recovery", "Pending", orgId));
            leaveRequestRepository.save(new LeaveRequest("Rohan Sharma", "Civil Engineer", "Earned Leave", "5 Days (02 Jun - 06 Jun)", "Family wedding event", "Pending", orgId));
            leaveRequestRepository.save(new LeaveRequest("Vikram Singh", "Accounts Lead", "Casual Leave", "1 Day (30 May)", "Personal work at registry office", "Pending", orgId));
            leaves = leaveRequestRepository.findByOrganizationId(orgId);
        }
        long pendingLeaves = leaves.stream().filter(l -> "Pending".equalsIgnoreCase(l.getStatus())).count();
        long approvedLeaves = leaves.stream().filter(l -> "Approved".equalsIgnoreCase(l.getStatus())).count();
        long rejectedLeaves = leaves.stream().filter(l -> "Rejected".equalsIgnoreCase(l.getStatus())).count();

        summary.put("totalEmployees", staffCount);
        summary.put("labourWorkforce", workers);
        summary.put("openPositions", openRoles);
        summary.put("attritionRate", "3.2%");
        summary.put("avgAttendance", "94%");
        summary.put("workforceData", headcount);
        summary.put("pendingLeaves", pendingLeaves);
        summary.put("approvedLeaves", approvedLeaves);
        summary.put("rejectedLeaves", rejectedLeaves);

        // Recruitment stages data
        List<Map<String, Object>> pipeline = new ArrayList<>();
        pipeline.add(Map.of("stage", "Applications", "count", 650, "color", "#3B82F6"));
        pipeline.add(Map.of("stage", "Screened", "count", 210, "color", "#8B5CF6"));
        pipeline.add(Map.of("stage", "Interviewed", "count", 80, "color", "#EAB308"));
        pipeline.add(Map.of("stage", "Selected", "count", 18, "color", "#F97316"));
        pipeline.add(Map.of("stage", "Joined", "count", 12, "color", "#10B981"));
        summary.put("recruitmentPipeline", pipeline);

        return ResponseEntity.ok(summary);
    }

    // --- WORKFORCE OVERVIEW ENDPOINT ---
    @GetMapping("/workforce/org/{orgId}")
    public ResponseEntity<?> getWorkforceOverview(@PathVariable Long orgId) {
        Map<String, Object> stats = new HashMap<>();

        long staffCount = 0;
        staffCount += mdRepository.findByOrganizationId(orgId).size();
        staffCount += hrManagerRepository.findByOrganizationId(orgId).size();
        staffCount += projectManagerRepository.findByOrganizationId(orgId).size();
        staffCount += siteManagementRepository.findByOrganizationId(orgId).size();
        staffCount += seniorSiteEngineerRepository.findByOrganizationId(orgId).size();
        staffCount += constructionManagerRepository.findByOrganizationId(orgId).size();
        staffCount += quantitySurveyorRepository.findByOrganizationId(orgId).size();
        staffCount += procurementManagerRepository.findByOrganizationId(orgId).size();
        staffCount += financeAccountsRepository.findByOrganizationId(orgId).size();
        staffCount += workforceManagerRepository.findByOrganizationId(orgId).size();
        staffCount += subcontractorRepository.findByOrganizationId(orgId).size();

        if (staffCount == 0) staffCount = 71;

        long engineers = seniorSiteEngineerRepository.findByOrganizationId(orgId).size() + quantitySurveyorRepository.findByOrganizationId(orgId).size();
        long supervisors = siteManagementRepository.findByOrganizationId(orgId).size() + workforceManagerRepository.findByOrganizationId(orgId).size() + subcontractorRepository.findByOrganizationId(orgId).size();
        long hr = hrManagerRepository.findByOrganizationId(orgId).size();
        long finance = financeAccountsRepository.findByOrganizationId(orgId).size();

        if (engineers == 0) engineers = 35;
        if (supervisors == 0) supervisors = 22;
        if (hr == 0) hr = 6;
        if (finance == 0) finance = 8;
        long workers = workerRepository.countByOrganizationId(orgId);
        if (workers <= 5) {
            workers = 420;
        } else {
            workers = 420 + (workers - 5);
        }

        List<Map<String, Object>> headcount = new ArrayList<>();
        headcount.add(Map.of("group", "Engineers", "count", engineers));
        headcount.add(Map.of("group", "Supervisors", "count", supervisors));
        headcount.add(Map.of("group", "HR Staff", "count", hr));
        headcount.add(Map.of("group", "Finance Staff", "count", finance));
        headcount.add(Map.of("group", "Workers", "count", workers));

        stats.put("staffHeadcount", staffCount);
        stats.put("siteWorkers", workers);
        stats.put("totalWorkforce", staffCount + workers);
        stats.put("headcountData", headcount);

        return ResponseEntity.ok(stats);
    }

    // --- RECRUITMENT OPENINGS ENDPOINTS ---
    @GetMapping("/recruitment/org/{orgId}")
    public ResponseEntity<List<RecruitmentOpening>> getRecruitmentOpenings(@PathVariable Long orgId) {
        List<RecruitmentOpening> list = recruitmentOpeningRepository.findByOrganizationId(orgId);
        if (list.isEmpty()) {
            recruitmentOpeningRepository.save(new RecruitmentOpening("Senior Structural Engineer", "Projects / Engineering", "2 Positions", "120 Applied", "Interviewing", orgId));
            recruitmentOpeningRepository.save(new RecruitmentOpening("Billing & Cost Accountant", "Finance / Accounts", "1 Position", "45 Applied", "Selected (Offer Sent)", orgId));
            recruitmentOpeningRepository.save(new RecruitmentOpening("Site Safety Inspector", "EHS / Quality", "3 Positions", "75 Applied", "Screening", orgId));
            recruitmentOpeningRepository.save(new RecruitmentOpening("Senior Procurement Lead", "Procurement / Purchase", "1 Position", "30 Applied", "Interviewing", orgId));
            list = recruitmentOpeningRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(list);
    }

    @PostMapping("/recruitment")
    public ResponseEntity<RecruitmentOpening> createRecruitmentOpening(@RequestBody RecruitmentOpening opening) {
        return ResponseEntity.ok(recruitmentOpeningRepository.save(opening));
    }

    // --- ATTENDANCE MANAGEMENT ENDPOINTS ---
    @GetMapping("/attendance/org/{orgId}")
    public ResponseEntity<List<AttendanceRecord>> getAttendanceRecords(@PathVariable Long orgId) {
        List<AttendanceRecord> list = attendanceRecordRepository.findByOrganizationId(orgId);
        return ResponseEntity.ok(list);
    }
 
    @PostMapping("/attendance")
    public ResponseEntity<AttendanceRecord> createAttendanceRecord(@RequestBody AttendanceRecord record) {
        return ResponseEntity.ok(attendanceRecordRepository.save(record));
    }
 
    @PutMapping("/attendance/{id}")
    public ResponseEntity<AttendanceRecord> updateAttendanceRecord(@PathVariable Long id, @RequestBody AttendanceRecord record) {
        AttendanceRecord existing = attendanceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));
        existing.setDay(record.getDay());
        existing.setPresentCount(record.getPresentCount());
        existing.setAbsentCount(record.getAbsentCount());
        if (record.getOrganizationId() != null) {
            existing.setOrganizationId(record.getOrganizationId());
        }
        return ResponseEntity.ok(attendanceRecordRepository.save(existing));
    }
 
    // --- LABOUR ATTENDANCE ENDPOINTS ---
    @GetMapping("/labour-attendance/org/{orgId}")
    public ResponseEntity<List<SubcontractorAttendance>> getLabourAttendanceRecords(@PathVariable Long orgId) {
        List<SubcontractorAttendance> list = subcontractorAttendanceRepository.findByOrganizationId(orgId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/labour-attendance")
    public ResponseEntity<SubcontractorAttendance> createLabourAttendance(@RequestBody SubcontractorAttendance attendance) {
        if (attendance.getSubcontractorId() == null) {
            attendance.setSubcontractorId(1L); // Default fallback subcontractor ID
        }
        return ResponseEntity.ok(subcontractorAttendanceRepository.save(attendance));
    }

    @PutMapping("/labour-attendance/{id}")
    public ResponseEntity<SubcontractorAttendance> updateLabourAttendance(@PathVariable Long id, @RequestBody SubcontractorAttendance attendance) {
        SubcontractorAttendance existing = subcontractorAttendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Labour attendance record not found"));
        existing.setSkilledMasons(attendance.getSkilledMasons());
        existing.setCarpenters(attendance.getCarpenters());
        existing.setGeneralLabor(attendance.getGeneralLabor());
        existing.setDate(attendance.getDate());
        if (attendance.getOrganizationId() != null) {
            existing.setOrganizationId(attendance.getOrganizationId());
        }
        if (attendance.getSubcontractorId() != null) {
            existing.setSubcontractorId(attendance.getSubcontractorId());
        }
        return ResponseEntity.ok(subcontractorAttendanceRepository.save(existing));
    }

    // --- PAYROLL SUMMARY ENDPOINTS ---
    @GetMapping("/payroll/org/{orgId}")
    public ResponseEntity<List<PayrollDepartmentSummary>> getPayrollSummary(@PathVariable Long orgId) {
        List<PayrollDepartmentSummary> list = payrollDepartmentSummaryRepository.findByOrganizationId(orgId);
        if (list.isEmpty()) {
            payrollDepartmentSummaryRepository.save(new PayrollDepartmentSummary("Engineering / Projects", "57 Staff", "₹18.5 L", "₹1.4 L", "₹17.1 L", "Processed", orgId));
            payrollDepartmentSummaryRepository.save(new PayrollDepartmentSummary("Sales & Marketing", "15 Staff", "₹5.8 L", "₹48,000", "₹5.32 L", "Processed", orgId));
            payrollDepartmentSummaryRepository.save(new PayrollDepartmentSummary("Accounts & Finance", "8 Staff", "₹3.2 L", "₹25,000", "₹2.95 L", "Processed", orgId));
            payrollDepartmentSummaryRepository.save(new PayrollDepartmentSummary("HR & Admin Operations", "6 Staff", "₹2.1 L", "₹18,000", "₹1.92 L", "Processed", orgId));
            list = payrollDepartmentSummaryRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(list);
    }

    @PostMapping("/payroll")
    public ResponseEntity<PayrollDepartmentSummary> createPayrollSummary(@RequestBody PayrollDepartmentSummary summary) {
        return ResponseEntity.ok(payrollDepartmentSummaryRepository.save(summary));
    }

    @PutMapping("/payroll/{id}")
    public ResponseEntity<PayrollDepartmentSummary> updatePayrollSummary(@PathVariable Long id, @RequestBody PayrollDepartmentSummary summary) {
        PayrollDepartmentSummary existing = payrollDepartmentSummaryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll summary not found"));
        existing.setDepartment(summary.getDepartment());
        existing.setEmployeeCount(summary.getEmployeeCount());
        existing.setBasicComponent(summary.getBasicComponent());
        existing.setDeductions(summary.getDeductions());
        existing.setNetPayout(summary.getNetPayout());
        existing.setStatus(summary.getStatus());
        if (summary.getOrganizationId() != null) {
            existing.setOrganizationId(summary.getOrganizationId());
        }
        return ResponseEntity.ok(payrollDepartmentSummaryRepository.save(existing));
    }

    // --- PERFORMANCE APPRAISALS ENDPOINTS ---
    @GetMapping("/performance/org/{orgId}")
    public ResponseEntity<List<PerformanceAppraisal>> getPerformanceAppraisals(@PathVariable Long orgId) {
        List<PerformanceAppraisal> list = performanceAppraisalRepository.findByOrganizationId(orgId);
        if (list.isEmpty()) {
            performanceAppraisalRepository.save(new PerformanceAppraisal("Karthik R.", "Construction Manager", "Projects", "4.8", "4.9", "Top Performer", orgId));
            performanceAppraisalRepository.save(new PerformanceAppraisal("Ananya Sharma", "Marketing Manager", "Sales & Marketing", "4.5", "4.6", "Top Performer", orgId));
            performanceAppraisalRepository.save(new PerformanceAppraisal("Amit Patel", "Site Supervisor", "Projects", "4.2", "4.2", "Strong Performer", orgId));
            performanceAppraisalRepository.save(new PerformanceAppraisal("Rohan Sharma", "Civil Engineer", "Engineering", "3.2", "3.0", "Needs Improvement", orgId));
            list = performanceAppraisalRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(list);
    }

    @PostMapping("/performance")
    public ResponseEntity<PerformanceAppraisal> createPerformanceAppraisal(@RequestBody PerformanceAppraisal appraisal) {
        return ResponseEntity.ok(performanceAppraisalRepository.save(appraisal));
    }

    @PutMapping("/performance/{id}")
    public ResponseEntity<PerformanceAppraisal> updatePerformanceAppraisal(@PathVariable Long id, @RequestBody PerformanceAppraisal appraisal) {
        PerformanceAppraisal existing = performanceAppraisalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Performance appraisal not found"));
        existing.setEmployeeName(appraisal.getEmployeeName());
        existing.setRole(appraisal.getRole());
        existing.setDepartment(appraisal.getDepartment());
        existing.setSelfRating(appraisal.getSelfRating());
        existing.setManagerRating(appraisal.getManagerRating());
        existing.setCategory(appraisal.getCategory());
        if (appraisal.getOrganizationId() != null) {
            existing.setOrganizationId(appraisal.getOrganizationId());
        }
        return ResponseEntity.ok(performanceAppraisalRepository.save(existing));
    }

    // --- TRAINING CENTER ENDPOINTS ---
    @GetMapping("/training/org/{orgId}")
    public ResponseEntity<List<TrainingSchedule>> getTrainingSchedules(@PathVariable Long orgId) {
        List<TrainingSchedule> list = trainingScheduleRepository.findByOrganizationId(orgId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/training")
    public ResponseEntity<TrainingSchedule> createTrainingSchedule(@RequestBody TrainingSchedule schedule) {
        return ResponseEntity.ok(trainingScheduleRepository.save(schedule));
    }

    @PutMapping("/training/{id}")
    public ResponseEntity<TrainingSchedule> updateTrainingSchedule(@PathVariable Long id, @RequestBody TrainingSchedule schedule) {
        TrainingSchedule existing = trainingScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training schedule not found"));
        existing.setName(schedule.getName());
        existing.setAssignedGroup(schedule.getAssignedGroup());
        existing.setAttendeesCount(schedule.getAttendeesCount());
        existing.setCompletionDate(schedule.getCompletionDate());
        existing.setStatus(schedule.getStatus());
        if (schedule.getOrganizationId() != null) {
            existing.setOrganizationId(schedule.getOrganizationId());
        }
        return ResponseEntity.ok(trainingScheduleRepository.save(existing));
    }

    // --- COMPLIANCE CENTER ENDPOINTS ---
    @GetMapping("/compliance/audits/org/{orgId}")
    public ResponseEntity<List<ComplianceAudit>> getComplianceAudits(@PathVariable Long orgId) {
        List<ComplianceAudit> list = complianceAuditRepository.findByOrganizationId(orgId);
        if (list.isEmpty()) {
            complianceAuditRepository.save(new ComplianceAudit("Q1 Labour Law Compliance", "Labour Law", "2025-03-15", "Completed", "S. K. Sharma & Co.", "98.5%", orgId));
            complianceAuditRepository.save(new ComplianceAudit("Site Safety Regulation Audit", "Safety", "2025-04-10", "Completed", "State Safety Board", "97.0%", orgId));
            complianceAuditRepository.save(new ComplianceAudit("Mandatory Employee Training Audit", "Training", "2025-05-02", "Completed", "Internal HR Committee", "100%", orgId));
            complianceAuditRepository.save(new ComplianceAudit("Contractor Wage & PF Compliance Audit", "Labour Law", "2025-05-20", "Action Required", "District Labour Commissioner", "89.2%", orgId));
            complianceAuditRepository.save(new ComplianceAudit("Q2 Internal Financial Audit", "Internal Financial", "2025-06-15", "Pending", "Verma & Associates", "Pending", orgId));
            list = complianceAuditRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/compliance/checklist/org/{orgId}")
    public ResponseEntity<List<ComplianceChecklist>> getComplianceChecklist(@PathVariable Long orgId) {
        List<ComplianceChecklist> list = complianceChecklistRepository.findByOrganizationId(orgId);
        if (list.isEmpty()) {
            complianceChecklistRepository.save(new ComplianceChecklist("Submit PF & ESI Monthly Returns", "Labour Law", "2025-06-15", "done", orgId));
            complianceChecklistRepository.save(new ComplianceChecklist("Submit Gratuity Act Annual Returns", "Labour Law", "2025-06-30", "pending", orgId));
            complianceChecklistRepository.save(new ComplianceChecklist("Verify Construction Site Labour Safety Certifications", "Safety", "2025-06-18", "pending", orgId));
            complianceChecklistRepository.save(new ComplianceChecklist("Conduct Workplace Harassment (POSH) Refresher", "Training", "2025-06-25", "pending", orgId));
            complianceChecklistRepository.save(new ComplianceChecklist("Renew Workman Compensation Insurance Policy", "Labour Law", "2025-07-05", "done", orgId));
            complianceChecklistRepository.save(new ComplianceChecklist("Submit Minimum Wages Compliance Declaration", "Labour Law", "2025-06-20", "pending", orgId));
            list = complianceChecklistRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(list);
    }

    @PutMapping("/compliance/checklist/{id}/toggle")
    public ResponseEntity<ComplianceChecklist> toggleComplianceChecklist(@PathVariable Long id) {
        ComplianceChecklist item = complianceChecklistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compliance checklist item not found"));
        item.setStatus(item.getStatus().equals("done") ? "pending" : "done");
        return ResponseEntity.ok(complianceChecklistRepository.save(item));
    }

    @PostMapping("/compliance/audits")
    public ResponseEntity<ComplianceAudit> createComplianceAudit(@RequestBody ComplianceAudit audit) {
        return ResponseEntity.ok(complianceAuditRepository.save(audit));
    }

    @GetMapping("/settings/user/{username}")
    public ResponseEntity<?> getHRSettings(@PathVariable String username) {
        HRManager hr = hrManagerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("HR Manager not found: " + username));
        Map<String, Object> settings = new HashMap<>();
        settings.put("name", hr.getUsername());
        settings.put("email", hr.getEmail());
        settings.put("phone", hr.getPhone() != null ? hr.getPhone() : "+91 98765 43210");
        settings.put("complianceAlerts", hr.getComplianceAlerts() != null ? hr.getComplianceAlerts() : true);
        settings.put("leaveRequests", hr.getLeaveRequests() != null ? hr.getLeaveRequests() : true);
        settings.put("payrollCycle", hr.getPayrollCycle() != null ? hr.getPayrollCycle() : true);
        settings.put("whatsappAlerts", hr.getWhatsappAlerts() != null ? hr.getWhatsappAlerts() : true);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings/user/{username}")
    public ResponseEntity<?> updateHRSettings(@PathVariable String username, @RequestBody Map<String, Object> payload) {
        HRManager hr = hrManagerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("HR Manager not found: " + username));

        if (payload.containsKey("email")) {
            hr.setEmail((String) payload.get("email"));
        }
        if (payload.containsKey("phone")) {
            hr.setPhone((String) payload.get("phone"));
        }
        if (payload.containsKey("complianceAlerts")) {
            hr.setComplianceAlerts((Boolean) payload.get("complianceAlerts"));
        }
        if (payload.containsKey("leaveRequests")) {
            hr.setLeaveRequests((Boolean) payload.get("leaveRequests"));
        }
        if (payload.containsKey("payrollCycle")) {
            hr.setPayrollCycle((Boolean) payload.get("payrollCycle"));
        }
        if (payload.containsKey("whatsappAlerts")) {
            hr.setWhatsappAlerts((Boolean) payload.get("whatsappAlerts"));
        }

        hrManagerRepository.save(hr);
        return ResponseEntity.ok(Map.of("message", "Settings updated successfully"));
    }
}
