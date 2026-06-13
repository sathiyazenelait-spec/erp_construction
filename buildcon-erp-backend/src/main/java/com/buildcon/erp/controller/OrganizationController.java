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
}
