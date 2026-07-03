package com.buildcon.erp.repository;

import com.buildcon.erp.model.TlmCalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TlmCalendarEventRepository extends JpaRepository<TlmCalendarEvent, Long> {
    List<TlmCalendarEvent> findByOrganizationId(Long organizationId);
}
