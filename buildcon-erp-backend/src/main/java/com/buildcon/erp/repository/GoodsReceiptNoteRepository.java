package com.buildcon.erp.repository;

import com.buildcon.erp.model.GoodsReceiptNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GoodsReceiptNoteRepository extends JpaRepository<GoodsReceiptNote, Long> {
    List<GoodsReceiptNote> findByOrganizationId(Long organizationId);
    void deleteByOrganizationId(Long organizationId);
}

