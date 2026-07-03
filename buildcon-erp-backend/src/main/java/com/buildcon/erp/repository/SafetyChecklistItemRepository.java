package com.buildcon.erp.repository;

import com.buildcon.erp.model.SafetyChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SafetyChecklistItemRepository extends JpaRepository<SafetyChecklistItem, Long> {
    List<SafetyChecklistItem> findByProjectId(Long projectId);
    Optional<SafetyChecklistItem> findByProjectIdAndRuleId(Long projectId, String ruleId);
}
