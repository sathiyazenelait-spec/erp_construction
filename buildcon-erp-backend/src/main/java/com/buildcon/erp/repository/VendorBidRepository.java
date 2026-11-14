package com.buildcon.erp.repository;

import com.buildcon.erp.model.VendorBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorBidRepository extends JpaRepository<VendorBid, Long> {
    List<VendorBid> findByOrganizationId(Long organizationId);
    void deleteByOrganizationId(Long organizationId);
}

