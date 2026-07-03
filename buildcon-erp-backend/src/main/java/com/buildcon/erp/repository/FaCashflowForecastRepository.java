package com.buildcon.erp.repository;

import com.buildcon.erp.model.FaCashflowForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FaCashflowForecastRepository extends JpaRepository<FaCashflowForecast, Long> {
    List<FaCashflowForecast> findByOrganizationId(Long organizationId);
}
