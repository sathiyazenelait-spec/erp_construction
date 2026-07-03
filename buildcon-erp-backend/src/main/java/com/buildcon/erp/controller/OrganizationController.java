package com.buildcon.erp.controller;

import com.buildcon.erp.model.Organization;
import com.buildcon.erp.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    @Autowired
    private OrganizationService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody com.buildcon.erp.payload.request.OrgCreationRequest request) {
        Organization res = service.createOrganization(request);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody java.util.Map<String, String> request) {
        String name = request.get("name");
        String username = request.get("username");
        String password = request.get("password");

        if (name == null || username == null || password == null) {
            return ResponseEntity.badRequest().body(new com.buildcon.erp.payload.response.MessageResponse("Error: Missing credentials!"));
        }

        java.util.Optional<Organization> orgOpt = service.getAllOrganizations().stream()
                .filter(o -> o.getName().equalsIgnoreCase(name))
                .findFirst();

        if (orgOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new com.buildcon.erp.payload.response.MessageResponse("Error: Organization not found!"));
        }

        Organization org = orgOpt.get();
        if (username.equals(org.getOrgUsername()) && password.equals(org.getOrgPassword())) {
            return ResponseEntity.ok(org);
        } else {
            return ResponseEntity.status(401).body(new com.buildcon.erp.payload.response.MessageResponse("Error: Invalid credentials!"));
        }
    }

    @GetMapping
    public ResponseEntity<List<Organization>> getAll() {
        return ResponseEntity.ok(service.getAllOrganizations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getOrganizationById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.deleteOrganization(id);
        return ResponseEntity.ok("Organization deleted successfully!");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Organization res = service.updateOrganizationStatus(id, status);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/subscription")
    public ResponseEntity<?> updateSubscription(@PathVariable Long id, @RequestParam String tier) {
        Organization res = service.updateOrganizationSubscription(id, tier);
        return ResponseEntity.ok(res);
    }
}
