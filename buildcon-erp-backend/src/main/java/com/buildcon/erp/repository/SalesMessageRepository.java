package com.buildcon.erp.repository;

import com.buildcon.erp.model.SalesMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalesMessageRepository extends JpaRepository<SalesMessage, Long> {
    List<SalesMessage> findByChatId(Long chatId);
}
