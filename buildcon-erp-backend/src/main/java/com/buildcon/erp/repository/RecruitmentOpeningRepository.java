package com.buildcon.erp.repository;

import com.buildcon.erp.model.RecruitmentOpening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecruitmentOpeningRepository extends JpaRepository<RecruitmentOpening, Long> {
    List<RecruitmentOpening> findByOrganizationId(Long organizationId);
}
