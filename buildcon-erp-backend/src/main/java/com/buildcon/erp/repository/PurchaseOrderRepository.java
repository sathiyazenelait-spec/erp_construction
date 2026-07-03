package com.buildcon.erp.repository;

import com.buildcon.erp.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByOrganizationId(Long organizationId);
    List<PurchaseOrder> findByOrganizationIdAndPoDateBetween(Long organizationId, LocalDate startDate, LocalDate endDate);
}
