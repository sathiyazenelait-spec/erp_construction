package com.buildcon.erp.repository;

import com.buildcon.erp.model.PmRfq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PmRfqRepository extends JpaRepository<PmRfq, Long> {
    List<PmRfq> findByOrganizationId(Long organizationId);
}
