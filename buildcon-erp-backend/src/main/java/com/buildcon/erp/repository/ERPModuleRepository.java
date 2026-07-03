package com.buildcon.erp.repository;

import com.buildcon.erp.model.ERPModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ERPModuleRepository extends JpaRepository<ERPModule, Long> {
    Optional<ERPModule> findByModuleKey(String moduleKey);
}
