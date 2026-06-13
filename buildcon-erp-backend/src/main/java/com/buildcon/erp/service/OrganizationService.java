package com.buildcon.erp.service;

import com.buildcon.erp.model.Organization;
import com.buildcon.erp.payload.request.OrgCreationRequest;
import java.util.List;

public interface OrganizationService {
    Organization createOrganization(OrgCreationRequest request);
    List<Organization> getAllOrganizations();
    Organization getOrganizationById(Long id);
    void deleteOrganization(Long id);
}
