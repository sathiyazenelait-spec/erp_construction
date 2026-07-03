package com.buildcon.erp.repository;

import com.buildcon.erp.model.SalesProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalesProposalRepository extends JpaRepository<SalesProposal, Long> {
    List<SalesProposal> findByOrganizationId(Long organizationId);
}
