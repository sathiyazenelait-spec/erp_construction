package com.buildcon.erp.repository;

import com.buildcon.erp.model.StockTransferNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StockTransferNoteRepository extends JpaRepository<StockTransferNote, Long> {
    List<StockTransferNote> findByOrganizationId(Long organizationId);
    void deleteByOrganizationId(Long organizationId);
}

