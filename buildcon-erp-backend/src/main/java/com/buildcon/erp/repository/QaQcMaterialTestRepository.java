package com.buildcon.erp.repository;

import com.buildcon.erp.model.QaQcMaterialTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QaQcMaterialTestRepository extends JpaRepository<QaQcMaterialTest, Long> {
    List<QaQcMaterialTest> findByOrganizationId(Long organizationId);
    void deleteByOrganizationId(Long organizationId);
}

