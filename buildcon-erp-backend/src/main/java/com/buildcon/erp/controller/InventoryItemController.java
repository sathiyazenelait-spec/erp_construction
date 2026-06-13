package com.buildcon.erp.controller;

import com.buildcon.erp.model.InventoryItem;
import com.buildcon.erp.service.InventoryItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/inventory")
public class InventoryItemController {

    @Autowired
    private InventoryItemService service;

    @PostMapping
    public ResponseEntity<InventoryItem> addOrUpdateItem(@RequestBody InventoryItem item) {
        return ResponseEntity.ok(service.addOrUpdateItem(item));
    }

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllInventory() {
        return ResponseEntity.ok(service.getAllInventory());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<InventoryItem>> getInventoryByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(service.getInventoryByProject(projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getItemById(id));
    }

    @PutMapping("/{id}/quantity")
    public ResponseEntity<String> updateQuantity(@PathVariable Long id, @RequestParam Double amount) {
        service.updateQuantity(id, amount);
        return ResponseEntity.ok("Stock quantity updated successfully!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id) {
        service.deleteItem(id);
        return ResponseEntity.ok("Inventory item deleted successfully!");
    }
}
