package com.buildcon.erp.repository;

import com.buildcon.erp.model.ChairmanTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChairmanTicketRepository extends JpaRepository<ChairmanTicket, Long> {
    List<ChairmanTicket> findByOrganizationId(Long organizationId);
}
