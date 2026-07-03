package com.buildcon.erp.repository;

import com.buildcon.erp.model.TlmTeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TlmTeamMemberRepository extends JpaRepository<TlmTeamMember, Long> {
    List<TlmTeamMember> findByOrganizationId(Long organizationId);
}
