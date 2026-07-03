package com.buildcon.erp.repository;

import com.buildcon.erp.model.MarketingReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarketingReviewRepository extends JpaRepository<MarketingReview, Long> {
    List<MarketingReview> findByOrganizationId(Long organizationId);
}
