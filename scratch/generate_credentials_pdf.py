import json
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header line
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, letter[1] - 30, letter[0] - 36, letter[1] - 30)
        self.drawString(36, letter[1] - 25, "BuildCon ERP — Official Database & Organization Credentials")
        self.drawRightString(letter[0] - 36, letter[1] - 25, "CONFIDENTIAL / INTERNAL USE ONLY")
        
        # Footer line
        self.line(36, 35, letter[0] - 36, 35)
        self.drawString(36, 22, "BuildCon Construction ERP Suite © 2026")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 36, 22, page_text)
        self.restoreState()

def build_pdf():
    pdf_filename = "c:/Users/DELL/Documents/erp_construction_project/BuildCon_ERP_Database_Users_and_Organization_Credentials.pdf"
    
    with open("scratch/orgs_data.json", "r") as f:
        orgs = json.load(f)
        
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=45,
        bottomMargin=45
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#475569"),
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor("#0284C7"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#1E293B")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0F172A")
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0F172A")
    )

    table_cell_code = ParagraphStyle(
        'TableCellCode',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0369A1")
    )
    
    story = []
    
    # Title Section
    story.append(Paragraph("BuildCon ERP Suite", title_style))
    story.append(Paragraph("Master Database Users, Role Credentials & Multi-Tier Organization Directory", ParagraphStyle('Sub', parent=title_style, fontSize=12, leading=15, textColor=colors.HexColor("#1E40AF"))))
    story.append(Paragraph("Generated on 19-Nov-2026 | Environment: Local & Cloud Hybrid (Port 3000 / 8081 / 8001) | Security Level: Confidential", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=10))
    
    # Overview Note
    overview_text = (
        "<b>Executive Summary:</b> This document contains the complete verified authentication matrix for BuildCon ERP. "
        "It includes all <b>Platform Roles</b> (Super Admin, Executive Board, Site Operations, Commercial & QA/QC) "
        "and all <b>42 Provisioned Organizations</b> across Enterprise, Premium, and Growth subscription tiers. "
        "All credentials listed below are actively synced with the TiDB Cloud / MySQL backend database."
    )
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 10))
    
    # Section 1: Access Portals Directory
    story.append(Paragraph("1. Web Access Portals Directory", h1_style))
    portal_data = [
        [Paragraph("Portal Name", table_header_style), Paragraph("Direct URL", table_header_style), Paragraph("Allowed Role Groups", table_header_style), Paragraph("Default Redirect", table_header_style)],
        [Paragraph("Teams & Staff Portal", table_cell_bold), Paragraph("http://localhost:3000/login/manager", table_cell_code), Paragraph("PM, Site Management, CM, Senior Eng, QA/QC, Stores, HR, Finance, Subcontractor", table_cell_style), Paragraph("Specific Role Workspaces (/drawings, /project-manager, /site-management)", table_cell_style)],
        [Paragraph("Board of Directors Portal", table_cell_bold), Paragraph("http://localhost:3000/login/director", table_cell_code), Paragraph("Managing Director (MD), Project Director, Business Director, Finance Director", table_cell_style), Paragraph("/md, /project-director, /business-director", table_cell_style)],
        [Paragraph("Chairman Executive Portal", table_cell_bold), Paragraph("http://localhost:3000/login/chairman", table_cell_code), Paragraph("Chairman & Executive Board Members", table_cell_style), Paragraph("/chairman", table_cell_style)],
        [Paragraph("Super Admin Portal", table_cell_bold), Paragraph("http://localhost:3000/login/super-admin", table_cell_code), Paragraph("Platform Super Administrator / DevOps", table_cell_style), Paragraph("/super-admin", table_cell_style)],
        [Paragraph("Drawing & BIM Hub", table_cell_bold), Paragraph("http://localhost:3000/drawings", table_cell_code), Paragraph("Project Manager, Site Engineer, CM, Director (Requires login first)", table_cell_style), Paragraph("/drawings (BIM takeoff & Clash Detection)", table_cell_style)],
    ]
    t_portals = Table(portal_data, colWidths=[105, 140, 150, 145])
    t_portals.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#F8FAFC"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_portals)
    story.append(Spacer(1, 14))

    # Section 2: System Users & Role Credentials
    story.append(Paragraph("2. System Users & Role Credentials (24 Active Roles)", h1_style))
    story.append(Paragraph("The table below lists all provisioned user accounts configured in Spring Security and mapped into the database with BCrypt hashes.", body_style))
    story.append(Spacer(1, 6))

    users_data = [
        [Paragraph("Role / Group", table_header_style), Paragraph("Name", table_header_style), Paragraph("Email Username", table_header_style), Paragraph("Password", table_header_style), Paragraph("Assigned Portal", table_header_style)],
        # Admin
        [Paragraph("Super Admin", table_cell_bold), Paragraph("Admin User", table_cell_style), Paragraph("admin@buildcon.com", table_cell_code), Paragraph("admin123", table_cell_bold), Paragraph("/login/super-admin", table_cell_style)],
        # Directors
        [Paragraph("Chairman", table_cell_bold), Paragraph("Dr. S. K. Buildcon", table_cell_style), Paragraph("chairman@buildcon.com", table_cell_code), Paragraph("chairman123", table_cell_bold), Paragraph("/login/chairman", table_cell_style)],
        [Paragraph("Managing Director (MD)", table_cell_bold), Paragraph("MD Buildcon", table_cell_style), Paragraph("md@buildcon.com", table_cell_code), Paragraph("md123", table_cell_bold), Paragraph("/login/director", table_cell_style)],
        [Paragraph("Project Director", table_cell_bold), Paragraph("Rajesh Verma", table_cell_style), Paragraph("pd@buildcon.com", table_cell_code), Paragraph("pd123", table_cell_bold), Paragraph("/login/director", table_cell_style)],
        [Paragraph("Business Dev Director", table_cell_bold), Paragraph("Vikram Mehta", table_cell_style), Paragraph("bd@buildcon.com", table_cell_code), Paragraph("bd123", table_cell_bold), Paragraph("/login/director", table_cell_style)],
        [Paragraph("Finance Director", table_cell_bold), Paragraph("Suresh Menon", table_cell_style), Paragraph("fd@buildcon.com", table_cell_code), Paragraph("fd123", table_cell_bold), Paragraph("/login/director", table_cell_style)],
        # Site & PM Operations
        [Paragraph("Project Manager", table_cell_bold), Paragraph("PM Office", table_cell_style), Paragraph("pm@buildcon.com", table_cell_code), Paragraph("pm123", table_cell_bold), Paragraph("/login/manager (PM)", table_cell_style)],
        [Paragraph("Site Management", table_cell_bold), Paragraph("Site In-Charge", table_cell_style), Paragraph("site@buildcon.com", table_cell_code), Paragraph("site123", table_cell_bold), Paragraph("/login/manager (Site)", table_cell_style)],
        [Paragraph("Construction Manager", table_cell_bold), Paragraph("Karthik R.", table_cell_style), Paragraph("cm@buildcon.com", table_cell_code), Paragraph("cm123", table_cell_bold), Paragraph("/login/manager (CM)", table_cell_style)],
        [Paragraph("Senior Site Engineer", table_cell_bold), Paragraph("Rohan Sharma", table_cell_style), Paragraph("senior-eng@buildcon.com", table_cell_code), Paragraph("eng123", table_cell_bold), Paragraph("/login/manager (Eng)", table_cell_style)],
        [Paragraph("Workforce & Labour", table_cell_bold), Paragraph("Workforce Team", table_cell_style), Paragraph("workforce@buildcon.com", table_cell_code), Paragraph("workforce123", table_cell_bold), Paragraph("/login/manager (Labour)", table_cell_style)],
        [Paragraph("Subcontractor", table_cell_bold), Paragraph("Apex Masonry Sub", table_cell_style), Paragraph("sub@buildcon.com", table_cell_code), Paragraph("sub123", table_cell_bold), Paragraph("/login/manager (Sub)", table_cell_style)],
        # Quality & Inventory
        [Paragraph("QA/QC Engineer", table_cell_bold), Paragraph("Quality Assurance", table_cell_style), Paragraph("qaqc@buildcon.com", table_cell_code), Paragraph("qaqc123", table_cell_bold), Paragraph("/login/manager (QA/QC)", table_cell_style)],
        [Paragraph("Store Manager", table_cell_bold), Paragraph("Central Inventory", table_cell_style), Paragraph("stores@buildcon.com", table_cell_code), Paragraph("store123", table_cell_bold), Paragraph("/login/manager (Store)", table_cell_style)],
        [Paragraph("Quantity Surveyor", table_cell_bold), Paragraph("Costing Cell", table_cell_style), Paragraph("qs1@buildcon.com", table_cell_code), Paragraph("password123", table_cell_bold), Paragraph("/login/manager (QS)", table_cell_style)],
        [Paragraph("Procurement Manager", table_cell_bold), Paragraph("Procurement Desk", table_cell_style), Paragraph("procurement@buildcon.com", table_cell_code), Paragraph("password123", table_cell_bold), Paragraph("/login/manager (Proc)", table_cell_style)],
        # Corporate Support
        [Paragraph("Finance & Accounts", table_cell_bold), Paragraph("Audit & Accounts", table_cell_style), Paragraph("finance@buildcon.com", table_cell_code), Paragraph("password123", table_cell_bold), Paragraph("/login/manager (Finance)", table_cell_style)],
        [Paragraph("HR Manager", table_cell_bold), Paragraph("Human Resources", table_cell_style), Paragraph("hrmanager@buildcon.com", table_cell_code), Paragraph("password123", table_cell_bold), Paragraph("/login/manager (HR)", table_cell_style)],
        [Paragraph("Marketing Manager", table_cell_bold), Paragraph("Ananya Sharma", table_cell_style), Paragraph("ananya@buildcon.com", table_cell_code), Paragraph("password123", table_cell_bold), Paragraph("/login/manager (Mktg)", table_cell_style)],
        [Paragraph("Sales Executive", table_cell_bold), Paragraph("Sales Desk", table_cell_style), Paragraph("sales@buildcon.com", table_cell_code), Paragraph("password123", table_cell_bold), Paragraph("/login/manager (Sales)", table_cell_style)],
        [Paragraph("Digital Marketing TL", table_cell_bold), Paragraph("Campaign Lead", table_cell_style), Paragraph("marketingtl@buildcon.com", table_cell_code), Paragraph("password123", table_cell_bold), Paragraph("/login/manager (DigiTL)", table_cell_style)],
        # Portals
        [Paragraph("Vendor / Supplier", table_cell_bold), Paragraph("Tata Tiscon Direct", table_cell_style), Paragraph("vendor@tatatiscon.com", table_cell_code), Paragraph("vendor123", table_cell_bold), Paragraph("/vendor-portal", table_cell_style)],
        [Paragraph("Customer / Client", table_cell_bold), Paragraph("Dr. Rajesh K.", table_cell_style), Paragraph("rajesh.k@customer.com", table_cell_code), Paragraph("client123", table_cell_bold), Paragraph("/client-portal", table_cell_style)],
    ]
    t_users = Table(users_data, colWidths=[110, 95, 140, 85, 110])
    t_users.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F766E")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#F8FAFC"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_users)
    
    story.append(PageBreak())

    # Section 3: Multi-Tier Organization Database Credentials
    story.append(Paragraph("3. Multi-Tier Organization Database Credentials (All 42 Orgs)", h1_style))
    story.append(Paragraph(
        "Each organization has dedicated organization-level credentials (`Org Username` and `Org Password`) "
        "used for multi-tenant tenant isolation, trial license renewal, and company onboarding. "
        "The directory is segregated into <b>Enterprise</b>, <b>Premium</b>, and <b>Growth</b> tiers.",
        body_style
    ))
    story.append(Spacer(1, 8))

    org_table_data = [
        [
            Paragraph("ID", table_header_style),
            Paragraph("Organization Name", table_header_style),
            Paragraph("Tier", table_header_style),
            Paragraph("Org Username", table_header_style),
            Paragraph("Org Password", table_header_style),
            Paragraph("Contact Email", table_header_style)
        ]
    ]

    for o in orgs:
        tier = o.get("subscriptionTier", "Growth")
        tier_color = "#047857" if tier == "Enterprise" else ("#0284C7" if tier == "Premium" else "#D97706")
        
        tier_p = Paragraph(f"<font color='{tier_color}'><b>{tier}</b></font>", table_cell_style)
        
        org_table_data.append([
            Paragraph(str(o.get("id")), table_cell_style),
            Paragraph(o.get("name", ""), table_cell_bold),
            tier_p,
            Paragraph(o.get("orgUsername", ""), table_cell_code),
            Paragraph(o.get("orgPassword", ""), table_cell_bold),
            Paragraph(o.get("email", ""), table_cell_style)
        ])

    t_orgs = Table(org_table_data, colWidths=[25, 140, 65, 130, 85, 95])
    t_orgs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#F8FAFC"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(t_orgs)
    
    story.append(Spacer(1, 14))
    
    # Section 4: Database & Infrastructure Connection Reference
    story.append(Paragraph("4. Database & Infrastructure Configuration Reference", h1_style))
    db_info_data = [
        [Paragraph("Parameter", table_header_style), Paragraph("Active Specification", table_header_style)],
        [Paragraph("Database Engine", table_cell_bold), Paragraph("Cloud TiDB Serverless (MySQL 8.0 Wire Compatible)", table_cell_style)],
        [Paragraph("Host / Endpoint", table_cell_bold), Paragraph("gateway01.ap-southeast-1.prod.aws.tidbcloud.com", table_cell_code)],
        [Paragraph("Database Port", table_cell_bold), Paragraph("4000 (TLS/SSL Enforced)", table_cell_style)],
        [Paragraph("Target Database Schema", table_cell_bold), Paragraph("buildcon_erp", table_cell_style)],
        [Paragraph("Backend Framework", table_cell_bold), Paragraph("Java Spring Boot 3.2.3 with Hibernate ORM 6.4.4", table_cell_style)],
        [Paragraph("AI Microservice Engine", table_cell_bold), Paragraph("Python FastAPI running on http://localhost:8001 (OpenCV, Torch)", table_cell_style)],
        [Paragraph("Frontend Client App", table_cell_bold), Paragraph("Next.js 14 App Router running on http://localhost:3000", table_cell_style)],
    ]
    t_db = Table(db_info_data, colWidths=[150, 390])
    t_db.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#334155")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#F8FAFC"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_db)

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF Generated successfully at:", pdf_filename)

if __name__ == "__main__":
    build_pdf()
