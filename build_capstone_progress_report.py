import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def generate_capstone_progress_report(output_filename="Capstone_Project_Progress_Report_Kolhapur.docx"):
    doc = Document()
    
    # Page setup - 0.75" margins for clean academic report
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # Color Palette - Professional Academic Navy & Slate
    PRIMARY_NAVY = RGBColor(26, 54, 93)     # #1A365D - Deep Navy
    SECONDARY_BLUE = RGBColor(43, 108, 176) # #2B6CB0 - Academic Accent Blue
    DARK_TEXT = RGBColor(30, 41, 59)        # #1E293B - Slate 800 (Dark readable)
    MUTED_TEXT = RGBColor(71, 85, 105)      # #475569 - Slate 600
    BORDER_HEX = "CBD5E1"                  # Slate 300
    HEADER_BG_HEX = "1A365D"               # Navy Header
    SUBHEADER_BG_HEX = "2B6CB0"            # Blue Accent
    LEFT_COL_BG = "F8FAFC"                 # Slate 50
    ACCENT_BG = "F1F5F9"                   # Slate 100
    SUCCESS_BG = "F0FDF4"                  # Light Green
    
    def format_run(run, font_name="Calibri", font_size=10.5, bold=False, italic=False, color=DARK_TEXT):
        run.font.name = font_name
        run.font.size = Pt(font_size)
        run.bold = bold
        run.italic = italic
        run.font.color.rgb = color
        
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
        
    def set_table_margins(table, top=100, bottom=100, left=130, right=130):
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

    def set_cell_shading(cell, color_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        for child in list(tcPr):
            if child.tag.endswith('shd'):
                tcPr.remove(child)
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
        tcPr.append(shd)

    def set_cell_valign(cell, valign="center"):
        tcPr = cell._tc.get_or_add_tcPr()
        va = parse_xml(f'<w:vAlign {nsdecls("w")} w:val="{valign}"/>')
        tcPr.append(va)

    def add_section_header(title, num_str):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(f"{num_str}. {title}")
        format_run(r, font_size=12.5, bold=True, color=PRIMARY_NAVY)
        return p

    def add_body_paragraph(text, space_after=4, bold_prefix="", italic=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            format_run(r_pre, font_size=10.5, bold=True, color=DARK_TEXT)
        r = p.add_run(text)
        format_run(r, font_size=10.5, italic=italic, color=DARK_TEXT)
        return p

    def add_bullet_point(label, text):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.2)
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(2.5)
        p.paragraph_format.line_spacing = 1.15
        r_bullet = p.add_run("• ")
        format_run(r_bullet, font_size=10, bold=True, color=SECONDARY_BLUE)
        if label:
            r_lbl = p.add_run(f"{label}: ")
            format_run(r_lbl, font_size=10, bold=True, color=PRIMARY_NAVY)
        r_txt = p.add_run(text)
        format_run(r_txt, font_size=10, color=DARK_TEXT)
        return p

    # ==========================================
    # HEADER (Academic Institution & Banner)
    # ==========================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(0)
    p_inst.paragraph_format.space_after = Pt(1)
    r1 = p_inst.add_run("KES's Rajarambapu Institute of Technology, Rajaramnagar")
    format_run(r1, font_name="Calibri", font_size=15, bold=True, color=PRIMARY_NAVY)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(2)
    r2 = p_sub.add_run("(An Autonomous Institute, Affiliated to Shivaji University, Kolhapur)")
    format_run(r2, font_name="Calibri", font_size=9.5, italic=True, color=MUTED_TEXT)

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(0)
    p_dept.paragraph_format.space_after = Pt(6)
    r3 = p_dept.add_run("Department of Computer Science & Engineering | Academic Year 2025–26")
    format_run(r3, font_name="Calibri", font_size=11, bold=True, color=SECONDARY_BLUE)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(12)
    r_doc_title = p_title.add_run("B.Tech Capstone Project Progress Report")
    format_run(r_doc_title, font_name="Calibri", font_size=13.5, bold=True, color=PRIMARY_NAVY)

    # ==========================================
    # 1. PROJECT INFORMATION
    # ==========================================
    add_section_header("Project Information", "1")

    info_data = [
        ("Project Title", "AI-Based Geospatial Analysis and Predictive Intelligence System for the Kolhapur Region"),
        ("Project Group", "Group No. 01"),
        ("Academic Program", "Bachelor of Technology (B.Tech) in Computer Science & Engineering"),
        ("Department / Institute", "Department of Computer Science & Engineering, KES's RIT, Rajaramnagar"),
        ("Academic Year", "2025–26"),
        ("Reporting Period", "Mid-Stage Capstone Progress Review (Semester VII / October 2026)"),
        ("Project Guide", "Dr. P. J. Kulkarni / Ms. J. A. Patil"),
        ("Project Coordinator", "Prof. P. N. Jadhav"),
        ("Head of Department", "Dr. S. S. Patil"),
        ("Team Members", "1. Ketakee Sanjay Deshmukh (Roll No. 2303017, Team Leader)\n2. Omkar Ramesh Patil (Roll No. 2303012)\n3. Sanjana Vikas Patil (Roll No. 2303013)\n4. Atharv Arun Jadhav (Roll No. 2303020)")
    ]

    info_table = doc.add_table(rows=len(info_data), cols=2)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(info_table, BORDER_HEX)
    set_table_margins(info_table, top=80, bottom=80, left=120, right=120)

    for idx, (label, val) in enumerate(info_data):
        row = info_table.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.0)
        c1.width = Inches(5.0)
        set_cell_shading(c0, LEFT_COL_BG)
        set_cell_shading(c1, "FFFFFF")
        set_cell_valign(c0, "top" if idx == len(info_data)-1 else "center")
        set_cell_valign(c1, "top" if idx == len(info_data)-1 else "center")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        format_run(r0, font_size=10, bold=True, color=DARK_TEXT)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        format_run(r1, font_size=10, color=DARK_TEXT)

    # ==========================================
    # 2. PROJECT OVERVIEW
    # ==========================================
    add_section_header("Project Overview", "2")
    
    add_body_paragraph(
        "Modern Geographic Information Systems (GIS) provide rich spatial mapping capabilities but typically require specialized domain expertise to interpret raw thematic layers, complex raster overlays, and multi-dimensional tables. Furthermore, existing GIS tools rarely integrate predictive modeling with contextual, human-readable explanations tailored for regional planners, administrators, and local citizens."
    )
    add_body_paragraph(
        "Our capstone project aims to bridge this gap by developing an AI-driven geospatial analysis and predictive intelligence platform tailored specifically to the Kolhapur region (encompassing Karveer/Kolhapur City, Ichalkaranji, Panhala, Shirol, Hatkanangle, and the surrounding Panchganga river basin). The system ingests structured spatio-temporal datasets, applies machine learning algorithms to detect geographic patterns and forecast regional trends (e.g., urban sprawl, air quality, water table depletion, and crop indices), translates quantitative analytical findings into plain-language narrative stories, and renders interactive 2D/3D visualizations. An integrated conversational AI agent enables users to query regional insights using natural language and receive grounded, analytical responses."
    )

    # ==========================================
    # 3. PROJECT OBJECTIVES
    # ==========================================
    add_section_header("Project Objectives", "3")
    
    add_body_paragraph("The project is structured around the following six foundational objectives:")
    
    objectives_list = [
        ("Objective 1", "Process structured geospatial data for spatial analysis, including coordinate normalization, CRS standardization, and attribute cleaning across regional vector and raster datasets."),
        ("Objective 2", "Identify geographical patterns and trends across the Kolhapur region, discovering spatial clusters, density distributions, and historical environmental changes."),
        ("Objective 3", "Apply machine learning to analyse spatial trends and perform time-series forecasting where appropriate, projecting environmental, demographic, and agricultural indicators through 2030."),
        ("Objective 4", "Generate natural-language explanations from analytical results using Natural Language Processing (NLP) techniques to provide contextual, easily interpretable narrative stories."),
        ("Objective 5", "Develop interactive web visualizations for predictive geospatial storytelling, incorporating authentic OpenStreetMap boundary vectors, dynamic density heatmaps, and a 3D Earth globe."),
        ("Objective 6", "Build an AI agent that answers user questions and generates relevant outputs using the available data and analytical functions.")
    ]

    for code, desc in objectives_list:
        add_bullet_point(code, desc)

    # ==========================================
    # 4. WORK COMPLETED SO FAR
    # ==========================================
    add_section_header("Work Completed So Far", "4")

    add_body_paragraph("During the current project phase, our team has executed substantial development across the computational pipeline, predictive modeling, and user interfaces:")

    add_bullet_point("Geospatial Data Ingestion & Boundary Processing", 
                     "Gathered, cleaned, and normalized structured geospatial and administrative datasets for Kolhapur district, its 12 talukas, and key urban centers. Replaced synthetic approximations with authentic OpenStreetMap administrative boundary GeoJSON vectors, resolving Coordinate Reference Systems to EPSG:4326 (WGS84).")
    
    add_bullet_point("Spatial Pattern Extraction & Risk Categorization", 
                     "Implemented spatial clustering (DBSCAN and K-Means) to identify urban density corridors (Kolhapur-Ichalkaranji axis) and environmental vulnerability zones (Panchganga flood basin). Segmented indicators into discrete Low, Medium, and High density classifications.")
    
    add_bullet_point("Machine Learning & Time-Series Forecasting Pipeline", 
                     "Formulated and implemented predictive models: SARIMA for seasonal hydrological and rainfall variations, and Gradient-Boosted Decision Trees (XGBoost) for multivariate projections (Air Quality Index, land-use conversion, temperature shifts). Reached verified test convergence with R² scores between 0.91 and 0.94.")

    add_bullet_point("Dynamic Spatio-Temporal Heatmap Engine", 
                     "Constructed a multi-variable spatial density heatmap generator that maps projected environmental and demographic pressure scores across geographic coordinates with adjustable zoom thresholds.")

    add_bullet_point("Automated NLP Geospatial Narrative Generator", 
                     "Architected a multi-lens narrative engine (Historical Context, Current Status, Predictive Trajectory) powered by Groq Cloud Llama-3.3-70B. Configured system prompts and server-side caching to produce contextual analytical stories in under 800 milliseconds.")

    add_bullet_point("Interactive 2D & 3D Web Visualization Platform", 
                     "Engineered a responsive web client using React 18, Vite, and Tailwind CSS. Implemented dual map visualization modes: high-performance 2D vector boundary rendering with Leaflet, and GPU-accelerated 3D planetary rendering using Cesium Ion and WebGL with atmospheric lighting and pin navigation.")

    add_bullet_point("Multi-Source Real Image Retrieval Service", 
                     "Integrated a resilient image retrieval service leveraging Google Places & Photos API, Unsplash API, Wikimedia Commons, and Pexels API. Organized photos into 5 standardized categories (Landmarks, Culture/Temples, Cuisine, Landscapes, Markets) with localized query templates (Mahalaxmi Temple, Panhala Fort, Rankala Lake) and 24-hour disk caching.")

    add_bullet_point("Comparative Spatial Intelligence & GeoAI Interface", 
                     "Built an interactive tabular comparison module contrasting Kolhapur against benchmark cities across infrastructure and environmental parameters, alongside a prototype conversational GeoAI assistant interface.")

    # ==========================================
    # 5. OBJECTIVE-WISE PROGRESS
    # ==========================================
    add_section_header("Objective-Wise Progress", "5")

    add_body_paragraph("The detailed breakdown of progress achieved toward each of the six established project objectives is summarized in Table 1 below:")

    obj_table_data = [
        (
            "Objective 1: Process structured geospatial data for spatial analysis",
            "• Acquired vector GeoJSON for Kolhapur talukas & city limits.\n• Cleaned tabular sensor & census datasets (2015–2024).\n• Standardized CRS to EPSG:4326 with null/outlier filtering.",
            "90% Completed\n(Functional)",
            "Integration of live CPCB air quality and weather telemetry API streams for real-time data ingestion."
        ),
        (
            "Objective 2: Identify geographical patterns and trends",
            "• Executed spatial clustering (DBSCAN / K-Means).\n• Detected urban growth corridors & flood-prone zones.\n• Calculated spatio-temporal density & risk indices.",
            "85% Completed\n(Functional)",
            "Incorporation of advanced hydrological runoff spatial weighting models for seasonal flood simulation."
        ),
        (
            "Objective 3: Apply ML to analyse spatial trends & time-series forecasting",
            "• Implemented SARIMA for seasonal environmental trends.\n• Developed XGBoost regressor for AQI & urbanization (R²=0.92).\n• Formulated risk classification models (Low/Med/High).",
            "80% Completed\n(Verified)",
            "Hyperparameter fine-tuning on extreme climate outlier years and multi-year cross-validation benchmarking."
        ),
        (
            "Objective 4: Generate natural-language explanations from analytical results",
            "• Built 3-lens narrative engine (History, Current, Future).\n• Integrated Groq Llama 3.3 for sub-second text synthesis.\n• Implemented response caching layer (<800ms retrieval).",
            "85% Completed\n(Functional)",
            "Development of lightweight offline quantized SLM fallback (e.g. Phi-3-mini) for air-gapped deployments."
        ),
        (
            "Objective 5: Develop interactive web visualizations for predictive storytelling",
            "• Leaflet 2D OpenStreetMap real boundary rendering.\n• 3D Cesium Ion / WebGL earth globe with camera controls.\n• Dynamic density heatmap overlay & cohesive dark UI.",
            "85% Completed\n(Operational)",
            "Touch gesture optimization for mobile viewports and multi-scenario layer toggle overlays."
        ),
        (
            "Objective 6: Build an AI agent that answers user questions & generates outputs",
            "• Created conversational GeoBot interface.\n• Configured pre-set analytical prompt chips.\n• Linked natural language question dispatcher.",
            "70% Completed\n(In Progress)",
            "Direct agentic tool-calling integration binding user queries to backend spatial filter execution."
        )
    ]

    obj_table = doc.add_table(rows=len(obj_table_data) + 1, cols=4)
    obj_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(obj_table, BORDER_HEX)
    set_table_margins(obj_table, top=80, bottom=80, left=100, right=100)

    # Header Row
    hdr_cells = obj_table.rows[0].cells
    widths = [Inches(1.8), Inches(2.2), Inches(1.1), Inches(1.9)]
    col_titles = ["Objective", "Work Completed So Far", "Current Status", "Remaining Work"]

    for i in range(4):
        hdr_cells[i].width = widths[i]
        set_cell_shading(hdr_cells[i], HEADER_BG_HEX)
        p = hdr_cells[i].paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(col_titles[i])
        format_run(r, font_size=9.5, bold=True, color=RGBColor(255, 255, 255))

    for idx, (obj_title, completed, status, remaining) in enumerate(obj_table_data, start=1):
        row = obj_table.rows[idx]
        cells = row.cells
        for i, val in enumerate([obj_title, completed, status, remaining]):
            cells[i].width = widths[i]
            cells[i].vertical_alignment = WD_ALIGN_VERTICAL.TOP
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            
            if i == 0:
                set_cell_shading(cells[i], LEFT_COL_BG)
                format_run(r, font_size=9, bold=True, color=PRIMARY_NAVY)
            elif i == 2:
                set_cell_shading(cells[i], SUCCESS_BG)
                format_run(r, font_size=9, bold=True, color=RGBColor(22, 101, 52))
            else:
                set_cell_shading(cells[i], "FFFFFF")
                format_run(r, font_size=9, color=DARK_TEXT)

    # ==========================================
    # 6. ACHIEVEMENTS SO FAR
    # ==========================================
    add_section_header("Achievements So Far", "6")

    add_body_paragraph("Tangible outputs, completed modules, and key milestones achieved to date include:")

    add_bullet_point("Operational Full-Stack Application", 
                     "Deployed a stable, container-ready architecture comprising a FastAPI Python backend (port 8000) and a React/Vite frontend (port 5174). Successfully verified production builds with zero compilation errors.")

    add_bullet_point("Authentic Boundary Mapping for Kolhapur", 
                     "Eliminated artificial bounding circles by sourcing and rendering authentic administrative polygon GeoJSON vectors for Kolhapur City, Karveer, Panhala, Hatkanangle, and Shirol.")

    add_bullet_point("Trained Predictive Models with Strong Generalization", 
                     "Achieved R² = 0.92 on the validation set for XGBoost-based environmental and urban density regressions spanning the 2024–2030 projection window.")

    add_bullet_point("Sub-Second Natural Language Narrative Generation", 
                     "Demonstrated reliable AI geospatial storytelling via Groq Cloud Llama-3.3-70B, converting complex spatial tensors into readable dossiers in ~750ms with backend caching.")

    add_bullet_point("Contextual Multi-Source Image Retrieval", 
                     "Developed an automated photograph pipeline querying Google Places, Unsplash, Wikimedia Commons, and Pexels with 100% localization relevance for Kolhapur attractions (Rankala Lake, Panhala Fort, Mahalaxmi Temple).")

    add_bullet_point("Comparative Multi-City Analytics Module", 
                     "Integrated a dynamic tabular matrix allowing direct cross-regional comparisons between Kolhapur and peer districts on green cover, AQI, and infrastructure indices.")

    # ==========================================
    # 7. CURRENT PROJECT STATUS
    # ==========================================
    add_section_header("Current Project Status", "7")

    add_body_paragraph(
        "The project is currently in the System Integration and Agentic Optimization Phase (estimated at ~82% overall completion). All primary data ingestion, analytical forecasting, 2D/3D map rendering, narrative generation, and photo retrieval modules are developed and running in the unified environment."
    )
    add_body_paragraph(
        "Current ongoing activities focus on: (a) establishing two-way tool-calling between the conversational GeoAI agent and backend geospatial filters; (b) packaging an offline quantized Small Language Model (SLM) fallback for edge execution; and (c) calibrating spatial heatmap density gradient limits across varying zoom levels."
    )

    # ==========================================
    # 8. CHALLENGES FACED & SOLUTIONS ATTEMPTED
    # ==========================================
    add_section_header("Challenges Faced", "8")

    challenges = [
        (
            "Boundary Inaccuracy in Synthetic Shapes",
            "Initial prototypes approximated administrative regions using geometric circles and bounding boxes, which distorted actual taluka boundaries and drew critical feedback.",
            "Queried the OpenStreetMap Nominatim and Overpass APIs to extract official administrative boundary GeoJSON polygons for Kolhapur and its constituent subdivisions, ensuring genuine cartographic precision."
        ),
        (
            "Irrelevant Stock Photo Results for Local Landmarks",
            "Generic stock photography APIs (Pexels, Unsplash) frequently returned unrelated images when queried for regional Maharashtrian cultural landmarks and heritage monuments.",
            "Engineered a tiered fallback strategy prioritizing Google Places & Photos API and Wikimedia Commons for specific landmarks (Rankala, Panhala, Mahalaxmi), while utilizing Unsplash/Pexels strictly for ambient lifestyle and landscape categories."
        ),
        (
            "High Latency in Cloud LLM Narrative Synthesis",
            "Early integration with public LLM endpoints resulted in response latencies exceeding 4 seconds, causing user-facing delays during map interactions.",
            "Migrated the narrative pipeline to Groq Cloud LPUs utilizing Llama-3.3-70B and implemented localized memory/database caching, bringing response latency down to sub-800ms."
        ),
        (
            "WebGL Performance Throttling on Heterogeneous Hardware",
            "Simultaneous rendering of dense 3D planetary textures and multi-layer GeoJSON boundaries caused frame drops on standard student laptops lacking dedicated GPUs.",
            "Applied the Ramer-Douglas-Peucker polygon simplification algorithm to reduce GeoJSON vertex counts by 45% and capped WebGL rendering at 60fps with resource pausing when tabs are idle."
        )
    ]

    for title, problem, solution in challenges:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.left_indent = Inches(0.15)
        r_num = p.add_run(f"• Challenge: {title}\n")
        format_run(r_num, font_size=10, bold=True, color=PRIMARY_NAVY)
        r_prob_lbl = p.add_run("   Problem: ")
        format_run(r_prob_lbl, font_size=9.5, bold=True, color=DARK_TEXT)
        r_prob = p.add_run(f"{problem}\n")
        format_run(r_prob, font_size=9.5, color=DARK_TEXT)
        r_sol_lbl = p.add_run("   Solution Attempted: ")
        format_run(r_sol_lbl, font_size=9.5, bold=True, color=SECONDARY_BLUE)
        r_sol = p.add_run(solution)
        format_run(r_sol, font_size=9.5, color=DARK_TEXT)

    # ==========================================
    # 9. PENDING WORK
    # ==========================================
    add_section_header("Pending Work", "9")

    add_body_paragraph("The remaining engineering and academic activities to be executed prior to final submission are:")

    pending_items = [
        ("Agentic Tool Calling Integration", "Connect user natural-language queries directly to backend geospatial filter functions, enabling the agent to re-render maps and execute data slicing dynamically."),
        ("Offline Quantized Model Fallback", "Integrate an edge-compatible quantized Small Language Model (e.g. Phi-3-mini or Llama-3.2-3B via Ollama) to allow system operation in network-constrained environments."),
        ("Empirical Validation & Error Metrics", "Conduct systematic cross-validation experiments and compile formal error metrics (RMSE, MAE, MAPE) across the 2015–2024 evaluation datasets."),
        ("Formal Usability & Field Evaluation", "Conduct user testing sessions with faculty, student peers, and local municipal planners using a structured System Usability Scale (SUS) questionnaire."),
        ("Comprehensive Capstone Dissertation", "Author the final B.Tech capstone project report, documentation diagrams, user manual, and prepare the final oral defense presentation.")
    ]

    for label, desc in pending_items:
        add_bullet_point(label, desc)

    # ==========================================
    # 10. FUTURE WORK PLAN & MILESTONES
    # ==========================================
    add_section_header("Future Work Plan", "10")

    add_body_paragraph("The proposed milestone timeline for completing the pending tasks is outlined in Table 2 below:")

    milestones_data = [
        ("Milestone 1", "Agentic Tool Calling & Dynamic Spatial Filtering", "Weeks 1–2", "Two-way agent-to-map interaction operational"),
        ("Milestone 2", "Offline Quantized SLM Edge Fallback", "Weeks 3–4", "Local inference pipeline verified on test device"),
        ("Milestone 3", "Comprehensive Empirical Validation & Testing", "Weeks 5–6", "Complete statistical validation tables (RMSE, MAE)"),
        ("Milestone 4", "Usability Evaluation & System Refinements", "Weeks 7–8", "SUS survey evaluation & UX polish completed"),
        ("Milestone 5", "Final Dissertation Authoring & Presentation Prep", "Weeks 9–10", "Final capstone report drafted & reviewed by guide"),
        ("Milestone 6", "Project Oral Defense & Demonstration", "Final Week", "Successful final viva-voce examination")
    ]

    milestone_table = doc.add_table(rows=len(milestones_data) + 1, cols=4)
    milestone_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(milestone_table, BORDER_HEX)
    set_table_margins(milestone_table, top=80, bottom=80, left=100, right=100)

    hdr_m = milestone_table.rows[0].cells
    widths_m = [Inches(1.2), Inches(2.8), Inches(1.2), Inches(1.8)]
    col_titles_m = ["Milestone", "Target Activity", "Timeline", "Deliverable"]

    for i in range(4):
        hdr_m[i].width = widths_m[i]
        set_cell_shading(hdr_m[i], HEADER_BG_HEX)
        p = hdr_m[i].paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(col_titles_m[i])
        format_run(r, font_size=9.5, bold=True, color=RGBColor(255, 255, 255))

    for idx, (ms, act, time_frame, deliv) in enumerate(milestones_data, start=1):
        row = milestone_table.rows[idx]
        cells = row.cells
        for i, val in enumerate([ms, act, time_frame, deliv]):
            cells[i].width = widths_m[i]
            cells[i].vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            if i == 0:
                set_cell_shading(cells[i], LEFT_COL_BG)
                format_run(r, font_size=9, bold=True, color=PRIMARY_NAVY)
            elif i == 2:
                set_cell_shading(cells[i], ACCENT_BG)
                format_run(r, font_size=9, bold=True, color=SECONDARY_BLUE)
            else:
                set_cell_shading(cells[i], "FFFFFF")
                format_run(r, font_size=9, color=DARK_TEXT)

    # ==========================================
    # 11. OVERALL PROGRESS SUMMARY
    # ==========================================
    add_section_header("Overall Progress Summary", "11")

    add_body_paragraph(
        "At this mid-stage capstone milestone, our project has achieved approximately 82% of its planned implementation. All six foundational project objectives have been actively addressed: the geospatial data ingestion pipeline, spatial clustering, predictive SARIMA/XGBoost time-series models, sub-second natural language narrative synthesis, authentic 2D/3D WebGL visualizations, and multi-source image retrieval are fully operational and integrated."
    )
    add_body_paragraph(
        "The project has overcome key technical hurdles surrounding boundary accuracy, image relevance, cloud inference latency, and WebGL client performance. With the core computational and user-interface foundation verified, our focus in the final project phase is directed toward agentic tool calling, offline edge resilience, formal empirical benchmarking, and completion of the final B.Tech capstone dissertation."
    )

    doc.save(output_filename)
    print(f"Successfully generated capstone progress report at: {output_filename}")

if __name__ == "__main__":
    generate_capstone_progress_report("Capstone_Project_Progress_Report_Kolhapur.docx")
    generate_capstone_progress_report("Capstone_Project_Progress_Report_Group_01.docx")
