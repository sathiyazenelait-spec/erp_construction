package com.buildcon.erp.repository;

import com.buildcon.erp.model.BoardApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BoardApprovalRepository extends JpaRepository<BoardApproval, Long> {
    List<BoardApproval> findByOrganizationId(Long organizationId);
    List<BoardApproval> findByOrganizationIdAndStatus(Long organizationId, String status);
}
