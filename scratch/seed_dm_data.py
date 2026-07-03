import pymysql

def seed_data():
    try:
        conn = pymysql.connect(
            host="localhost",
            user="root",
            password="Sathiya@123",
            database="buildcon_erp",
            cursorclass=pymysql.cursors.DictCursor
        )
        with conn.cursor() as cursor:
            print("Clearing old Digital Marketing TL, Executive, and Sales Executive data for Org 1...")
            
            # Clear old records for org 1
            cursor.execute("DELETE FROM marketing_campaigns WHERE organization_id = 1")
            cursor.execute("DELETE FROM tlm_team_members WHERE organization_id = 1")
            cursor.execute("DELETE FROM tlm_calendar_events WHERE organization_id = 1")
            cursor.execute("DELETE FROM marketing_trends WHERE organization_id = 1")
            cursor.execute("DELETE FROM marketing_metrics WHERE organization_id = 1")
            cursor.execute("DELETE FROM sales_leads WHERE organization_id = 1")
            cursor.execute("DELETE FROM dashboard_shell_configs WHERE organization_id = 1 AND dashboard_type = 'digital-marketing-tl'")
            
            # Clear Sales Executive tables
            cursor.execute("DELETE FROM sales_proposals WHERE organization_id = 1")
            cursor.execute("DELETE FROM sales_activities WHERE organization_id = 1")
            cursor.execute("DELETE FROM sales_chats WHERE organization_id = 1")
            cursor.execute("DELETE FROM revenue_entries WHERE organization_id = 1")
            cursor.execute("DELETE FROM sales_messages WHERE chat_id NOT IN (SELECT id FROM sales_chats)")
            
            print("Seeding new campaigns...")
            campaigns = [
                ("Skyline Residences Launch", "Google Ads", 750, 225000.0, 3.8, "Active", "300", 1),
                ("Greenfield Apartments Promo", "Meta Ads", 520, 156000.0, 4.6, "Active", "300", 1),
                ("Coimbatore Hub SEO push", "SEO Organic", 410, 45000.0, 5.2, "Active", "110", 1),
                ("Villa Community Referrals", "Offline Hub", 170, 34000.0, 2.9, "Active", "200", 1),
                ("Brand Awareness", "Website", 620, 20000.0, 3.0, "Active", "32", 1),
                ("Marina Bay Luxury Suites", "Google Ads", 850, 340000.0, 4.2, "Active", "400", 1),
                ("Smart Home Expo", "Meta Ads", 620, 186000.0, 3.9, "Active", "300", 1),
                ("Trichy Commercial Hub", "LinkedIn Ads", 240, 120000.0, 2.5, "Active", "500", 1),
                ("Hillview Villas Pre-Launch", "Offline Hub", 180, 54000.0, 3.6, "Active", "300", 1),
                ("SEO Organic Optimization", "SEO Organic", 450, 50000.0, 5.0, "Active", "111", 1)
            ]
            for c in campaigns:
                cursor.execute("""
                    INSERT INTO marketing_campaigns (name, platform, leads, cost, roi, status, cpl, organization_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, c)
                
            print("Seeding team members...")
            team_members = [
                ("Ananya Verma", "Executive", 45, 42, 210, "AV", 1),
                ("Rohit Mehta", "Executive", 38, 36, 180, "RM", 1),
                ("Neha Gupta", "Executive", 41, 39, 195, "NG", 1),
                ("Arjun Rao", "Executive", 35, 31, 165, "AR", 1),
                ("Karan Johar", "Executive", 30, 28, 150, "KJ", 1),
                ("Suresh Raina", "Executive", 25, 20, 130, "SR", 1)
            ]
            for t in team_members:
                cursor.execute("""
                    INSERT INTO tlm_team_members (name, role, tasks_assigned, tasks_completed, leads_generated, avatar, organization_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, t)
                
            print("Seeding calendar events...")
            calendar_events = [
                ("Project Reel", 1, "Instagram", "Published", 1),
                ("Construction Tips", 3, "Facebook", "Published", 1),
                ("Behind the Scenes", 9, "YouTube", "Published", 1),
                ("Modern Apartments Showcase", 12, "Instagram", "Scheduled", 1),
                ("Team Spotlight", 16, "LinkedIn", "Scheduled", 1),
                ("SEO Blog Post", 20, "Blog", "Draft", 1),
                ("Project Update", 26, "LinkedIn", "Draft", 1),
                ("Interactive Virtual Tour", 15, "Website", "Scheduled", 1),
                ("Client Success Stories", 22, "YouTube", "Draft", 1)
            ]
            for evt in calendar_events:
                cursor.execute("""
                    INSERT INTO tlm_calendar_events (title, date, channel, status, organization_id)
                    VALUES (%s, %s, %s, %s, %s)
                """, evt)
                
            print("Seeding marketing trends...")
            trends = [
                ("leads_vs_qualified", "1 May", 1000.0, 220.0, 1),
                ("leads_vs_qualified", "8 May", 2200.0, 480.0, 1),
                ("leads_vs_qualified", "15 May", 3400.0, 750.0, 1),
                ("leads_vs_qualified", "22 May", 4500.0, 1000.0, 1),
                ("leads_vs_qualified", "31 May", 5390.0, 1200.0, 1)
            ]
            for tr in trends:
                cursor.execute("""
                    INSERT INTO marketing_trends (chart_name, label, value1, value2, organization_id)
                    VALUES (%s, %s, %s, %s, %s)
                """, tr)
                
            print("Seeding marketing metrics...")
            metrics = [
                # --- TL Dashboard Metrics ---
                ("Google Ads", 1600.0, "tl_lead_sources", "Google Ads", 1),
                ("Website", 620.0, "tl_lead_sources", "Website", 1),
                ("Meta Ads", 1140.0, "tl_lead_sources", "Meta Ads", 1),
                ("Instagram", 150.0, "tl_lead_sources", "Instagram", 1),
                ("Referrals", 75.0, "tl_lead_sources", "Referrals", 1),
                ("SEO Organic", 860.0, "tl_lead_sources", "SEO Organic", 1),
                ("Offline Hub", 350.0, "tl_lead_sources", "Offline Hub", 1),
                ("LinkedIn Ads", 240.0, "tl_lead_sources", "LinkedIn Ads", 1),
                ("Others", 355.0, "tl_lead_sources", "Others", 1),

                ("Google Ads Clicks", 26500.0, "tl_ad_perf_clicks", "Google Ads", 1),
                ("Google Ads Conv", 680.0, "tl_ad_perf_conv", "Google Ads", 1),
                ("Google Ads Cost", 565000.0, "tl_ad_perf_cost", "Google Ads", 1),
                ("Google Ads CTR", 4.95, "tl_ad_perf_ctr", "Google Ads", 1),

                ("Meta Ads Clicks", 18500.0, "tl_ad_perf_clicks", "Meta Ads", 1),
                ("Meta Ads Conv", 450.0, "tl_ad_perf_conv", "Meta Ads", 1),
                ("Meta Ads Cost", 342000.0, "tl_ad_perf_cost", "Meta Ads", 1),
                ("Meta Ads CTR", 3.45, "tl_ad_perf_ctr", "Meta Ads", 1),

                ("Google Ads", 565000.0, "tl_budget_breakdown", "Google Ads", 1),
                ("Meta Ads", 342000.0, "tl_budget_breakdown", "Meta Ads", 1),
                ("SEO Organic", 95000.0, "tl_budget_breakdown", "SEO Organic", 1),
                ("LinkedIn Ads", 120000.0, "tl_budget_breakdown", "LinkedIn Ads", 1),
                ("Offline Hub", 88000.0, "tl_budget_breakdown", "Offline Hub", 1),
                ("Brand Awareness / Website", 20000.0, "tl_budget_breakdown", "Brand Awareness / Website", 1),
                ("Content Creation", 35000.0, "tl_budget_breakdown", "Content Creation", 1),

                ("SEO Traffic", 32500.0, "tl_seo_stats", "Traffic", 1),
                ("SEO Keywords", 1250.0, "tl_seo_stats", "Keywords", 1),
                ("SEO Authority", 38.0, "tl_seo_stats", "Authority", 1),
                ("SEO Top 10 Keywords", 185.0, "tl_seo_stats", "Top 10 Keywords", 1),

                ("kw_construction_chennai_pos", 1.0, "tl_seo_keywords", "construction company in chennai", 1),
                ("kw_construction_chennai_vol", 3800.0, "tl_seo_keywords_vol", "construction company in chennai", 1),
                ("kw_construction_chennai_dir", 2.0, "tl_seo_keywords_dir", "construction company in chennai", 1),

                ("kw_house_coimbatore_pos", 2.0, "tl_seo_keywords", "house construction cost in coimbatore", 1),
                ("kw_house_coimbatore_vol", 1900.0, "tl_seo_keywords_vol", "house construction cost in coimbatore", 1),
                ("kw_house_coimbatore_dir", 4.0, "tl_seo_keywords_dir", "house construction cost in coimbatore", 1),

                ("kw_best_chennai_pos", 3.0, "tl_seo_keywords", "best builders in chennai", 1),
                ("kw_best_chennai_vol", 1200.0, "tl_seo_keywords_vol", "best builders in chennai", 1),
                ("kw_best_chennai_dir", 1.0, "tl_seo_keywords_dir", "best builders in chennai", 1),

                ("kw_villa_chennai_pos", 4.0, "tl_seo_keywords", "villa construction chennai", 1),
                ("kw_villa_chennai_vol", 1600.0, "tl_seo_keywords_vol", "villa construction chennai", 1),
                ("kw_villa_chennai_dir", -1.0, "tl_seo_keywords_dir", "villa construction chennai", 1),

                ("kw_apt_chennai_pos", 5.0, "tl_seo_keywords", "apartment builders chennai", 1),
                ("kw_apt_chennai_vol", 1000.0, "tl_seo_keywords_vol", "apartment builders chennai", 1),
                ("kw_apt_chennai_dir", 0.0, "tl_seo_keywords_dir", "apartment builders chennai", 1),

                ("Competitor A Traffic", 18400.0, "tl_competitors", "Competitor A", 1),
                ("Competitor B Traffic", 15300.0, "tl_competitors", "Competitor B", 1),
                ("Competitor C Traffic", 9800.0, "tl_competitors", "Competitor C", 1),

                ("gap_luxury_chennai_our", 3.0, "tl_competitor_gaps_our", "luxury flats in chennai", 1),
                ("gap_luxury_chennai_their", 1.0, "tl_competitor_gaps_their", "luxury flats in chennai", 1),
                ("gap_luxury_chennai_priority", 1.0, "tl_competitor_gaps_priority", "luxury flats in chennai", 1),

                ("gap_builders_coimbatore_our", 2.0, "tl_competitor_gaps_our", "builders in coimbatore", 1),
                ("gap_builders_coimbatore_their", 5.0, "tl_competitor_gaps_their", "builders in coimbatore", 1),
                ("gap_builders_coimbatore_priority", 2.0, "tl_competitor_gaps_priority", "builders in coimbatore", 1),

                ("Instagram Followers", 28000.0, "tl_social_media", "Instagram Followers", 1),
                ("Instagram Growth", 12.0, "tl_social_media", "Instagram Growth", 1),
                ("Instagram Engagement", 6.8, "tl_social_media", "Instagram Engagement", 1),

                ("Facebook Followers", 18000.0, "tl_social_media", "Facebook Followers", 1),
                ("Facebook Growth", 8.0, "tl_social_media", "Facebook Growth", 1),
                ("Facebook Engagement", 5.4, "tl_social_media", "Facebook Engagement", 1),

                ("LinkedIn Followers", 12000.0, "tl_social_media", "LinkedIn Followers", 1),
                ("LinkedIn Growth", 15.0, "tl_social_media", "LinkedIn Growth", 1),
                ("LinkedIn Engagement", 4.8, "tl_social_media", "LinkedIn Engagement", 1),

                ("YouTube Followers", 5200.0, "tl_social_media", "YouTube Followers", 1),
                ("YouTube Growth", 10.0, "tl_social_media", "YouTube Growth", 1),
                ("YouTube Engagement", 7.2, "tl_social_media", "YouTube Engagement", 1),

                ("Marketing Budget Limit", 1500000.0, "tl_budget_summary", "Total Budget Limit", 1),

                # --- Executive Dashboard Metrics ---
                ("website", 540.0, "lead_sources", "Website", 1),
                ("google_ads", 320.0, "lead_sources", "Google Ads", 1),
                ("instagram", 180.0, "lead_sources", "Instagram", 1),
                ("facebook", 120.0, "lead_sources", "Facebook", 1),
                ("referrals", 90.0, "lead_sources", "Referrals", 1),

                ("organic_traffic", 22500.0, "seo_overview", "Organic Traffic", 1),
                ("ranked_keywords", 850.0, "seo_overview", "Keywords Ranked", 1),
                ("top_10_keywords", 145.0, "seo_overview", "Top 10 Keywords", 1),
                ("backlinks", 1250.0, "seo_overview", "Backlinks", 1),

                ("clicks", 12850.0, "google_ads_stats", "Clicks", 1),
                ("impressions", 2150000.0, "google_ads_stats", "Impressions", 1),
                ("ctr", 4.85, "google_ads_stats", "CTR Rate", 1),
                ("conversions", 320.0, "google_ads_stats", "Conversions", 1),
                ("cost", 180000.0, "google_ads_stats", "Total Cost", 1),

                ("meta_reach", 320000.0, "meta_ads_stats", "Reach", 1),
                ("meta_impressions", 1250000.0, "meta_ads_stats", "Impressions", 1),
                ("meta_clicks", 18620.0, "meta_ads_stats", "Clicks", 1),
                ("meta_leads", 220.0, "meta_ads_stats", "Leads", 1),
                ("meta_cost", 58000.0, "meta_ads_stats", "Total Cost", 1),
                ("meta_cpl", 264.0, "meta_ads_stats", "Cost Per Lead", 1),

                ("instagram_followers", 28000.0, "social_followers", "Instagram", 1),
                ("facebook_followers", 18000.0, "social_followers", "Facebook", 1),
                ("linkedin_followers", 12000.0, "social_followers", "LinkedIn", 1),
                ("youtube_subscribers", 5200.0, "social_followers", "YouTube", 1),

                ("visitors", 12500.0, "website_stats", "Total Visitors", 1),
                ("views", 28450.0, "website_stats", "Page Views", 1),
                ("bounce_rate", 34.5, "website_stats", "Bounce Rate", 1),
                ("avg_session", 260.0, "website_stats", "Avg. Session", 1),

                ("perf_leads", 1250.0, "perf_stats", "Total Leads", 1),
                ("perf_conversions", 320.0, "perf_stats", "Conversions", 1),
                ("perf_rate", 25.6, "perf_stats", "Conversion Rate", 1),
                ("perf_cpl", 384.0, "perf_stats", "Cost Per Lead", 1),

                # --- Google Business Profile metrics ---
                ("gbp_views", 8520.0, "gbp_stats", "Views", 1),
                ("gbp_searches", 5450.0, "gbp_stats", "Searches", 1),
                ("gbp_calls", 320.0, "gbp_stats", "Calls", 1),
                ("gbp_directions", 210.0, "gbp_stats", "Directions", 1),
                ("gbp_clicks", 450.0, "gbp_stats", "Website Clicks", 1),

                # --- Google Business Profile Actions ---
                ("gbp_act_views", 48.0, "gbp_actions", "Views", 1),
                ("gbp_act_calls", 24.0, "gbp_actions", "Calls", 1),
                ("gbp_act_directions", 18.0, "gbp_actions", "Directions", 1),
                ("gbp_act_website", 10.0, "gbp_actions", "Website", 1)
            ]
            for m in metrics:
                cursor.execute("""
                    INSERT INTO marketing_metrics (metric_key, metric_value, category, label, organization_id)
                    VALUES (%s, %s, %s, %s, %s)
                """, m)
                
            print("Seeding sales leads (this may take a few seconds)...")
            sales_leads = []
            sources = ["Google Ads", "Website", "Meta Ads", "Instagram", "Referrals", "Others", "SEO Organic", "Offline Hub", "LinkedIn Ads"]
            source_limits = [1600, 620, 1140, 150, 75, 355, 860, 350, 240]
            source_counts = [0] * len(sources)

            statuses = ["Qualified", "Disqualified", "Nurturing", "New"]
            status_limits = [1200, 2000, 1090, 1100]
            status_counts = [0] * len(statuses)

            for i in range(5390):
                src_idx = 0
                for s in range(len(sources)):
                    if source_counts[s] < source_limits[s]:
                        src_idx = s
                        break
                source_counts[src_idx] += 1
                source = sources[src_idx]

                stat_idx = 0
                for st in range(len(statuses)):
                    if status_counts[st] < status_limits[st]:
                        stat_idx = st
                        break
                status_counts[stat_idx] += 1
                qualified_status = statuses[stat_idx]

                lead_score = 3
                if qualified_status == "Qualified":
                    lead_score = 5
                elif qualified_status == "Disqualified":
                    lead_score = 1

                name = f"Lead Customer {i + 1}"
                budget = "₹75 Lakhs" if (i % 2 == 0) else "₹1.2 Cr"
                project_type = "Villa" if (i % 3 == 0) else "Apartment"
                location = "Chennai" if (i % 2 == 0) else "Coimbatore"
                date = f"2025-05-{(i % 31) + 1:02d}"

                sales_leads.append((name, source, project_type, location, budget, "Warm", date, 1, qualified_status, lead_score))

            cursor.executemany("""
                INSERT INTO sales_leads (name, source, project_type, location, budget, status, added_on, organization_id, qualified_status, lead_score)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, sales_leads)
            
            print("Seeding dashboard shell configs...")
            configs = [
                ("header_date", "01 May 2025 - 31 May 2025", "digital-marketing-tl", 1),
                ("sidebar_menus", "Executive Summary|Lead Generation Center|Campaign Management|Ad Performance|SEO Performance|Social Media Overview|Content Calendar|Team Performance|Marketing Budget|Lead Quality Analysis|Competitor Monitoring|AI Marketing Assistant|Settings", "digital-marketing-tl", 1),
                ("ai_suggestions", "Predict working capital cash flows.|Audit recent campaigns ROI.|Generate Meta Ads adcopy.", "digital-marketing-tl", 1),
                ("baselines_leads", "5390", "digital-marketing-tl", 1),
                ("baselines_qualified", "1200", "digital-marketing-tl", 1),
                ("baselines_spend", "1230000", "digital-marketing-tl", 1),
                ("baselines_cpl", "228", "digital-marketing-tl", 1),
                ("baselines_roi", "3.8", "digital-marketing-tl", 1),
                ("baselines_compare_date", "vs Apr 2025", "digital-marketing-tl", 1),
                ("ai_insight_recommendation", "Campaign conversion ROI increased. Shift ₹50k from Brand Awareness to Marina Bay Luxury Suites Campaign immediately.", "digital-marketing-tl", 1),
                ("ai_insight_opportunity", "Marina Bay Luxury Suites Campaign is performing 35% better than other campaigns. Consider switching more budget.", "digital-marketing-tl", 1),
                ("ai_insight_critical_alert", "Increase budget for Google Ads - high ROI detected and search volumes are surging.", "digital-marketing-tl", 1),
                ("ai_insight_weekly_diagnosis", "Lead quality improved by 22% compared to last month. SEO push on Coimbatore Hub and SEO Organic Optimization contributed 860 Leads.", "digital-marketing-tl", 1),
                ("calendar_header", "Content Calendar (May 2025)", "digital-marketing-tl", 1),
                ("calendar_date_label", "Target Date (Day of May)", "digital-marketing-tl", 1),
                ("calendar_empty_cells", "3", "digital-marketing-tl", 1),
                ("calendar_total_days", "31", "digital-marketing-tl", 1),
                ("seo_traffic_sub", "↑ 18.4% vs last month", "digital-marketing-tl", 1),
                ("seo_keywords_sub", "↑ 15.2% active keywords", "digital-marketing-tl", 1),
                ("seo_top10_sub", "↑ 10.5% index movement", "digital-marketing-tl", 1),
                ("seo_authority_sub", "Stable domain weight", "digital-marketing-tl", 1),
                ("alert_threshold", "450", "digital-marketing-tl", 1),
                ("notification_emails", "true", "digital-marketing-tl", 1),
                ("weekly_reports", "true", "digital-marketing-tl", 1),
                ("lead_scoring_min", "65", "digital-marketing-tl", 1),
                ("competitor_mapping", "luxury flats in chennai:Competitor A|builders in coimbatore:Competitor B", "digital-marketing-tl", 1)
            ]
            for cf in configs:
                cursor.execute("""
                    INSERT INTO dashboard_shell_configs (config_key, config_value, dashboard_type, organization_id)
                    VALUES (%s, %s, %s, %s)
                """, cf)
            
            # --- Seeding Sales Executive Data ---
            print("Seeding sales proposals...")
            proposals = [
                ("Lead Customer 1", "PROP-2025-001", "₹75 Lakhs", "20 May 2025", "Approved", 1),
                ("Lead Customer 3", "PROP-2025-002", "₹1.2 Cr", "22 May 2025", "Negotiation", 1),
                ("Lead Customer 5", "PROP-2025-003", "₹75 Lakhs", "25 May 2025", "Under Review", 1),
                ("Lead Customer 7", "PROP-2025-004", "₹1.2 Cr", "26 May 2025", "Approved", 1),
                ("Lead Customer 9", "PROP-2025-005", "₹75 Lakhs", "27 May 2025", "Rejected", 1)
            ]
            for p in proposals:
                cursor.execute("""
                    INSERT INTO sales_proposals (lead_name, proposal_no, amount, sent_on, status, organization_id)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, p)

            print("Seeding sales activities...")
            activities = [
                ("Lead Customer 1", "Site Visit scheduled", "Visit", "10:30 AM", "2025-05-26", "Completed", 1),
                ("Lead Customer 3", "Follow-up Call regarding budget details", "Call", "11:00 AM", "2025-05-27", "Completed", 1),
                ("Lead Customer 5", "Discuss structural changes with architect", "Meeting", "02:00 PM", "2025-05-28", "Pending", 1),
                ("Lead Customer 8", "Send revised proposal brochure", "Email", "04:30 PM", "2025-05-28", "Pending", 1),
                ("Lead Customer 10", "Site Visit for layout review", "Visit", "10:00 AM", "2025-05-29", "Pending", 1)
            ]
            for a in activities:
                cursor.execute("""
                    INSERT INTO sales_activities (lead_name, activity, type, time, date, status, organization_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, a)

            print("Seeding revenue entries...")
            revenue_entries = [
                ("Week 1", 2500000, 1800000, 1),
                ("Week 2", 2500000, 2200000, 1),
                ("Week 3", 2500000, 2800000, 1),
                ("Week 4", 2500000, 3200000, 1)
            ]
            for r in revenue_entries:
                cursor.execute("""
                    INSERT INTO revenue_entries (week, target, achieved, organization_id)
                    VALUES (%s, %s, %s, %s)
                """, r)

            print("Seeding sales chats and messages...")
            # Chat 1
            cursor.execute("""
                INSERT INTO sales_chats (client_name, latest_message, time, unread, organization_id)
                VALUES ('Lead Customer 3', 'Thank you. Let me check and confirm.', '11:35 AM', 0, 1)
            """)
            chat1_id = cursor.lastrowid
            
            chat1_msgs = [
                (chat1_id, "client", "Hello, I wanted to ask about the payment schedule.", "11:30 AM"),
                (chat1_id, "executive", "Hi! It is 10% booking, 40% on foundation, and rest in installments.", "11:32 AM"),
                (chat1_id, "client", "Thank you. Let me check and confirm.", "11:35 AM")
            ]
            for msg in chat1_msgs:
                cursor.execute("""
                    INSERT INTO sales_messages (chat_id, sender, text, time)
                    VALUES (%s, %s, %s, %s)
                """, msg)

            # Chat 2
            cursor.execute("""
                INSERT INTO sales_chats (client_name, latest_message, time, unread, organization_id)
                VALUES ('Lead Customer 5', 'Can we schedule a site visit on Friday?', '09:15 AM', 1, 1)
            """)
            chat2_id = cursor.lastrowid
            
            cursor.execute("""
                INSERT INTO sales_messages (chat_id, sender, text, time)
                VALUES (%s, 'client', 'Can we schedule a site visit on Friday?', '09:15 AM')
            """, (chat2_id,))
            
            conn.commit()
            print("Successfully seeded all Digital Marketing TL, Executive, and Sales Executive database records for Org 1!")
    except Exception as e:
        print("DATABASE SEED ERROR:", e)

if __name__ == "__main__":
    seed_data()
