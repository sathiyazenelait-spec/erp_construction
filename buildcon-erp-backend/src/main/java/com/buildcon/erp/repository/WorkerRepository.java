package com.buildcon.erp.repository;

import com.buildcon.erp.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findByOrganizationId(Long organizationId);
    long countByOrganizationId(Long organizationId);
}
