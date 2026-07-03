package com.buildcon.erp.repository;

import com.buildcon.erp.model.SalesChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalesChatRepository extends JpaRepository<SalesChat, Long> {
    List<SalesChat> findByOrganizationId(Long organizationId);
}
