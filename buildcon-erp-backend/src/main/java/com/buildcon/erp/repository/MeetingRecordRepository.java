package com.buildcon.erp.repository;

import com.buildcon.erp.model.MeetingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MeetingRecordRepository extends JpaRepository<MeetingRecord, Long> {
    List<MeetingRecord> findByOrganizationIdOrderByMeetingDateDesc(Long organizationId);
    List<MeetingRecord> findByOrganizationIdAndStatus(Long organizationId, String status);
}
