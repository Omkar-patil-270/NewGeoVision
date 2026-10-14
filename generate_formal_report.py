import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_formal_progress_report(output_path="Capstone_Project_Progress_Report_Formal.docx"):
    doc = Document()
    
    # 0.75" standard academic margins
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # Formal Monochrome / Executive Slate Palette (No flashy colors)
    COLOR_BLACK = RGBColor(15, 23, 42)      # Deep formal black/slate
    COLOR_BODY = RGBColor(30, 41, 59)       # Formal body text
    COLOR_MUTED = RGBColor(71, 85, 105)     # Subdued gray
    BORDER_GRAY = "94A3B8"                 # Clean slate border (0.75 pt)
    LIGHT_GRAY_BG = "F8FAFC"               # Very light tint for left headers
    HEADER_BG = "E2E8F0"                   # Formal light-slate header background
    
    def format_run(run, font_name="Calibri", font_size=10.5, bold=False, italic=False, color=COLOR_BODY):
        run.font.name = font_name
        run.font.size = Pt(font_size)
        run.bold = bold
        run.italic = italic
        run.font.color.rgb = color

    def set_table_borders(table, border_color=BORDER_GRAY):
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
        
    def set_table_margins(table, top=80, bottom=80, left=110, right=110):
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

    def add_sec_title(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(11)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(title)
        format_run(r, font_size=11.5, bold=True, color=COLOR_BLACK)
        return p

    def add_sub_line(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(text)
        format_run(r, font_size=9.5, italic=True, color=COLOR_MUTED)
        return p

    # ==========================================
    # FORMAL ACADEMIC HEADER
    # ==========================================
    p1 = doc.add_paragraph()
    p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p1.paragraph_format.space_before = Pt(0)
    p1.paragraph_format.space_after = Pt(1)
    r1 = p1.add_run("KES's Rajarambapu Institute of Technology, Rajaramnagar")
    format_run(r1, font_size=13.5, bold=True, color=COLOR_BLACK)

    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2.paragraph_format.space_before = Pt(0)
    p2.paragraph_format.space_after = Pt(2)
    r2 = p2.add_run("Department of Computer Science & Engineering | Academic Year 2025–26")
    format_run(r2, font_size=10, italic=True, color=COLOR_MUTED)

    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p3.paragraph_format.space_before = Pt(1)
    p3.paragraph_format.space_after = Pt(8)
    r3 = p3.add_run("Capstone Project Progress Report — Group No. 01")
    format_run(r3, font_size=12, bold=True, color=COLOR_BLACK)

    # ==========================================
    # METADATA TABLE (Formal Minimalist)
    # ==========================================
    meta_data = [
        ("Project Title", "GeoVisionAI: AI-Powered Geospatial Storytelling Platform"),
        ("Domain / Guide", "AI / Machine Learning / NLP  |  Dr. P. J. Kulkarni / Ms. J. A. Patil"),
        ("Team Members", "Ketakee S. Deshmukh (Leader, 2303017), Omkar R. Patil (2303012), Sanjana V. Patil (2303013), Atharv A. Jadhav (2303020)")
    ]

    t_meta = doc.add_table(rows=len(meta_data), cols=2)
    t_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_meta, BORDER_GRAY)
    set_table_margins(t_meta, top=70, bottom=70, left=100, right=100)

    for idx, (label, val) in enumerate(meta_data):
        row = t_meta.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(1.8)
        c1.width = Inches(5.2)
        set_cell_shading(c0, LIGHT_GRAY_BG)
        set_cell_shading(c1, "FFFFFF")
        set_cell_valign(c0, "center")
        set_cell_valign(c1, "center")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        format_run(r0, font_size=9.5, bold=True, color=COLOR_BLACK)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        format_run(r1, font_size=9.5, color=COLOR_BODY)

    doc.add_paragraph().paragraph_format.space_before = Pt(2)

    # ==========================================
    # 1. PROJECT OBJECTIVES
    # ==========================================
    add_sec_title("1. Project Objectives")
    
    objectives = [
        ("O1", "Structured geospatial data processing system for spatial analysis and preprocessing."),
        ("O2", "ML models for spatial pattern detection and time-series forecasting where appropriate."),
        ("O3", "Automated natural-language explanations of analytical outputs using NLP techniques."),
        ("O4", "Interactive web visualization platform presenting predictive insights through storytelling.")
    ]

    for code, desc in objectives:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.2)
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(2)
        r_code = p.add_run(f"{code}: ")
        format_run(r_code, font_size=9.5, bold=True, color=COLOR_BLACK)
        r_desc = p.add_run(desc)
        format_run(r_desc, font_size=9.5, color=COLOR_BODY)

    # ==========================================
    # 2. PHASE 1 — INITIAL (25%)
    # ==========================================
    add_sec_title("2. Phase 1 — Initial (25%)")
    add_sub_line("Problem identification, dataset sourcing, architecture scoping")

    p1_data = [
        ("Problem Scope", "Existing GIS tools (ArcGIS, Google Earth) show raw static layers and need specialist knowledge to interpret."),
        ("Literature Review", "25 papers reviewed: AI in cartography, LLMs for spatial knowledge, satellite time-series analysis."),
        ("Datasets", "GeoJSON administrative boundaries, Copernicus Sentinel indices (NDVI), urban/environmental metrics for Indian zones (Kolhapur region focus)."),
        ("Architecture", "Formulated modular pipeline: Data Preprocessing → ML Analytics → NLP Narrative Engine → Web UI. Synopsis formally approved.")
    ]

    t1 = doc.add_table(rows=len(p1_data), cols=2)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t1, BORDER_GRAY)
    set_table_margins(t1, top=60, bottom=60, left=90, right=90)

    for idx, (label, val) in enumerate(p1_data):
        row = t1.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(1.8)
        c1.width = Inches(5.2)
        set_cell_shading(c0, LIGHT_GRAY_BG)
        set_cell_shading(c1, "FFFFFF")
        set_cell_valign(c0, "top")
        set_cell_valign(c1, "top")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        format_run(r0, font_size=9.5, bold=True, color=COLOR_BLACK)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        format_run(r1, font_size=9.5, color=COLOR_BODY)

    # ==========================================
    # 3. PHASE 2 — MID-STAGE (50%)
    # ==========================================
    add_sec_title("3. Phase 2 — Mid-Stage (50%)")
    add_sub_line("Data pipeline, baseline ML models, 2D map prototype")

    p2_data = [
        ("Mixed formats (Shapefile, GeoJSON, CSV); missing attributes", "• Pandas/NumPy cleaning pipeline (O1)\n• CRS normalization to EPSG:4326, unified JSON schema"),
        ("Raw coordinates lacked analytical value", "• Centroids, NDVI vegetation indices, built-up land ratios\n• Multi-dimensional feature vectors prepared for clustering"),
        ("No way to segment regions by density/risk", "• K-Means and DBSCAN clustering algorithms (O2)\n• Detected spatial clusters, urban hotspots, and regional density anomalies"),
        ("Needed quick visual validation", "• Leaflet.js + OpenStreetMap 2D prototype\n• Plotted coordinate markers, heatmaps, and verified cluster boundaries")
    ]

    t2 = doc.add_table(rows=len(p2_data) + 1, cols=2)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t2, BORDER_GRAY)
    set_table_margins(t2, top=60, bottom=60, left=90, right=90)

    h2 = t2.rows[0].cells
    h2[0].width = Inches(3.2)
    h2[1].width = Inches(3.8)
    set_cell_shading(h2[0], HEADER_BG)
    set_cell_shading(h2[1], HEADER_BG)
    r_h0 = h2[0].paragraphs[0].add_run("Initial State")
    format_run(r_h0, font_size=9.5, bold=True, color=COLOR_BLACK)
    r_h1 = h2[1].paragraphs[0].add_run("Work Achieved")
    format_run(r_h1, font_size=9.5, bold=True, color=COLOR_BLACK)

    for idx, (init_state, achieved) in enumerate(p2_data, start=1):
        row = t2.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(3.2)
        c1.width = Inches(3.8)
        set_cell_shading(c0, LIGHT_GRAY_BG)
        set_cell_shading(c1, "FFFFFF")
        set_cell_valign(c0, "top")
        set_cell_valign(c1, "top")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(init_state)
        format_run(r0, font_size=9, color=COLOR_BODY)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(achieved)
        format_run(r1, font_size=9, color=COLOR_BODY)

    # ==========================================
    # 4. PHASE 3 — ADVANCED INTEGRATION (75%)
    # ==========================================
    add_sec_title("4. Phase 3 — Advanced Integration (75%)")
    add_sub_line("Forecasting, Groq LLM narrative engine, architecture changes")

    p3_data = [
        ("Clustering showed only current snapshots without temporal projection", "• Multi-variable regression forecasts (XGBoost / SARIMA) through 2030/2035 (O2)\n• Model accuracy R² = 0.94 on validation tests"),
        ("Predictions needed expert interpretation", "• Integrated Groq Cloud API with Llama 3.3 (O3)\n• Plain-language narrative stories generated in <1.0 s"),
        ("Repeated LLM calls caused latency; no persistence", "• Built FastAPI and Node.js REST API endpoints\n• Database/disk caching layer implemented → sub-second story retrieval"),
        ("2D maps cluttered; video player rigid and artificial", "• Pivot from flat 2D maps to 3D interactive Earth globe\n• Replaced static video concept with modular Narrative Story Cards")
    ]

    t3 = doc.add_table(rows=len(p3_data) + 1, cols=2)
    t3.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t3, BORDER_GRAY)
    set_table_margins(t3, top=60, bottom=60, left=90, right=90)

    h3 = t3.rows[0].cells
    h3[0].width = Inches(3.2)
    h3[1].width = Inches(3.8)
    set_cell_shading(h3[0], HEADER_BG)
    set_cell_shading(h3[1], HEADER_BG)
    r_h30 = h3[0].paragraphs[0].add_run("Gap Identified")
    format_run(r_h30, font_size=9.5, bold=True, color=COLOR_BLACK)
    r_h31 = h3[1].paragraphs[0].add_run("Change Made")
    format_run(r_h31, font_size=9.5, bold=True, color=COLOR_BLACK)

    for idx, (gap, change) in enumerate(p3_data, start=1):
        row = t3.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(3.2)
        c1.width = Inches(3.8)
        set_cell_shading(c0, LIGHT_GRAY_BG)
        set_cell_shading(c1, "FFFFFF")
        set_cell_valign(c0, "top")
        set_cell_valign(c1, "top")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(gap)
        format_run(r0, font_size=9, color=COLOR_BODY)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(change)
        format_run(r1, font_size=9, color=COLOR_BODY)

    # ==========================================
    # 5. PHASE 4 — FINAL IMPLEMENTATION (100%)
    # ==========================================
    add_sec_title("5. Phase 4 — Final Implementation (100%)")
    add_sub_line("3D visualization, Story Studio, conversational assistant, verified build")

    p4_data = [
        ("3D planetary mapping without 2D clutter", "• Three.js/WebGL globe (O4) with spherical-to-Cartesian mapping, pins, 60 fps\n• Real OpenStreetMap administrative boundary vectors (no synthetic circles)"),
        ("Thematic, chapter-based storytelling", "• Filter-based Story Studio (History, Current, Forecasting lenses; Forest, Urban, Water, Climate)\n• Chapters, telemetry equations, takeaway summaries"),
        ("Conversational spatial Q&A", "• GeoBot AI chatbot with 7 one-click prompt chips\n• Instant context-aware spatial answers"),
        ("Scenario testing of future conditions", "• Forecasting Lab with time sliders (up to 2030/2035)\n• Interactive charts for AQI, demographic migration, urban density, and spatial density heatmaps (Low/Med/High)"),
        ("Fast multi-source image retrieval", "• Tiered retrieval (Google Places + Wikimedia primary, Unsplash/Pexels fallback)\n• 5 categorized albums (Landmarks, Culture, Food, Nature, Markets) with 24-hr caching"),
        ("Reliable, error-free production system", "• npm run build: 0 errors, 0 broken imports\n• AI generation <1.0 s across all objectives; dark cohesive UI theme")
    ]

    t4 = doc.add_table(rows=len(p4_data) + 1, cols=2)
    t4.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t4, BORDER_GRAY)
    set_table_margins(t4, top=60, bottom=60, left=90, right=90)

    h4 = t4.rows[0].cells
    h4[0].width = Inches(2.8)
    h4[1].width = Inches(4.2)
    set_cell_shading(h4[0], HEADER_BG)
    set_cell_shading(h4[1], HEADER_BG)
    r_h40 = h4[0].paragraphs[0].add_run("Planned")
    format_run(r_h40, font_size=9.5, bold=True, color=COLOR_BLACK)
    r_h41 = h4[1].paragraphs[0].add_run("Delivered")
    format_run(r_h41, font_size=9.5, bold=True, color=COLOR_BLACK)

    for idx, (planned, delivered) in enumerate(p4_data, start=1):
        row = t4.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.8)
        c1.width = Inches(4.2)
        set_cell_shading(c0, LIGHT_GRAY_BG)
        set_cell_shading(c1, "FFFFFF")
        set_cell_valign(c0, "top")
        set_cell_valign(c1, "top")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(planned)
        format_run(r0, font_size=9, color=COLOR_BODY)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(delivered)
        format_run(r1, font_size=9, color=COLOR_BODY)

    # ==========================================
    # 6. OBJECTIVE VS. PROGRESS MATRIX
    # ==========================================
    add_sec_title("6. Objective vs. Progress Matrix")

    matrix_data = [
        ("O1", "Geospatial data processing", "Phase 2 (50%)", "Cleaning & normalization pipeline (WGS84, GeoJSON)"),
        ("O2", "Spatial ML & forecasting", "Phase 3 (75%)", "Clustering + multi-variate forecasting (R² = 0.94)"),
        ("O3", "NLP explanations", "Phase 3 (75%)", "Groq Llama 3.3 narrative engine (<1 s generation)"),
        ("O4", "Interactive storytelling platform", "Phase 4 (100%)", "3D Globe, Filter-based Story Studio, GeoBot Chatbot, Heatmaps")
    ]

    t_mat = doc.add_table(rows=len(matrix_data) + 1, cols=4)
    t_mat.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_mat, BORDER_GRAY)
    set_table_margins(t_mat, top=60, bottom=60, left=90, right=90)

    hdr_m = t_mat.rows[0].cells
    widths_m = [Inches(1.0), Inches(2.0), Inches(1.3), Inches(2.7)]
    cols_m = ["Objective", "Target", "Milestone", "Final Deliverable"]

    for i in range(4):
        hdr_m[i].width = widths_m[i]
        set_cell_shading(hdr_m[i], HEADER_BG)
        p = hdr_m[i].paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(cols_m[i])
        format_run(r, font_size=9, bold=True, color=COLOR_BLACK)

    for idx, (obj, target, ms, deliv) in enumerate(matrix_data, start=1):
        row = t_mat.rows[idx]
        cells = row.cells
        for i, val in enumerate([obj, target, ms, deliv]):
            cells[i].width = widths_m[i]
            cells[i].vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            if i == 0:
                set_cell_shading(cells[i], LIGHT_GRAY_BG)
                format_run(r, font_size=9, bold=True, color=COLOR_BLACK)
            else:
                set_cell_shading(cells[i], "FFFFFF")
                format_run(r, font_size=9, color=COLOR_BODY)

    doc.save(output_path)
    print(f"Successfully generated formal progress report at: {output_path}")

if __name__ == "__main__":
    create_formal_progress_report("Capstone_Project_Progress_Report_Formal.docx")
    create_formal_progress_report("Capstone_Group_01_Progress_Report_Organized.docx")
