package com.buildcon.erp.service;

import com.buildcon.erp.model.InventoryItem;
import java.util.List;

public interface InventoryItemService {
    InventoryItem addOrUpdateItem(InventoryItem item);
    List<InventoryItem> getInventoryByProject(Long projectId);
    List<InventoryItem> getAllInventory();
    InventoryItem getItemById(Long id);
    void updateQuantity(Long id, Double amount);
    void deleteItem(Long id);
}
