import os
import json
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print 'Page X of Y' 
    running footer and running header on all pages except the cover.
    """
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, total_pages):
        if self._pageNumber == 1:
            # Skip header/footer on cover page
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#0284C7")) # Cyan/sky blue

        # Running Top Header
        self.drawString(40, 755, "BUILDCON ERP • 1,000 ARCHITECTURAL 3D MODEL & BLUEPRINT GENERATION PROMPTS")
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawRightString(572, 755, "BIM & CAD Engineering Prompt Compendium")

        # Top Header Accent Line
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(40, 748, 572, 748)

        # Running Bottom Footer Line
        self.line(40, 45, 572, 45)

        # Bottom Footer Content
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(40, 32, "Confidential • BuildCon AI Architectural Lab • 14-Parameter Engineering Standard")
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#0F172A"))
        self.drawRightString(572, 32, page_str)
        self.restoreState()


def create_1000_prompts_pdf(json_path, output_pdf_paths):
    with open(json_path, "r", encoding="utf-8") as f:
        all_prompts = json.load(f)

    # Categories to include for the 1,000 prompt compendium:
    # 10 core categories x 100 prompts = 1,000 prompts
    target_category_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 15]
    
    category_meta = {
        1: ("01. RESIDENTIAL BUILDINGS", "High-Rise Towers, Stepped Terraces, Luxury Enclaves & Waterfront Penthouses", "#0284C7"),
        2: ("02. HOTELS & RESORTS", "Luxury Beach Resorts, Skyline Hotels, Infinity Pool Towers & Eco Retreats", "#0D9488"),
        3: ("03. SCHOOLS & COLLEGES", "STEM Academies, University Campuses, Circular Library Hubs & Polytechnics", "#2563EB"),
        4: ("04. HOSPITALS & CLINICS", "Multi-Specialty Healthcare Centers, Trauma Hubs, Helipad Hospitals & Clinics", "#DC2626"),
        5: ("05. OFFICE & CORPORATE BUILDINGS", "Corporate HQs, Diagrid Towers, Glazed Tech Pavilions & Dual-Wing Atriums", "#4F46E5"),
        6: ("06. VILLAS & LUXURY HOMES", "Cantilevered Modern Villas, Brutalist Estates, Zen Compounds & Hillside Mansions", "#D97706"),
        7: ("07. APARTMENTS & HOUSING COMPLEXES", "High-Density Residential Townships, Duplex Communities & Podiums", "#7C3AED"),
        8: ("08. HOSTELS & STUDENT HOUSING", "Courtyard Student Housing, Rounded Hostels, Sports Court Pods & Co-Living Hubs", "#EA580C"),
        9: ("09. SHOPPING MALLS & COMMERCIAL", "Grand Atrium Gallerias, Entertainment Arcades, Podium Plazas & Lifestyle Malls", "#059669"),
        15: ("10. FUTURISTIC ARCHITECTURAL CONCEPTS", "Toroid Donut Complexes, Spherical Geodesic Orbs, Airplane Wing Roofs & Diagrids", "#9333EA")
    }

    # Filter and re-index exactly 1,000 prompts
    selected_prompts = []
    cat_counts = {cid: 0 for cid in target_category_ids}
    for p in all_prompts:
        cid = p.get("categoryId")
        if cid in target_category_ids and cat_counts[cid] < 100:
            selected_prompts.append(p)
            cat_counts[cid] += 1

    print(f"Total prompts selected for PDF: {len(selected_prompts)}")

    # Setup styles
    styles = getSampleStyleSheet()

    # Custom paragraph styles
    cover_title_style = ParagraphStyle(
        "CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=30,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=10
    )

    cover_subtitle_style = ParagraphStyle(
        "CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0284C7"),
        spaceAfter=20
    )

    cover_body_style = ParagraphStyle(
        "CoverBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#334155")
    )

    formula_title_style = ParagraphStyle(
        "FormulaTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0F172A")
    )

    formula_code_style = ParagraphStyle(
        "FormulaCode",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0369A1")
    )

    toc_cat_title = ParagraphStyle(
        "TOCCatTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#0F172A")
    )

    toc_cat_desc = ParagraphStyle(
        "TOCCatDesc",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#64748B")
    )

    cat_header_title = ParagraphStyle(
        "CatHeaderTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=colors.white
    )

    cat_header_desc = ParagraphStyle(
        "CatHeaderDesc",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#E2E8F0")
    )

    item_title_style = ParagraphStyle(
        "ItemTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    )

    item_badge_style = ParagraphStyle(
        "ItemBadge",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#0284C7")
    )

    item_prompt_style = ParagraphStyle(
        "ItemPrompt",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor("#1E293B")
    )

    # Document story flow
    story = []

    # -------------------------------------------------------------
    # 1. EXECUTIVE COVER PAGE (PAGE 1)
    # -------------------------------------------------------------
    story.append(Spacer(1, 30))
    # Top decorative bar
    story.append(HRFlowable(width="100%", thickness=6, color=colors.HexColor("#0284C7"), spaceAfter=28, spaceBefore=0))

    story.append(Paragraph("BUILDCON ARCHITECTURAL AI LAB &bull; BIM SPECIFICATION 2026", ParagraphStyle("BrandPre", fontName="Helvetica-Bold", fontSize=10, textColor=colors.HexColor("#0284C7"), leading=14, spaceAfter=10)))
    story.append(Paragraph("1,000 ARCHITECTURAL 3D MODEL &amp; BLUEPRINT GENERATION PROMPTS", cover_title_style))
    story.append(Paragraph("COMPREHENSIVE ENGINEERING COMPENDIUM ACROSS 10 CORE TYPOLOGIES", cover_subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=22, spaceBefore=0))

    cover_desc = (
        "This official technical compendium provides <b>1,000 high-fidelity 3D model generation prompts</b> "
        "engineered specifically for generative CAD/BIM architectural modeling, automated IS 1200 BOQ estimation, "
        "and technical blueprint generation. Each prompt is rigorously formulated according to BuildCon's "
        "<b>14-parameter structural architectural specification</b> to ensure deterministic geometric modeling, realistic "
        "material mapping, natural lighting simulation, and structural compliance with IS 456, IS 1893, and IS 13920 standards."
    )
    story.append(Paragraph(cover_desc, cover_body_style))
    story.append(Spacer(1, 26))

    # Document Specs Table
    specs_data = [
        [
            Paragraph("<b>Total Prompts:</b> 1,000 Engineering Prompts", cover_body_style),
            Paragraph("<b>Core Typologies:</b> 10 Architectural Sectors (100 Prompts/Sector)", cover_body_style)
        ],
        [
            Paragraph("<b>Target Resolution:</b> 3D CAD/BIM &amp; Multi-Story Extrusion", cover_body_style),
            Paragraph("<b>Structural Standard:</b> IS 456, IS 1893 &amp; IS 13920 SMRF Compliance", cover_body_style)
        ],
        [
            Paragraph("<b>Publisher:</b> BuildCon ERP Engineering Platform", cover_body_style),
            Paragraph("<b>Web Portal:</b> http://localhost:3000/drawings (Studio)", cover_body_style)
        ]
    ]
    specs_table = Table(specs_data, colWidths=[266, 266])
    specs_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#F1F5F9")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(specs_table)
    story.append(Spacer(1, 30))

    # Executive Note Box
    exec_note = (
        "<b>Architectural Modeling Directive:</b><br/>"
        "All prompts within this document are directly compatible with the BuildCon 3D Blueprint Generator. "
        "Prompts can be copied directly into the prompt bar at <b>localhost:3000/drawings</b> or accessed through "
        "the embedded <b>1,500 Prompt Library</b> dialog inside the studio interface for instant 1-click model generation."
    )
    note_table = Table([[Paragraph(exec_note, ParagraphStyle("NoteText", parent=cover_body_style, fontSize=8.5, leading=12))]], colWidths=[532])
    note_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#BFDBFE")),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(note_table)

    story.append(PageBreak())

    # -------------------------------------------------------------
    # 2. TABLE OF CONTENTS & 14-PARAMETER SPECIFICATION (PAGE 2)
    # -------------------------------------------------------------
    story.append(Spacer(1, 10))
    story.append(Paragraph("TABLE OF CONTENTS — 10 ARCHITECTURAL SECTORS", formula_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0284C7"), spaceAfter=10, spaceBefore=4))

    toc_rows = []
    for idx, cid in enumerate(target_category_ids, 1):
        cname, cdesc, ccolor = category_meta[cid]
        start_num = (idx - 1) * 100 + 1
        end_num = idx * 100
        left_cell = Paragraph(f"<b>{cname}</b><br/><font color='#64748B'>{cdesc}</font>", toc_cat_desc)
        right_cell = Paragraph(f"<font color='{ccolor}'><b>Prompts #{start_num:04d} – #{end_num:04d}</b></font><br/><font color='#94A3B8'>100 Prompts</font>", ParagraphStyle("TRight", parent=toc_cat_desc, alignment=2))
        toc_rows.append([left_cell, right_cell])

    toc_table = Table(toc_rows, colWidths=[370, 162])
    toc_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#F1F5F9")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 2),
        ('RIGHTPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(toc_table)
    story.append(Spacer(1, 14))

    # Formula Box on Page 2
    story.append(Paragraph("THE 14-PARAMETER STRUCTURAL PROMPT SPECIFICATION", formula_title_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=8, spaceBefore=4))

    formula_html = (
        "<b>Deterministic 14-Part Architectural Formula:</b><br/>"
        "<b>1. [Floors]:</b> Height &amp; extrusion level (e.g. 5 Floor, 8 Floor, 12 Floor)<br/>"
        "<b>2. [Style]:</b> Architectural taxonomy (e.g. Neo-Classical, Biophilic, Diagrid, High-Tech Modern)<br/>"
        "<b>3. [Typology]:</b> Functional facility classification (e.g. Luxury Apartment, Multi-Specialty Hospital)<br/>"
        "<b>4. [Façade]:</b> Outer envelope &amp; geometry (e.g. Curved envelope, Double-glazed curtain wall, V-shape)<br/>"
        "<b>5. [Windows]:</b> Glazing performance (e.g. Floor-to-ceiling acoustic Low-E glass, ribbon fenestrations)<br/>"
        "<b>6. [Balconies]:</b> Outdoor projections (e.g. Cantilevered floating balconies, wrap-around terraces)<br/>"
        "<b>7. [Roof]:</b> Upper superstructure (e.g. Monocrystalline solar PV farm array, helipad, rooftop lounge)<br/>"
        "<b>8. [Entrance]:</b> Pedestrian arrival (e.g. Double-height lobby, porte-cochère, floating canopy)<br/>"
        "<b>9. [Landscaping]:</b> Ground integration (e.g. Stepped zen courtyard plaza, bioswales, water fountains)<br/>"
        "<b>10. [Parking]:</b> Vehicular capacity (e.g. Subterranean multi-deck garage, automated stack parking)<br/>"
        "<b>11. [Sports/Recreation]:</b> Active amenities (e.g. Volleyball court, basketball court, infinity sky pool)<br/>"
        "<b>12. [Materials]:</b> Structural spec (e.g. M35 RCC concrete, Fe550D TMT rebar, AAC masonry blocks)<br/>"
        "<b>13. [Lighting]:</b> Illumination design (e.g. 3000K warm linear LED uplights, facade grazing lights)<br/>"
        "<b>14. [Visualization]:</b> Presentation output (detailed 3D model architectural visualization, blueprint standard)"
    )
    formula_table = Table([[Paragraph(formula_html, ParagraphStyle("FormBox", parent=formula_code_style, fontSize=7.2, leading=10.5))]], colWidths=[532])
    formula_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#BBF7D0")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(formula_table)

    story.append(PageBreak())

    # -------------------------------------------------------------
    # 2. SECTIONS & PROMPTS GENERATION (1 to 1000)
    # -------------------------------------------------------------
    global_prompt_counter = 0

    for section_idx, cid in enumerate(target_category_ids, 1):
        cname, cdesc, ccolor = category_meta[cid]
        cat_prompts = [p for p in selected_prompts if p.get("categoryId") == cid][:100]

        # Section Header Banner
        banner_content = [
            [
                Paragraph(f"<b>SECTION {section_idx:02d} — {cname}</b>", cat_header_title),
                Paragraph(f"<b>100 PROMPTS (#{global_prompt_counter+1:04d} – #{global_prompt_counter+len(cat_prompts):04d})</b>", ParagraphStyle("BRight", parent=cat_header_title, alignment=2, fontSize=9))
            ],
            [
                Paragraph(cdesc, cat_header_desc),
                Paragraph("Architectural &amp; BIM Standard: IS 1200 / IS 13920", ParagraphStyle("BRight2", parent=cat_header_desc, alignment=2, fontSize=7.5))
            ]
        ]
        banner_table = Table(banner_content, colWidths=[380, 152])
        banner_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(ccolor)),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(banner_table)
        story.append(Spacer(1, 8))

        # Render 100 Prompts for this category
        for local_idx, item in enumerate(cat_prompts, 1):
            global_prompt_counter += 1
            prompt_id_str = f"#{global_prompt_counter:04d}"
            title = item.get("title", f"{item.get('floors')} Floor Building")
            floors = item.get("floors", 5)
            style = item.get("style", "Modern")
            b_type = item.get("buildingType", "Commercial")
            prompt_text = item.get("prompt", "")

            # Single prompt item box
            header_line = (
                f"<b><font color='{ccolor}'>{prompt_id_str}</font> • {title}</b> "
                f"<font color='#64748B'>[{floors} Floors | Style: {style} | Type: {b_type}]</font>"
            )

            prompt_card_data = [
                [Paragraph(header_line, item_title_style)],
                [Paragraph(prompt_text, item_prompt_style)]
            ]

            card_table = Table(prompt_card_data, colWidths=[532])
            card_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F8FAFC")),
                ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#FFFFFF")),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
                ('LINEBELOW', (0,0), (-1,0), 0.5, colors.HexColor("#E2E8F0")),
                ('TOPPADDING', (0,0), (-1,-1), 3),
                ('BOTTOMPADDING', (0,0), (-1,-1), 3),
                ('LEFTPADDING', (0,0), (-1,-1), 6),
                ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ]))

            story.append(card_table)
            story.append(Spacer(1, 4))

        # Add a page break after each section (except the last)
        if section_idx < len(target_category_ids):
            story.append(PageBreak())

    print(f"Total prompt cards placed in document story: {global_prompt_counter}")

    # Build the document for primary output
    primary_pdf = output_pdf_paths[0]
    os.makedirs(os.path.dirname(primary_pdf), exist_ok=True)
    doc = SimpleDocTemplate(
        primary_pdf,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=54,
        bottomMargin=54
    )
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {primary_pdf}")
    file_size_mb = os.path.getsize(primary_pdf) / (1024 * 1024)
    print(f"File size: {file_size_mb:.2f} MB")

    # Copy to secondary output paths
    import shutil
    for secondary_pdf in output_pdf_paths[1:]:
        os.makedirs(os.path.dirname(secondary_pdf), exist_ok=True)
        shutil.copyfile(primary_pdf, secondary_pdf)
        print(f"Copied PDF to: {secondary_pdf}")

if __name__ == "__main__":
    json_input = "erp_construction_project/buildcon-erp/public/data/prompt_library_1500.json"
    if not os.path.exists(json_input):
        json_input = "buildcon-erp/public/data/prompt_library_1500.json"
    
    outputs = [
        "c:/Users/DELL/Documents/erp_construction_project/1000_Architectural_3D_Model_Generation_Prompts.pdf",
        "c:/Users/DELL/Documents/erp_construction_project/erp_construction_project/buildcon-erp/public/downloads/1000_Architectural_3D_Model_Generation_Prompts.pdf"
    ]
    create_1000_prompts_pdf(json_input, outputs)
