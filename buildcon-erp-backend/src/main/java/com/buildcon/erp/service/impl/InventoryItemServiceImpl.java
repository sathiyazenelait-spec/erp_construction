package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.model.InventoryItem;
import com.buildcon.erp.repository.InventoryItemRepository;
import com.buildcon.erp.service.InventoryItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryItemServiceImpl implements InventoryItemService {

    @Autowired
    private InventoryItemRepository repository;

    @Override
    public InventoryItem addOrUpdateItem(InventoryItem item) {
        if (item.getName() == null || item.getName().trim().isEmpty()) {
            throw new CustomValidationException("Error: Item name cannot be empty!");
        }
        item.setLastUpdated(LocalDate.now());
        return repository.save(item);
    }

    @Override
    public List<InventoryItem> getInventoryByProject(Long projectId) {
        return repository.findByProjectId(projectId);
    }

    @Override
    public List<InventoryItem> getAllInventory() {
        return repository.findAll();
    }

    @Override
    public InventoryItem getItemById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CustomValidationException("Error: Inventory item not found with id: " + id));
    }

    @Override
    public void updateQuantity(Long id, Double amount) {
        InventoryItem item = getItemById(id);
        item.setQuantity(item.getQuantity() + amount);
        item.setLastUpdated(LocalDate.now());
        repository.save(item);
    }

    @Override
    public void deleteItem(Long id) {
        if (!repository.existsById(id)) {
            throw new CustomValidationException("Error: Inventory item not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
