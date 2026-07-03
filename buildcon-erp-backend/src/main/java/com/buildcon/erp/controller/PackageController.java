package com.buildcon.erp.controller;

import com.buildcon.erp.model.Package;
import com.buildcon.erp.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/packages")
public class PackageController {

    @Autowired
    private PackageRepository packageRepository;

    @GetMapping
    public ResponseEntity<List<Package>> getAllPackages() {
        return ResponseEntity.ok(packageRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Package> createPackage(@RequestBody Package pack) {
        Package saved = packageRepository.save(pack);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePackage(@PathVariable Long id, @RequestBody Package packageDetails) {
        return packageRepository.findById(id).map(pack -> {
            pack.setName(packageDetails.getName());
            pack.setBadge(packageDetails.getBadge());
            pack.setPrice(packageDetails.getPrice());
            pack.setDescription(packageDetails.getDescription());
            pack.setThemeColor(packageDetails.getThemeColor());
            pack.setFeatures(packageDetails.getFeatures());
            Package updated = packageRepository.save(pack);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePackage(@PathVariable Long id) {
        return packageRepository.findById(id).map(pack -> {
            packageRepository.delete(pack);
            return ResponseEntity.ok("Package deleted successfully!");
        }).orElse(ResponseEntity.notFound().build());
    }
}
