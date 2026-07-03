package com.buildcon.erp.controller;

import com.buildcon.erp.model.StrategicGoal;
import com.buildcon.erp.model.SwotItem;
import com.buildcon.erp.model.StrategicInitiative;
import com.buildcon.erp.repository.StrategicGoalRepository;
import com.buildcon.erp.repository.SwotItemRepository;
import com.buildcon.erp.repository.StrategicInitiativeRepository;
import com.buildcon.erp.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chairman/strategy")
public class StrategyController {

    @Autowired
    private StrategicGoalRepository strategicGoalRepository;

    @Autowired
    private SwotItemRepository swotItemRepository;

    @Autowired
    private StrategicInitiativeRepository strategicInitiativeRepository;

    // --- GOALS CRUD ---

    @GetMapping("/goals/{orgId}")
    public ResponseEntity<List<StrategicGoal>> getGoals(@PathVariable Long orgId) {
        List<StrategicGoal> goals = strategicGoalRepository.findByOrganizationId(orgId);
        if (goals.isEmpty()) {
            strategicGoalRepository.save(new StrategicGoal("Revenue Growth", "₹ 500 Cr", 60, "bg-blue-500", orgId));
            strategicGoalRepository.save(new StrategicGoal("Market Expansion", "Open 2 new branches", 80, "bg-emerald-500", orgId));
            strategicGoalRepository.save(new StrategicGoal("Operational Excellence", "Improve productivity by 10%", 50, "bg-amber-500", orgId));
            strategicGoalRepository.save(new StrategicGoal("Client Satisfaction", "Achieve a 4.8+ rating", 92, "bg-pink-500", orgId));
            goals = strategicGoalRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(goals);
    }

    @PostMapping("/goals")
    public ResponseEntity<?> createGoal(@RequestBody StrategicGoal goal) {
        StrategicGoal saved = strategicGoalRepository.save(goal);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/goals/{id}")
    public ResponseEntity<?> updateGoal(@PathVariable Long id, @RequestBody StrategicGoal goalDetails) {
        StrategicGoal goal = strategicGoalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));
        goal.setName(goalDetails.getName());
        goal.setTarget(goalDetails.getTarget());
        goal.setProgress(goalDetails.getProgress());
        if (goalDetails.getColor() != null && !goalDetails.getColor().isEmpty()) {
            goal.setColor(goalDetails.getColor());
        }
        StrategicGoal updated = strategicGoalRepository.save(goal);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/goals/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        strategicGoalRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Goal deleted successfully"));
    }

    // --- SWOT CRUD ---

    @GetMapping("/swot/{orgId}")
    public ResponseEntity<List<SwotItem>> getSwot(@PathVariable Long orgId) {
        List<SwotItem> items = swotItemRepository.findByOrganizationId(orgId);
        if (items.isEmpty()) {
            // Strengths
            swotItemRepository.save(new SwotItem("STRENGTH", "Experienced PMs", orgId));
            swotItemRepository.save(new SwotItem("STRENGTH", "Good reputation", orgId));
            swotItemRepository.save(new SwotItem("STRENGTH", "Cash stability", orgId));
            // Weaknesses
            swotItemRepository.save(new SwotItem("WEAKNESS", "High material costs", orgId));
            swotItemRepository.save(new SwotItem("WEAKNESS", "Labour shortages", orgId));
            swotItemRepository.save(new SwotItem("WEAKNESS", "Tech gaps", orgId));
            // Opportunities
            swotItemRepository.save(new SwotItem("OPPORTUNITY", "Green tech market", orgId));
            swotItemRepository.save(new SwotItem("OPPORTUNITY", "Government infra", orgId));
            swotItemRepository.save(new SwotItem("OPPORTUNITY", "AI ERP integration", orgId));
            // Threats
            swotItemRepository.save(new SwotItem("THREAT", "Inflation risks", orgId));
            swotItemRepository.save(new SwotItem("THREAT", "Regulatory shifts", orgId));
            swotItemRepository.save(new SwotItem("THREAT", "Local competition", orgId));

            items = swotItemRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(items);
    }

    @PostMapping("/swot")
    public ResponseEntity<?> createSwotItem(@RequestBody SwotItem item) {
        SwotItem saved = swotItemRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/swot/{id}")
    public ResponseEntity<?> deleteSwotItem(@PathVariable Long id) {
        swotItemRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("SWOT item deleted successfully"));
    }

    // --- INITIATIVES CRUD ---

    @GetMapping("/initiatives/{orgId}")
    public ResponseEntity<List<StrategicInitiative>> getInitiatives(@PathVariable Long orgId) {
        List<StrategicInitiative> initiatives = strategicInitiativeRepository.findByOrganizationId(orgId);
        if (initiatives.isEmpty()) {
            strategicInitiativeRepository.save(new StrategicInitiative("Digital Transformation", "Karthik R", "Dec 2025", 65, "On Track", orgId));
            strategicInitiativeRepository.save(new StrategicInitiative("Green Construction Certs", "Priya Raj", "Aug 2025", 85, "On Track", orgId));
            strategicInitiativeRepository.save(new StrategicInitiative("Talent Acquisition", "Vijay Kumar", "Oct 2025", 40, "Delayed", orgId));
            strategicInitiativeRepository.save(new StrategicInitiative("Vendor Consolidation", "Amit Kumar", "Jul 2025", 95, "On Track", orgId));
            strategicInitiativeRepository.save(new StrategicInitiative("Ventures Fund", "Board", "Mar 2026", 15, "On Track", orgId));
            initiatives = strategicInitiativeRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(initiatives);
    }

    @PostMapping("/initiatives")
    public ResponseEntity<?> createInitiative(@RequestBody StrategicInitiative initiative) {
        StrategicInitiative saved = strategicInitiativeRepository.save(initiative);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/initiatives/{id}")
    public ResponseEntity<?> updateInitiative(@PathVariable Long id, @RequestBody StrategicInitiative details) {
        StrategicInitiative initiative = strategicInitiativeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Initiative not found with id: " + id));
        initiative.setName(details.getName());
        initiative.setOwner(details.getOwner());
        initiative.setTimeline(details.getTimeline());
        initiative.setProgress(details.getProgress());
        initiative.setStatus(details.getStatus());
        StrategicInitiative updated = strategicInitiativeRepository.save(initiative);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/initiatives/{id}")
    public ResponseEntity<?> deleteInitiative(@PathVariable Long id) {
        strategicInitiativeRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Initiative deleted successfully"));
    }
}
