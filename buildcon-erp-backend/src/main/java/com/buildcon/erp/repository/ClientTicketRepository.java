package com.buildcon.erp.repository;

import com.buildcon.erp.model.ClientTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClientTicketRepository extends JpaRepository<ClientTicket, Long> {
    List<ClientTicket> findByOrganizationId(Long organizationId);
    void deleteByOrganizationId(Long organizationId);
}

