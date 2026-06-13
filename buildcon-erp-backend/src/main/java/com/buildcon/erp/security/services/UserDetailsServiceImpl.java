package com.buildcon.erp.security.services;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChairmanRepository chairmanRepository;

    @Autowired
    private MDRepository mdRepository;

    @Autowired
    private ProjectDirectorRepository projectDirectorRepository;

    @Autowired
    private BusinessDirectorRepository businessDirectorRepository;

    @Autowired
    private FinanceDirectorRepository financeDirectorRepository;

    @Autowired
    private ConstructionManagerRepository constructionManagerRepository;

    @Autowired
    private ProjectManagerRepository projectManagerRepository;

    @Autowired
    private QuantitySurveyorRepository quantitySurveyorRepository;

    @Autowired
    private ProcurementManagerRepository procurementManagerRepository;

    @Autowired
    private FinanceAccountsRepository financeAccountsRepository;

    @Autowired
    private SiteManagementRepository siteManagementRepository;

    @Autowired
    private WorkforceManagerRepository workforceManagerRepository;

    @Autowired
    private SubcontractorRepository subcontractorRepository;

    @Autowired
    private SeniorSiteEngineerRepository seniorSiteEngineerRepository;

    @Autowired
    private DigitalMarketingTLRepository digitalMarketingTLRepository;

    @Autowired
    private DigitalMarketingExecutiveRepository digitalMarketingExecutiveRepository;

    @Autowired
    private SalesExecutiveRepository salesExecutiveRepository;

    @Autowired
    private MarketingManagerRepository marketingManagerRepository;

    @Autowired
    private HRManagerRepository hrManagerRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Legacy/Admin check
        var legacyUser = userRepository.findByUsername(username).or(() -> userRepository.findByEmail(username));
        if (legacyUser.isPresent()) {
            return UserDetailsImpl.build(legacyUser.get());
        }

        // 2. Chairman check
        var chairman = chairmanRepository.findByUsername(username).or(() -> chairmanRepository.findByEmail(username));
        if (chairman.isPresent()) {
            var c = chairman.get();
            return new UserDetailsImpl(c.getId(), c.getUsername(), c.getEmail(), c.getPassword(), c.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(c.getChairmanRole())));
        }

        // 3. MD check
        var md = mdRepository.findByUsername(username).or(() -> mdRepository.findByEmail(username));
        if (md.isPresent()) {
            var m = md.get();
            return new UserDetailsImpl(m.getId(), m.getUsername(), m.getEmail(), m.getPassword(), m.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(m.getRoleName())));
        }

        // 4. ProjectDirector check
        var pd = projectDirectorRepository.findByUsername(username).or(() -> projectDirectorRepository.findByEmail(username));
        if (pd.isPresent()) {
            var p = pd.get();
            return new UserDetailsImpl(p.getId(), p.getUsername(), p.getEmail(), p.getPassword(), p.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(p.getRoleName())));
        }

        // 5. BusinessDirector check
        var bd = businessDirectorRepository.findByUsername(username).or(() -> businessDirectorRepository.findByEmail(username));
        if (bd.isPresent()) {
            var b = bd.get();
            return new UserDetailsImpl(b.getId(), b.getUsername(), b.getEmail(), b.getPassword(), b.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(b.getRoleName())));
        }

        // 6. FinanceDirector check
        var fd = financeDirectorRepository.findByUsername(username).or(() -> financeDirectorRepository.findByEmail(username));
        if (fd.isPresent()) {
            var f = fd.get();
            return new UserDetailsImpl(f.getId(), f.getUsername(), f.getEmail(), f.getPassword(), f.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(f.getRoleName())));
        }

        // 7. ConstructionManager check
        var cm = constructionManagerRepository.findByUsername(username).or(() -> constructionManagerRepository.findByEmail(username));
        if (cm.isPresent()) {
            var c = cm.get();
            return new UserDetailsImpl(c.getId(), c.getUsername(), c.getEmail(), c.getPassword(), c.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(c.getRoleName())));
        }

        // 8. ProjectManager check
        var pm = projectManagerRepository.findByUsername(username).or(() -> projectManagerRepository.findByEmail(username));
        if (pm.isPresent()) {
            var p = pm.get();
            return new UserDetailsImpl(p.getId(), p.getUsername(), p.getEmail(), p.getPassword(), p.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(p.getRoleName())));
        }

        // 9. QuantitySurveyor check
        var qs = quantitySurveyorRepository.findByUsername(username).or(() -> quantitySurveyorRepository.findByEmail(username));
        if (qs.isPresent()) {
            var q = qs.get();
            return new UserDetailsImpl(q.getId(), q.getUsername(), q.getEmail(), q.getPassword(), q.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(q.getRoleName())));
        }

        // 10. ProcurementManager check
        var pr = procurementManagerRepository.findByUsername(username).or(() -> procurementManagerRepository.findByEmail(username));
        if (pr.isPresent()) {
            var p = pr.get();
            return new UserDetailsImpl(p.getId(), p.getUsername(), p.getEmail(), p.getPassword(), p.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(p.getRoleName())));
        }

        // 11. FinanceAccounts check
        var fa = financeAccountsRepository.findByUsername(username).or(() -> financeAccountsRepository.findByEmail(username));
        if (fa.isPresent()) {
            var f = fa.get();
            return new UserDetailsImpl(f.getId(), f.getUsername(), f.getEmail(), f.getPassword(), f.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(f.getRoleName())));
        }

        // 12. SiteManagement check
        var sm = siteManagementRepository.findByUsername(username).or(() -> siteManagementRepository.findByEmail(username));
        if (sm.isPresent()) {
            var s = sm.get();
            return new UserDetailsImpl(s.getId(), s.getUsername(), s.getEmail(), s.getPassword(), s.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(s.getRoleName())));
        }

        // 13. WorkforceManager check
        var wm = workforceManagerRepository.findByUsername(username).or(() -> workforceManagerRepository.findByEmail(username));
        if (wm.isPresent()) {
            var w = wm.get();
            return new UserDetailsImpl(w.getId(), w.getUsername(), w.getEmail(), w.getPassword(), w.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(w.getRoleName())));
        }

        // 14. Subcontractor check
        var sub = subcontractorRepository.findByUsername(username).or(() -> subcontractorRepository.findByEmail(username));
        if (sub.isPresent()) {
            var s = sub.get();
            return new UserDetailsImpl(s.getId(), s.getUsername(), s.getEmail(), s.getPassword(), s.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(s.getRoleName())));
        }

        // 15. SeniorSiteEngineer check
        var sse = seniorSiteEngineerRepository.findByUsername(username).or(() -> seniorSiteEngineerRepository.findByEmail(username));
        if (sse.isPresent()) {
            var s = sse.get();
            return new UserDetailsImpl(s.getId(), s.getUsername(), s.getEmail(), s.getPassword(), s.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(s.getRoleName())));
        }

        // 16. DigitalMarketingTL check
        var dtl = digitalMarketingTLRepository.findByUsername(username).or(() -> digitalMarketingTLRepository.findByEmail(username));
        if (dtl.isPresent()) {
            var d = dtl.get();
            return new UserDetailsImpl(d.getId(), d.getUsername(), d.getEmail(), d.getPassword(), d.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(d.getRoleName())));
        }

        // 17. DigitalMarketingExecutive check
        var dme = digitalMarketingExecutiveRepository.findByUsername(username).or(() -> digitalMarketingExecutiveRepository.findByEmail(username));
        if (dme.isPresent()) {
            var d = dme.get();
            return new UserDetailsImpl(d.getId(), d.getUsername(), d.getEmail(), d.getPassword(), d.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(d.getRoleName())));
        }

        // 18. SalesExecutive check
        var se = salesExecutiveRepository.findByUsername(username).or(() -> salesExecutiveRepository.findByEmail(username));
        if (se.isPresent()) {
            var s = se.get();
            return new UserDetailsImpl(s.getId(), s.getUsername(), s.getEmail(), s.getPassword(), s.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(s.getRoleName())));
        }

        // 19. MarketingManager check
        var mm = marketingManagerRepository.findByUsername(username).or(() -> marketingManagerRepository.findByEmail(username));
        if (mm.isPresent()) {
            var m = mm.get();
            return new UserDetailsImpl(m.getId(), m.getUsername(), m.getEmail(), m.getPassword(), m.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(m.getRoleName())));
        }

        // 20. HRManager check
        var hr = hrManagerRepository.findByUsername(username).or(() -> hrManagerRepository.findByEmail(username));
        if (hr.isPresent()) {
            var h = hr.get();
            return new UserDetailsImpl(h.getId(), h.getUsername(), h.getEmail(), h.getPassword(), h.getOrganizationId(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(h.getRoleName())));
        }

        // 21. AdminUser check
        var au = adminUserRepository.findByUsername(username).or(() -> adminUserRepository.findByEmail(username));
        if (au.isPresent()) {
            var a = au.get();
            return new UserDetailsImpl(a.getId(), a.getUsername(), a.getEmail(), a.getPassword(), null,
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(a.getRoleName())));
        }

        throw new UsernameNotFoundException("User Not Found with username: " + username);
    }
}
