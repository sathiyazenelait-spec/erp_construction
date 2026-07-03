package com.buildcon.erp.repository;

import com.buildcon.erp.model.SseCubeTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SseCubeTestRepository extends JpaRepository<SseCubeTest, Long> {
    List<SseCubeTest> findByOrganizationId(Long organizationId);
}
