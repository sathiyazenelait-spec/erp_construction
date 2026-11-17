package com.buildcon.erp.repository;

import com.buildcon.erp.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    List<NotificationLog> findByOrganizationIdOrderBySentAtDesc(Long organizationId);
    List<NotificationLog> findByOrganizationIdAndChannel(Long organizationId, String channel);
    List<NotificationLog> findByOrganizationIdAndDeliveryStatus(Long organizationId, String deliveryStatus);
}
