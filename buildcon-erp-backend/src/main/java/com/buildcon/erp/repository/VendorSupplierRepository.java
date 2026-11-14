package com.buildcon.erp.repository;

import com.buildcon.erp.model.VendorSupplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface VendorSupplierRepository extends JpaRepository<VendorSupplier, Long> {
    Optional<VendorSupplier> findByUsername(String username);
    Optional<VendorSupplier> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    void deleteByOrganizationId(Long organizationId);
    List<VendorSupplier> findByOrganizationId(Long organizationId);
}

