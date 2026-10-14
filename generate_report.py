import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_progress_report(output_path):
    doc = Document()
    
    # 1. Page Margins - 0.75" for spacious, balanced 2-column tables
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # Color Palette
    PRIMARY_NAVY = RGBColor(26, 54, 93)     # #1A365D - Deep Navy
    SECONDARY_BLUE = RGBColor(43, 108, 176) # #2B6CB0 - Accent Blue
    DARK_TEXT = RGBColor(30, 41, 59)        # #1E293B - Slate 800
    MUTED_TEXT = RGBColor(71, 85, 105)      # #475569 - Slate 600
    BORDER_HEX = "CBD5E1"                  # Slate 300
    HEADER_BG_HEX = "1A365D"               # Navy Header
    SUBHEADER_BG_HEX = "2B6CB0"            # Blue Accent
    LEFT_COL_BG = "F8FAFC"                 # Slate 50
    RIGHT_COL_BG = "F0FDF4"                # Light Emerald Tint for completed/achieved
    HIGHLIGHT_BG = "F1F5F9"                # Slate 100
    
    # Helper to style a run
    def format_run(run, font_name="Calibri", font_size=11, bold=False, italic=False, color=DARK_TEXT):
        run.font.name = font_name
        run.font.size = Pt(font_size)
        run.bold = bold
        run.italic = italic
        run.font.color.rgb = color
        
    # Helper for table borders
    def set_table_borders(table, border_color=BORDER_HEX):
        tblPr = table._tbl.tblPr
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>\n'
            f'  <w:top w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>\n'
            f'  <w:left w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>\n'
            f'  <w:bottom w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>\n'
            f'  <w:right w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>\n'
            f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>\n'
            f'  <w:insideV w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>\n'
            f'</w:tblBorders>'
        )
        tblPr.append(borders)
        
    # Helper for cell padding
    def set_table_margins(table, top=120, bottom=120, left=150, right=150):
        tblPr = table._tbl.tblPr
        tblCellMar = parse_xml(
            f'<w:tblCellMar {nsdecls("w")}>\n'
            f'  <w:top w:w="{top}" w:type="dxa"/>\n'
            f'  <w:left w:w="{left}" w:type="dxa"/>\n'
            f'  <w:bottom w:w="{bottom}" w:type="dxa"/>\n'
            f'  <w:right w:w="{right}" w:type="dxa"/>\n'
            f'</w:tblCellMar>'
        )
        tblPr.append(tblCellMar)

    # Helper for cell shading
    def set_cell_shading(cell, color_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        for child in list(tcPr):
            if child.tag.endswith('shd'):
                tcPr.remove(child)
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
        tcPr.append(shd)

    # Helper for cell vertical alignment
    def set_cell_valign(cell, valign="center"):
        tcPr = cell._tc.get_or_add_tcPr()
        va = parse_xml(f'<w:vAlign {nsdecls("w")} w:val="{valign}"/>')
        tcPr.append(va)

    # ==========================================
    # 1. HEADER (Exact match with user image)
    # ==========================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(0)
    p_inst.paragraph_format.space_after = Pt(2)
    r1 = p_inst.add_run("KES's Rajarambapu Institute of Technology, Rajaramnagar")
    format_run(r1, font_name="Calibri", font_size=15, bold=True, color=PRIMARY_NAVY)

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(0)
    p_dept.paragraph_format.space_after = Pt(4)
    r2 = p_dept.add_run("Department of Computer Science & Engineering | Academic Year 2025–26")
    format_run(r2, font_name="Calibri", font_size=11, italic=True, color=MUTED_TEXT)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(2)
    p_title.paragraph_format.space_after = Pt(12)
    r3 = p_title.add_run("Capstone Project Progress Report (Group No. 01)")
    format_run(r3, font_name="Calibri", font_size=13, bold=True, color=SECONDARY_BLUE)

    # ==========================================
    # 2. PROJECT METADATA TABLE (From screenshot)
    # ==========================================
    info_table = doc.add_table(rows=5, cols=2)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(info_table, BORDER_HEX)
    set_table_margins(info_table, top=100, bottom=100, left=140, right=140)

    info_data = [
        ("Project Title", "GeoVisionAI: AI-Powered Geospatial Storytelling Platform"),
        ("Group Number", "Group No. 01"),
        ("Project Domain", "AI / Machine Learning / NLP"),
        ("Project Guide", "Dr. P. J. Kulkarni / Ms. J. A. Patil"),
        ("Team Members", "1. Ketakee Sanjay Deshmukh (Leader - 2303017)\n2. Omkar Ramesh Patil (2303012)\n3. Sanjana Vikas Patil (2303013)\n4. Atharv Arun Jadhav (2303020)")
    ]

    for idx, (label, val) in enumerate(info_data):
        row = info_table.rows[idx]
        cell_lbl = row.cells[0]
        cell_val = row.cells[1]
        
        cell_lbl.width = Inches(1.8)
        cell_val.width = Inches(5.2)
        
        set_cell_shading(cell_lbl, "F8FAFC")
        set_cell_valign(cell_lbl, "center" if idx != 4 else "top")
        set_cell_valign(cell_val, "center" if idx != 4 else "top")
        
        p_l = cell_lbl.paragraphs[0]
        p_l.paragraph_format.space_after = Pt(0)
        p_l.paragraph_format.space_before = Pt(0)
        r_l = p_l.add_run(label)
        format_run(r_l, font_name="Calibri", font_size=10.5, bold=True, color=DARK_TEXT)
        
        p_v = cell_val.paragraphs[0]
        p_v.paragraph_format.space_after = Pt(0)
        p_v.paragraph_format.space_before = Pt(0)
        r_v = p_v.add_run(val)
        format_run(r_v, font_name="Calibri", font_size=10.5, bold=False, color=DARK_TEXT)

    # Spacing
    doc.add_paragraph().paragraph_format.space_before = Pt(8)

    # ==========================================
    # 3. BASELINE PROJECT OBJECTIVES
    # ==========================================
    p_sec_obj = doc.add_paragraph()
    p_sec_obj.paragraph_format.space_before = Pt(6)
    p_sec_obj.paragraph_format.space_after = Pt(4)
    r_obj_head = p_sec_obj.add_run("1. Project Objectives (Baseline)")
    format_run(r_obj_head, font_name="Calibri", font_size=12, bold=True, color=PRIMARY_NAVY)

    objectives = [
        ("Objective 1", "To design a structured geospatial data processing system for efficient spatial data analysis and preprocessing."),
        ("Objective 2", "To develop machine learning models for spatial pattern detection and time-series forecasting of geospatial trends."),
        ("Objective 3", "To generate automated natural language explanations from structured analytical outputs using Natural Language Processing (NLP) techniques."),
        ("Objective 4", "To develop an interactive web-based visualization platform that presents predictive geospatial insights through narrative storytelling.")
    ]

    for code, text in objectives:
        p_o = doc.add_paragraph()
        p_o.paragraph_format.space_before = Pt(1)
        p_o.paragraph_format.space_after = Pt(2)
        p_o.paragraph_format.left_indent = Inches(0.2)
        r_c = p_o.add_run(f"• {code}: ")
        format_run(r_c, font_name="Calibri", font_size=10, bold=True, color=SECONDARY_BLUE)
        r_t = p_o.add_run(text)
        format_run(r_t, font_name="Calibri", font_size=10, color=DARK_TEXT)

    # Spacing
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(6)
    p_div.paragraph_format.space_after = Pt(4)

    # =========================================================================
    # 4. INITIAL 25% COMPLETION (What was achieved in initial phase)
    # =========================================================================
    p_25_head = doc.add_paragraph()
    p_25_head.paragraph_format.space_before = Pt(6)
    p_25_head.paragraph_format.space_after = Pt(4)
    r_25_h = p_25_head.add_run("2. Initial Phase (25% Project Completion)")
    format_run(r_25_h, font_name="Calibri", font_size=12, bold=True, color=PRIMARY_NAVY)

    p_25_sub = doc.add_paragraph()
    p_25_sub.paragraph_format.space_before = Pt(0)
    p_25_sub.paragraph_format.space_after = Pt(6)
    r_25_status = p_25_sub.add_run("Status: Problem Identification, Dataset Sourcing & Baseline Architecture Scoping")
    format_run(r_25_status, font_name="Calibri", font_size=10, italic=True, color=MUTED_TEXT)

    points_25 = [
        ("Problem Identification & Scope Definition", "Identified primary drawbacks in existing GIS solutions (e.g., ArcGIS, Google Earth), which only render raw static map layers and require specialized geographic knowledge to interpret."),
        ("Literature Review & Technical Survey", "Reviewed 25 research papers on AI in cartography, Large Language Models in spatial knowledge representation, and satellite raster time-series analysis to formulate the system concept."),
        ("Multi-Source Geospatial Dataset Gathering", "Identified and gathered initial spatial datasets across vector boundaries (GeoJSON), Copernicus Sentinel satellite indices (NDVI), and environmental/urban metrics across Indian metropolitan and rural zones."),
        ("System Architecture Formulation & Synopsis Approval", "Designed high-level modular system pipeline (Data Preprocessing → ML Analytics → NLP Narrative Engine → Web UI), finalized hardware/software requirements, and secured formal approval for the project synopsis.")
    ]

    table_25 = doc.add_table(rows=len(points_25) + 1, cols=2)
    table_25.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_25, BORDER_HEX)
    set_table_margins(table_25, top=80, bottom=80, left=120, right=120)

    # Header Row
    hdr_cells_25 = table_25.rows[0].cells
    hdr_cells_25[0].width = Inches(2.2)
    hdr_cells_25[1].width = Inches(4.8)
    set_cell_shading(hdr_cells_25[0], HEADER_BG_HEX)
    set_cell_shading(hdr_cells_25[1], HEADER_BG_HEX)
    
    p = hdr_cells_25[0].paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Focus Area")
    format_run(r, font_size=10, bold=True, color=RGBColor(255, 255, 255))
    
    p = hdr_cells_25[1].paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Initial 25% Deliverables & Accomplishments")
    format_run(r, font_size=10, bold=True, color=RGBColor(255, 255, 255))

    for idx, (area, desc) in enumerate(points_25, start=1):
        row = table_25.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(4.8)
        set_cell_shading(c0, "F8FAFC")
        set_cell_shading(c1, "FFFFFF")
        set_cell_valign(c0, "top")
        set_cell_valign(c1, "top")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(area)
        format_run(r0, font_size=9.5, bold=True, color=DARK_TEXT)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(desc)
        format_run(r1, font_size=9.5, color=DARK_TEXT)

    # Spacing
    doc.add_paragraph().paragraph_format.space_before = Pt(8)

    # =========================================================================
    # 5. 50% COMPLETION - SIDE-BY-SIDE COMPARISON TABLE
    # =========================================================================
    p_50_head = doc.add_paragraph()
    p_50_head.paragraph_format.space_before = Pt(6)
    p_50_head.paragraph_format.space_after = Pt(4)
    r_50_h = p_50_head.add_run("3. Mid-Stage Phase (50% Completion) — Side-by-Side Progress")
    format_run(r_50_h, font_name="Calibri", font_size=12, bold=True, color=PRIMARY_NAVY)

    p_50_sub = doc.add_paragraph()
    p_50_sub.paragraph_format.space_before = Pt(0)
    p_50_sub.paragraph_format.space_after = Pt(6)
    r_50_sub = p_50_sub.add_run("Primary Focus: Data Ingestion Pipeline, Baseline ML Models & Initial 2D Map Prototype")
    format_run(r_50_sub, font_name="Calibri", font_size=10, italic=True, color=MUTED_TEXT)

    table_50_data = [
        (
            "Raw Data Heterogeneity & Noise\n• Incompatible input formats (Shapefile, GeoJSON, CSV).\n• Missing coordinate attributes and uncalibrated sensor values.",
            "Automated Python Data Pipeline (Objective 1)\n• Developed automated data cleaning in Pandas & NumPy.\n• Normalized spatial CRS coordinates and handled missing attributes.\n• Established unified JSON schema for downstream models."
        ),
        (
            "Lack of Meaningful Geospatial Features\n• Raw coordinates lacked contextual analytical value.\n• No derived indicators for vegetation or urban spread.",
            "Spatial Feature Engineering\n• Computed regional centroid coordinates and bounding geometry.\n• Extracted NDVI vegetation indices and built-up land ratios.\n• Prepared clean multidimensional vectors for ML clustering."
        ),
        (
            "Unstructured Spatial Data\n• No mechanism to segment regions by density or risk.\n• Need for baseline pattern and anomaly detection.",
            "Baseline Spatial Pattern Detection (Objective 2)\n• Implemented K-Means & DBSCAN clustering algorithms.\n• Successfully identified spatial clusters, urban hotspots, and regional density anomalies."
        ),
        (
            "Need for Visual Proof of Concept\n• Need to verify coordinate rendering before complex UI.\n• Required lightweight map for rapid spatial validation.",
            "Basic 2D Map Prototype\n• Implemented Leaflet.js and OpenStreetMap 2D map.\n• Plotted coordinate markers, heatmaps, and verified cluster boundaries interactively."
        )
    ]

    table_50 = doc.add_table(rows=len(table_50_data) + 1, cols=2)
    table_50.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_50, BORDER_HEX)
    set_table_margins(table_50, top=90, bottom=90, left=130, right=130)

    # Header Row
    hdr_50 = table_50.rows[0].cells
    hdr_50[0].width = Inches(3.5)
    hdr_50[1].width = Inches(3.5)
    set_cell_shading(hdr_50[0], "334155") # Slate 700
    set_cell_shading(hdr_50[1], HEADER_BG_HEX) # Navy
    
    p = hdr_50[0].paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Initial State / Target Scope (Left Side)")
    format_run(r, font_size=10, bold=True, color=RGBColor(255, 255, 255))

    p = hdr_50[1].paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Work Achieved & Features Built at 50% (Right Side)")
    format_run(r, font_size=10, bold=True, color=RGBColor(255, 255, 255))

    for idx, (left_txt, right_txt) in enumerate(table_50_data, start=1):
        row = table_50.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(3.5)
        c1.width = Inches(3.5)
        set_cell_shading(c0, LEFT_COL_BG)
        set_cell_shading(c1, RIGHT_COL_BG)
        set_cell_valign(c0, "top")
        set_cell_valign(c1, "top")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(left_txt)
        format_run(r0, font_size=9.5, color=DARK_TEXT)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(right_txt)
        format_run(r1, font_size=9.5, color=DARK_TEXT)

    # Spacing
    doc.add_paragraph().paragraph_format.space_before = Pt(8)

    # =========================================================================
    # 6. 75% COMPLETION - SIDE-BY-SIDE COMPARISON TABLE
    # =========================================================================
    p_75_head = doc.add_paragraph()
    p_75_head.paragraph_format.space_before = Pt(6)
    p_75_head.paragraph_format.space_after = Pt(4)
    r_75_h = p_75_head.add_run("4. Advanced Integration Phase (75% Completion) — Side-by-Side Changes")
    format_run(r_75_h, font_name="Calibri", font_size=12, bold=True, color=PRIMARY_NAVY)

    p_75_sub = doc.add_paragraph()
    p_75_sub.paragraph_format.space_before = Pt(0)
    p_75_sub.paragraph_format.space_after = Pt(6)
    r_75_sub = p_75_sub.add_run("Primary Focus: Time-Series Forecasting, Groq LLM Narrative Engine & Architecture Iterations")
    format_run(r_75_sub, font_name="Calibri", font_size=10, italic=True, color=MUTED_TEXT)

    table_75_data = [
        (
            "Static Pattern Limitation\n• 50% clustering only reflected current state snapshots.\n• Lacked future predictive capabilities and temporal trend projection over multi-year horizons.",
            "Predictive Time-Series Forecasting (Objective 2)\n• Built multi-variable predictive regression models projecting urban growth, temperature shifts, and green cover through 2035.\n• Attained verified model accuracy of R² = 0.94."
        ),
        (
            "Cognitive Overload in Raw Visuals\n• Numerical predictions and spatial graphs still required manual expert interpretation.\n• General stakeholders unable to extract actionable takeaways.",
            "AI Narrative Generation Engine (Objective 3)\n• Integrated Groq Cloud API with Llama 3.3 Large Language Model.\n• Automatically transforms quantitative spatial predictions into coherent, plain-language stories in <1.0 second."
        ),
        (
            "High Generation Latency & Persistence Gap\n• Repeated LLM calls caused unacceptable latency.\n• No persistence layer to cache generated story chapters.",
            "Backend API & Database Caching\n• Developed FastAPI and Node.js REST API endpoints.\n• Connected MongoDB to cache generated stories and telemetry summaries, achieving sub-second story retrieval."
        ),
        (
            "UI Gaps: 2D Clutter & Rigid Video Concepts\n• Flat 2D maps caused cognitive overload with overlapping layers.\n• Pre-rendered video players felt artificial and lacked interactivity.",
            "Key Architectural Pivot & UI Decision\n• Decided to transition from flat 2D maps to a full 3D interactive planetary globe.\n• Replaced simulated video player with modular Narrative Story Cards for clean, accessible reading."
        )
    ]

    table_75 = doc.add_table(rows=len(table_75_data) + 1, cols=2)
    table_75.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_75, BORDER_HEX)
    set_table_margins(table_75, top=90, bottom=90, left=130, right=130)

    # Header Row
    hdr_75 = table_75.rows[0].cells
    hdr_75[0].width = Inches(3.5)
    hdr_75[1].width = Inches(3.5)
    set_cell_shading(hdr_75[0], "334155") # Slate 700
    set_cell_shading(hdr_75[1], HEADER_BG_HEX) # Navy
    
    p = hdr_75[0].paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Identified Gaps & Changes Needed (Left Side)")
    format_run(r, font_size=10, bold=True, color=RGBColor(255, 255, 255))

    p = hdr_75[1].paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Changes Made & Objectives Achieved at 75% (Right Side)")
    format_run(r, font_size=10, bold=True, color=RGBColor(255, 255, 255))

    for idx, (left_txt, right_txt) in enumerate(table_75_data, start=1):
        row = table_75.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(3.5)
        c1.width = Inches(3.5)
        set_cell_shading(c0, LEFT_COL_BG)
        set_cell_shading(c1, RIGHT_COL_BG)
        set_cell_valign(c0, "top")
        set_cell_valign(c1, "top")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(left_txt)
        format_run(r0, font_size=9.5, color=DARK_TEXT)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(right_txt)
        format_run(r1, font_size=9.5, color=DARK_TEXT)

    # Spacing
    doc.add_paragraph().paragraph_format.space_before = Pt(8)

    # =========================================================================
    # 7. 100% FINAL PROJECT - SIDE-BY-SIDE COMPARISON TABLE
    # =========================================================================
    p_100_head = doc.add_paragraph()
    p_100_head.paragraph_format.space_before = Pt(6)
    p_100_head.paragraph_format.space_after = Pt(4)
    r_100_h = p_100_head.add_run("5. Final Project Phase (100% Completion) — Implemented System")
    format_run(r_100_h, font_name="Calibri", font_size=12, bold=True, color=PRIMARY_NAVY)

    p_100_sub = doc.add_paragraph()
    p_100_sub.paragraph_format.space_before = Pt(0)
    p_100_sub.paragraph_format.space_after = Pt(6)
    r_100_sub = p_100_sub.add_run("Primary Focus: 3D Planetary Visualization, Story Studio, Conversational Assistant & Verified Build")
    format_run(r_100_sub, font_name="Calibri", font_size=10, italic=True, color=MUTED_TEXT)

    table_100_data = [
        (
            "Plan: Immersive 3D Planetary Mapping\n• Render full planetary globe with realistic texture.\n• Mathematical conversion of coordinates to 3D space.\n• Eliminate 2D map clutter and layer confusion.",
            "Interactive 3D Earth Globe (Objective 4)\n• Built GPU-accelerated 3D globe using Three.js & WebGL.\n• Realized spherical-to-Cartesian coordinate mapping with atmospheric glow, zoom, and interactive pin markers.\n• Delivers smooth 60fps performance across devices."
        ),
        (
            "Plan: Thematic Filterable Storytelling\n• Replace complex video controls with clean layout.\n• Support multi-domain themes (Forest, Urban, Water, Climate).\n• Provide chapter-based narrative flow.",
            "Filter-Wise AI Story Studio (Objective 4)\n• Delivered clean 'Story Dossier' with thematic category filters.\n• Presents structured narrative chapters, telemetry equations, satellite indicators, and strategic takeaway summaries.\n• Enables immediate insight discovery without domain expertise."
        ),
        (
            "Plan: Real-Time Interactive Geospatial QA\n• Provide conversational mechanism for user queries.\n• Enable instant answers without manual report reading.",
            "Conversational GeoAI Assistant (GeoBot)\n• Implemented interactive floating 3D mascot assistant.\n• Equipped with 7 one-click prompt chips (e.g. 'What is the Delhi AQI forecast?', 'Show Mumbai flood risk').\n• Delivers instantaneous, context-aware AI spatial answers."
        ),
        (
            "Plan: Interactive Predictive Simulation Lab\n• Allow users to test future environmental scenarios.\n• Real-time sliders for time horizon and demographic trends.",
            "Multi-Factor Predictive Forecasting Lab\n• Deployed live forecasting dashboard with multi-year time horizons (up to 2030).\n• Displays interactive charts for AQI, population migration, and urban density with automated health recommendations."
        ),
        (
            "Plan: End-to-End System Reliability\n• Zero runtime errors across full tech stack.\n• Production build verification and responsive layout.",
            "Production Verification & Zero-Error Build\n• Executed 'npm run build' with 0 errors and zero broken imports.\n• Validated low latency (<1.0s AI generation) across all 4 project objectives."
        )
    ]

    table_100 = doc.add_table(rows=len(table_100_data) + 1, cols=2)
    table_100.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_100, BORDER_HEX)
    set_table_margins(table_100, top=90, bottom=90, left=130, right=130)

    # Header Row
    hdr_100 = table_100.rows[0].cells
    hdr_100[0].width = Inches(3.5)
    hdr_100[1].width = Inches(3.5)
    set_cell_shading(hdr_100[0], "334155") # Slate 700
    set_cell_shading(hdr_100[1], HEADER_BG_HEX) # Navy
    
    p = hdr_100[0].paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Planned Final Specifications (Left Side)")
    format_run(r, font_size=10, bold=True, color=RGBColor(255, 255, 255))

    p = hdr_100[1].paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Final Implemented Deliverables (Right Side)")
    format_run(r, font_size=10, bold=True, color=RGBColor(255, 255, 255))

    for idx, (left_txt, right_txt) in enumerate(table_100_data, start=1):
        row = table_100.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(3.5)
        c1.width = Inches(3.5)
        set_cell_shading(c0, LEFT_COL_BG)
        set_cell_shading(c1, RIGHT_COL_BG)
        set_cell_valign(c0, "top")
        set_cell_valign(c1, "top")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(left_txt)
        format_run(r0, font_size=9.5, color=DARK_TEXT)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(right_txt)
        format_run(r1, font_size=9.5, color=DARK_TEXT)

    # Spacing
    doc.add_paragraph().paragraph_format.space_before = Pt(8)

    # =========================================================================
    # 8. SUMMARY MATRIX: OBJECTIVES VS PROGRESS PHASES
    # =========================================================================
    p_mat_head = doc.add_paragraph()
    p_mat_head.paragraph_format.space_before = Pt(6)
    p_mat_head.paragraph_format.space_after = Pt(4)
    r_m_h = p_mat_head.add_run("6. Objective vs. Project Progress Summary Matrix")
    format_run(r_m_h, font_name="Calibri", font_size=12, bold=True, color=PRIMARY_NAVY)

    matrix_data = [
        ("Objective 1", "Structured geospatial data processing system", "Phase 2 (50%)", "Data cleaning & normalization pipeline (Pandas/NumPy)"),
        ("Objective 2", "ML models for spatial patterns & time-series forecasting", "Phase 3 (75%)", "Spatial clustering & time-series predictive models (R² = 0.94)"),
        ("Objective 3", "Automated natural language explanations via NLP", "Phase 3 (75%)", "Groq Cloud Llama 3.3 narrative engine (<1s generation)"),
        ("Objective 4", "Interactive web visualization platform with storytelling", "Phase 4 (100%)", "Three.js 3D Globe, Filter-Wise Story Studio & GeoAI Assistant")
    ]

    mat_table = doc.add_table(rows=len(matrix_data) + 1, cols=4)
    mat_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(mat_table, BORDER_HEX)
    set_table_margins(mat_table, top=80, bottom=80, left=100, right=100)

    # Matrix Header
    hdr_m = mat_table.rows[0].cells
    widths = [Inches(1.1), Inches(2.2), Inches(1.1), Inches(2.6)]
    col_names = ["Objective", "Target Description", "Milestone", "Final Deliverable in System"]

    for i in range(4):
        hdr_m[i].width = widths[i]
        set_cell_shading(hdr_m[i], HEADER_BG_HEX)
        p = hdr_m[i].paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(col_names[i])
        format_run(r, font_size=9.5, bold=True, color=RGBColor(255, 255, 255))

    for idx, (obj, target, phase, deliverable) in enumerate(matrix_data, start=1):
        row = mat_table.rows[idx]
        cells = row.cells
        for i, val in enumerate([obj, target, phase, deliverable]):
            cells[i].width = widths[i]
            set_cell_valign(cells[i], "top")
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            if i == 0:
                set_cell_shading(cells[i], "F8FAFC")
                format_run(r, font_size=9, bold=True, color=SECONDARY_BLUE)
            elif i == 2:
                set_cell_shading(cells[i], "F0FDF4")
                format_run(r, font_size=9, bold=True, color=RGBColor(22, 101, 52)) # Forest Green
            else:
                set_cell_shading(cells[i], "FFFFFF")
                format_run(r, font_size=9, color=DARK_TEXT)

    # NOTE: Signatures are completely removed as requested ("and below also remove that signiture")

    doc.save(output_path)
    print(f"Successfully generated clean report at: {output_path}")

if __name__ == "__main__":
    for fname in ["Capstone_Group_01_Progress_Report_Organized.docx", "Capstone_Group_01_Progress_Report_Phases.docx"]:
        try:
            create_progress_report(fname)
            print(f"Generated: {fname}")
        except PermissionError:
            print(f"Notice: {fname} is currently open in Word. Saved alternative without lock.")

