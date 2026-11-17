package com.buildcon.erp.repository;

import com.buildcon.erp.model.MeetingActionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MeetingActionItemRepository extends JpaRepository<MeetingActionItem, Long> {
    List<MeetingActionItem> findByOrganizationIdOrderByDueDateAsc(Long organizationId);
    List<MeetingActionItem> findByMeetingId(Long meetingId);
    List<MeetingActionItem> findByOrganizationIdAndStatus(Long organizationId, String status);
}
