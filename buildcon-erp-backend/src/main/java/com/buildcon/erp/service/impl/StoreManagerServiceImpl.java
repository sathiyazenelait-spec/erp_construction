package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.service.StoreManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StoreManagerServiceImpl implements StoreManagerService {

    @Autowired
    private StoreManagerRepository repository;

    @Autowired
    private StoreItemRepository itemRepository;

    @Autowired
    private GoodsReceiptNoteRepository grnRepository;

    @Autowired
    private StockTransferNoteRepository stnRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public StoreManager register(GenericSignupRequest request) {
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

        StoreManager item = new StoreManager(
            request.getUsername(),
            request.getEmail(),
            encoder.encode(request.getPassword())
        );
        item.setOrganizationId(request.getOrganizationId());
        return repository.save(item);
    }

    @Override
    public void seedStoreData(Long organizationId) {
        List<StoreItem> items = itemRepository.findByOrganizationId(organizationId);
        if (items.isEmpty()) {
            itemRepository.save(new StoreItem("MAT-101", "OPC 53 Grade Cement (UltraTech)", "Cement", "Bags (50kg)", 1450.0, 300.0, "Warehouse 1 - Bay A12", 420.0, organizationId));
            itemRepository.save(new StoreItem("MAT-102", "TMT Steel Rebar Fe500D (16mm)", "Steel", "Metric Ton", 28.5, 10.0, "Open Yard - Rebar Rack 3", 68500.0, organizationId));
            itemRepository.save(new StoreItem("MAT-103", "Manufactured Sand (M-Sand)", "Aggregates", "Cubic Meter", 180.0, 50.0, "Bunker Pit 2", 1850.0, organizationId));
            itemRepository.save(new StoreItem("MAT-104", "Solid Concrete Blocks (400x200x200mm)", "Masonry", "Pieces", 4200.0, 1000.0, "Covered Shed B", 58.0, organizationId));
            itemRepository.save(new StoreItem("MAT-105", "Integral Waterproofing Compound (Dr. Fixit)", "Chemicals", "Liters", 650.0, 150.0, "Chemical Store Room - Shelf C4", 175.0, organizationId));
        }

        List<GoodsReceiptNote> grns = grnRepository.findByOrganizationId(organizationId);
        if (grns.isEmpty()) {
            grnRepository.save(new GoodsReceiptNote("GRN-2026-081", "PO-101", "UltraTech Cement Ltd", LocalDate.now().minusDays(2), "TN-09-CB-4491", "CH-99410", "G. Murugan (Storekeeper)", "VERIFIED_ACCEPTED", 500.0, "500 bags unloaded at Bay A12. Zero moisture exposure. Test cert verified.", organizationId));
            grnRepository.save(new GoodsReceiptNote("GRN-2026-082", "PO-102", "Tata Tiscon Distributors", LocalDate.now().minusDays(1), "TN-22-DX-1180", "CH-99455", "G. Murugan (Storekeeper)", "VERIFIED_ACCEPTED", 15.0, "15 MT bundles received. Mill test certificate attached.", organizationId));
            grnRepository.save(new GoodsReceiptNote("GRN-2026-083", "PO-105", "Pidilite Industries", LocalDate.now(), "KA-01-MJ-8822", "CH-99512", "G. Murugan (Storekeeper)", "VERIFIED_ACCEPTED", 200.0, "200 Liters barrels intact with sealed tamper tags.", organizationId));
        }

        List<StockTransferNote> stns = stnRepository.findByOrganizationId(organizationId);
        if (stns.isEmpty()) {
            stnRepository.save(new StockTransferNote("STN-2026-01", "Central Warehouse - Chennai", "Skyline Residences Site", "OPC 53 Grade Cement", 250.0, "Bags", LocalDate.now().minusDays(1), LocalDate.now(), "Speed Cargo Logistics (TN-05-AA-7711)", "RECEIVED", organizationId));
            stnRepository.save(new StockTransferNote("STN-2026-02", "Skyline Residences Site", "Greenfield Villas Site", "TMT Steel Rebar (12mm)", 4.5, "MT", LocalDate.now(), LocalDate.now().plusDays(1), "Southern Heavy Movers (TN-18-B-3310)", "IN_TRANSIT", organizationId));
        }
    }
}

