package com.buildcon.erp.repository;

import com.buildcon.erp.model.PmVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PmVendorRepository extends JpaRepository<PmVendor, Long> {
    List<PmVendor> findByOrganizationId(Long organizationId);
}
