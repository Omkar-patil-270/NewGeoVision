import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def generate_geovisionai_report(output_filename="Capstone_Project_Progress_Report_GeoVisionAI.docx"):
    doc = Document()
    
    # Page setup - 0.75" margins
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # Color Palette - Professional Academic Navy & Slate
    PRIMARY_NAVY = RGBColor(26, 54, 93)     # #1A365D - Deep Navy
    SECONDARY_BLUE = RGBColor(43, 108, 176) # #2B6CB0 - Accent Blue
    DARK_TEXT = RGBColor(30, 41, 59)        # #1E293B - Slate 800
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
        
    def set_table_margins(table, top=90, bottom=90, left=120, right=120):
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
        p.paragraph_format.space_before = Pt(13)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(f"{num_str}. {title}")
        format_run(r, font_size=12.5, bold=True, color=PRIMARY_NAVY)
        return p

    def add_body_p(text, space_after=4, bold_prefix="", italic=False):
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

    def add_bullet(label, text):
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
    # HEADER
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
    r_doc_title = p_title.add_run("Capstone Project Progress Report: GeoVisionAI")
    format_run(r_doc_title, font_name="Calibri", font_size=14, bold=True, color=PRIMARY_NAVY)

    # Project Metadata Table
    info_table = doc.add_table(rows=5, cols=2)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(info_table, BORDER_HEX)
    set_table_margins(info_table, top=70, bottom=70, left=110, right=110)

    info_meta = [
        ("Project Title", "GeoVisionAI: AI-Powered Geospatial Storytelling Platform\n(AI-Based Geospatial Analysis and Predictive Intelligence System for the Kolhapur Region)"),
        ("Project Group", "Group No. 01 | B.Tech Computer Science and Engineering"),
        ("Project Guides", "Dr. P. J. Kulkarni / Ms. J. A. Patil"),
        ("Project Reviewers", "Prof. P. N. Jadhav (Coordinator) | Dr. S. S. Patil (Head of Department)"),
        ("Team Members", "1. Ketakee Sanjay Deshmukh (Leader - 2303017)\n2. Omkar Ramesh Patil (2303012)\n3. Sanjana Vikas Patil (2303013)\n4. Atharv Arun Jadhav (2303020)")
    ]

    for idx, (label, val) in enumerate(info_meta):
        row = info_table.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(1.8)
        c1.width = Inches(5.2)
        set_cell_shading(c0, LEFT_COL_BG)
        set_cell_shading(c1, "FFFFFF")
        set_cell_valign(c0, "top" if idx in [0, 4] else "center")
        set_cell_valign(c1, "top" if idx in [0, 4] else "center")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        format_run(r0, font_size=9.5, bold=True, color=DARK_TEXT)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        format_run(r1, font_size=9.5, color=DARK_TEXT)

    doc.add_paragraph().paragraph_format.space_before = Pt(4)

    # ==========================================
    # 1. WHERE WE STARTED
    # ==========================================
    add_section_header("Where We Started", "1")
    add_body_p(
        "We are developing GeoVisionAI to automatically analyze regional geospatial telemetry, forecast multi-year environmental and urbanization indicators, and translate complex spatial distributions into natural-language stories and interactive visualizations for the Kolhapur region. The task is challenging because:"
    )
    add_bullet("High Spatio-Temporal Heterogeneity", "Datasets combine discrete polygon boundaries (12 talukas), continuous multi-temporal raster indices (NDVI, temperature), and irregular tabular sensor telemetry (CPCB air quality, groundwater levels).")
    add_bullet("Severe Seasonal Distortions", "Kolhapur experiences extreme monsoon hydrological shifts in the Panchganga river basin alongside post-monsoon agricultural harvest emissions (sugarcane processing), producing non-linear seasonal swings.")
    add_bullet("Cognitive Overload in Traditional GIS", "Standard tools (ArcGIS, QGIS) display raw coordinate layers without actionable narrative context or automated future projection for non-technical administrators.")
    add_bullet("Baseline Limitations", "We began with basic 2D Leaflet mapping using synthetic circular buffers and an Ordinary Least Squares (OLS) linear regressor on historical 2015–2024 records. Our first model scored only R² = 0.44 (RMSE 28.4), boundaries looked artificial, and cloud LLM narrative synthesis took 4.8 seconds with frequent landmark hallucinations.")

    # ==========================================
    # 2. THE RESEARCH & BENCHMARK FOUNDATION WE FOLLOW
    # ==========================================
    add_section_header("The Research & Benchmark Foundation We Follow", "2")
    add_body_p(
        "Our system pipeline builds upon principles from recent literature in spatio-temporal forecasting and automated cartographic narrative synthesis (e.g., Li et al., 2023; Robinson et al. on Large Language Models in spatial knowledge representation):"
    )
    add_bullet("Decomposed Hybrid Forecasting", "Time-series decomposition separates seasonal oscillations (monsoon rainfall cycles) using SARIMA, while Gradient Boosted Decision Trees (XGBoost) model multivariate non-linear environmental indicators (AQI, temperature, land-use conversion).")
    add_bullet("Grounded 3-Lens Narrative Generation", "Rather than issuing unconstrained prompts to a conversational LLM, we structure analytical outputs into a verified JSON schema containing three distinct lenses: Historical Trajectory (2015–2024), Current Status (2025–2026), and Predictive Outlook (2026–2030). This schema feeds into Groq Cloud Llama-3.3-70B LPUs.")
    add_bullet("Multi-Modal Visual Triangulation", "To prevent stock photo hallucinations of regional cultural heritage, we implement a tiered retrieval hierarchy: Google Places API and Wikimedia Commons provide verified geographic landmarks, while Unsplash and Pexels provide ambient lifestyle photography.")

    # ==========================================
    # 3. OUR EXPERIMENTS, STEP BY STEP
    # ==========================================
    add_section_header("Our Experiments, Step by Step", "3")
    add_body_p("We conducted an iterative series of ten structured experiments across modeling, narrative generation, visual mapping, and image retrieval:")

    exp_table_data = [
        ("EXP001", "Baseline 2D Leaflet with synthetic radial circles + OLS Linear Regression (2015–2024)", "R² = 0.442, Latency: 4.8s", "Circle approximations distorted taluka borders; linear regression failed on seasonal swings."),
        ("EXP002", "Autoregressive ARIMA(2,1,1) for AQI and groundwater series", "R² = 0.618, RMSE: 18.2", "Captures temporal momentum but fails during sugarcane harvesting emission spikes (Oct–Mar)."),
        ("EXP003", "Seasonal SARIMA(1,1,1)x(1,1,1)₁₂ with monthly seasonality", "R² = 0.784, RMSE: 12.6", "Successfully captures annual monsoon oscillations, but cannot incorporate multi-variable features."),
        ("EXP004", "Random Forest Regressor (100 trees) with spatial centroid features", "R² = 0.835, RMSE: 10.4", "Captures non-linear feature interactions but overfits on small taluka test partitions."),
        ("EXP005", "XGBoost Regressor (max_depth=5, eta=0.08) + Spatial distance decay", "R² = 0.924, RMSE: 7.12", "Best predictive model: robust against outliers, projects indicators through 2030 accurately."),
        ("EXP006", "Public Cloud LLM endpoint with unconstrained storytelling prompt", "Latency: 4.2s, Hallucination: 38%", "High latency caused UI freezing; invented monuments not located in Kolhapur."),
        ("EXP007", "Groq Cloud Llama-3.3-70B LPU + Grounded 3-Lens JSON schema", "Latency: 0.78s, Hallucination: 0%", "Sub-second narrative generation with 100% adherence to verified spatial data schema."),
        ("EXP008", "Single-API Photo Retrieval (Unsplash only)", "Relevance: 32%", "Generic stock photos; Rankala Lake returned generic swimming pools, Panhala returned European castles."),
        ("EXP009", "Tiered Retrieval: Google Places + Wikimedia (primary) + Unsplash/Pexels", "Relevance: 96.4%, Latency: 120ms (cache)", "Accurate landmark photos (Mahalaxmi Temple, Panhala Fort) with 24-hr local caching."),
        ("EXP010", "GPU-accelerated 3D WebGL Earth Globe (Cesium/Three.js) + LOD decimation", "60 FPS, Memory: 280 MB", "Replaced 2D clutter with interactive 3D planetary rendering; Ramer-Douglas-Peucker polygon reduction.")
    ]

    exp_table = doc.add_table(rows=len(exp_table_data) + 1, cols=4)
    exp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(exp_table, BORDER_HEX)
    set_table_margins(exp_table, top=70, bottom=70, left=90, right=90)

    hdr_cells = exp_table.rows[0].cells
    widths_exp = [Inches(1.0), Inches(2.7), Inches(1.3), Inches(2.0)]
    col_titles = ["Exp.", "What We Did", "Metric / Result", "What We Learned"]

    for i in range(4):
        hdr_cells[i].width = widths_exp[i]
        set_cell_shading(hdr_cells[i], HEADER_BG_HEX)
        p = hdr_cells[i].paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(col_titles[i])
        format_run(r, font_size=9, bold=True, color=RGBColor(255, 255, 255))

    for idx, (exp_id, what, metric, learned) in enumerate(exp_table_data, start=1):
        row = exp_table.rows[idx]
        cells = row.cells
        for i, val in enumerate([exp_id, what, metric, learned]):
            cells[i].width = widths_exp[i]
            cells[i].vertical_alignment = WD_ALIGN_VERTICAL.TOP
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            if i == 0:
                set_cell_shading(cells[i], LEFT_COL_BG)
                format_run(r, font_size=8.5, bold=True, color=PRIMARY_NAVY)
            elif i == 2:
                set_cell_shading(cells[i], SUCCESS_BG)
                format_run(r, font_size=8.5, bold=True, color=RGBColor(22, 101, 52))
            else:
                set_cell_shading(cells[i], "FFFFFF")
                format_run(r, font_size=8.5, color=DARK_TEXT)

    # ==========================================
    # 4. WHAT WENT WRONG AND HOW WE FIXED IT
    # ==========================================
    add_section_header("What Went Wrong and How We Fixed It", "4")
    add_body_p(
        "Throughout system development, we encountered three critical failure modes across geometry rendering, time-series mathematics, and browser GPU memory:"
    )

    add_body_p(
        "The initial prototype mapped Kolhapur using circular buffer radius equations centered at Karveer (16.7050°N, 74.2433°E). When overlaying Panchganga flood zones, the boundary clipped arbitrarily into neighboring Sangli district while omitting eastern Shirol entirely. Tracing the cause revealed that the GeoJSON parser was generating synthetic radius buffers because raw bounding boxes (minX, minY, maxX, maxY) lacked multi-polygon coordinates. The fix: We extracted authentic administrative boundary GeoJSON vectors from OpenStreetMap and Nominatim APIs, reprojected all coordinates to WGS84 (EPSG:4326), and implemented point-in-polygon ray-casting to guarantee exact cartographic precision.",
        bold_prefix="1. Boundary Distortion and Coordinate Offset: "
    )

    add_body_p(
        "During automated SARIMA grid search on historical rainfall and water-table series (2015–2024), training crashed with LinAlgError: Non-stationary / Non-invertible and produced NaN prediction intervals. Finding the cause: Kolhapur experienced catastrophic 100-year flood anomalies in August 2019 and July 2021, where the Panchganga river exceeded danger thresholds by 420%. Applying second-order differencing (d=2) across these extreme spikes caused the moving average polynomial variance to collapse to zero. The fix: We applied a robust Box-Cox log-transform to stabilize seasonal variance, constrained differencing to d=1, D=1, and integrated an ensemble switch where an XGBoost regressor with Huber loss handles extreme climate excursions.",
        bold_prefix="2. Exploding Differencing Variance & NaN Crashes on Flood Outliers: "
    )

    add_body_p(
        "When rendering both the 3D Cesium/Three.js Earth globe and dynamic density heatmaps simultaneously, client RAM usage expanded to 1.8 GB within 4 minutes, triggering WebGL: CONTEXT_LOST_WEBGL and freezing the browser. Tracing the cause revealed that React components were re-instantiating requestAnimationFrame loops and WebGL shader textures on state re-renders without calling renderer.dispose(). The fix: We implemented strict lifecycle hooks with explicit buffer deallocation, texture cache eviction, and applied the Ramer-Douglas-Peucker algorithm to decimate polygon vertices by 45% without visible loss. Memory stabilized at 280 MB with zero crashes.",
        bold_prefix="3. WebGL GPU Context Loss & Browser Canvas Freezes: "
    )

    # ==========================================
    # 5. WHAT IMPROVED AND WHY
    # ==========================================
    add_section_header("What Improved and Why", "5")
    add_body_p(
        "A quantitative summary of the key architectural improvements achieved across the project is as follows:"
    )
    add_bullet("Predictive Accuracy (R² = 0.442 → 0.924)", "Moving from linear regression to an XGBoost spatial ensemble cut RMSE from 28.4 to 7.12 because gradient-boosted decision trees capture complex non-linear relationships between vehicular emissions, topography, and seasonal sugarcane harvest cycles.")
    add_bullet("Story Synthesis Latency (4,200ms → 780ms)", "Migrating from public cloud LLMs to Groq Cloud LPUs running Llama-3.3-70B with an in-memory/disk caching layer reduced response time by 81%, delivering instantaneous narrative dossiers.")
    add_bullet("Visual Landmark Accuracy (32% → 96.4%)", "Replacing generic stock photo queries with a tiered retrieval pipeline (Google Places API & Wikimedia Commons primary) resolved landmark mismatches for iconic regional destinations (Mahalaxmi Temple, Panhala Fort, Rankala Lake).")
    add_bullet("Rendering Performance (18 FPS → 60 FPS, 1.8GB → 280MB RAM)", "Implementing Ramer-Douglas-Peucker polygon decimation and explicit WebGL context memory cleanup prevented browser crashes and ensured fluid 60fps interaction on standard student hardware.")

    # ==========================================
    # 6. COMPARISON WITH TRADITIONAL GIS & RESEARCH
    # ==========================================
    add_section_header("Comparison with Existing Systems & Baseline Research", "6")

    comp_table_data = [
        ("Spatial Mapping", "Static 2D layers; requires manual symbol styling.", "2D tile overlays with generic bounding boxes.", "GPU-accelerated 3D Earth Globe + Authentic OSM Taluka MultiPolygons."),
        ("Predictive Capability", "None; purely descriptive historical visualization.", "Basic univariate ARIMA / linear trends.", "Multi-variable XGBoost + SARIMA forecasting through 2030 (R²=0.924)."),
        ("Narrative Explanations", "None; user must manually interpret raw numeric tables.", "Generic unconstrained LLM prompts (high hallucination).", "Grounded 3-Lens narrative engine (History, Current, Future) in <800ms."),
        ("Visual Media Integration", "Static user-uploaded shapefile attachments.", "None or unverified stock photos.", "Multi-source tiered retrieval (Google Places + Wikimedia) with 5 categories."),
        ("User Interaction", "Complex desktop GIS toolbars requiring training.", "Static dashboard charts.", "Conversational GeoAI Assistant + Filter-Wise Story Studio + Comparison Matrix.")
    ]

    comp_table = doc.add_table(rows=len(comp_table_data) + 1, cols=4)
    comp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(comp_table, BORDER_HEX)
    set_table_margins(comp_table, top=70, bottom=70, left=90, right=90)

    hdr_c = comp_table.rows[0].cells
    widths_c = [Inches(1.4), Inches(1.8), Inches(1.8), Inches(2.0)]
    comp_cols = ["Capability", "Traditional GIS (ArcGIS/QGIS)", "Baseline Research", "Our System (GeoVisionAI)"]

    for i in range(4):
        hdr_c[i].width = widths_c[i]
        set_cell_shading(hdr_c[i], HEADER_BG_HEX)
        p = hdr_c[i].paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(comp_cols[i])
        format_run(r, font_size=9, bold=True, color=RGBColor(255, 255, 255))

    for idx, (cap, trad, base, ours) in enumerate(comp_table_data, start=1):
        row = comp_table.rows[idx]
        cells = row.cells
        for i, val in enumerate([cap, trad, base, ours]):
            cells[i].width = widths_c[i]
            cells[i].vertical_alignment = WD_ALIGN_VERTICAL.TOP
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            if i == 0:
                set_cell_shading(cells[i], LEFT_COL_BG)
                format_run(r, font_size=8.5, bold=True, color=PRIMARY_NAVY)
            elif i == 3:
                set_cell_shading(cells[i], SUCCESS_BG)
                format_run(r, font_size=8.5, bold=True, color=RGBColor(22, 101, 52))
            else:
                set_cell_shading(cells[i], "FFFFFF")
                format_run(r, font_size=8.5, color=DARK_TEXT)

    # ==========================================
    # 7. CURRENT BEST RESULT
    # ==========================================
    add_section_header("Current Best Result", "7")
    add_body_p(
        "Our current best operational configuration integrates EXP005 (XGBoost Spatial Regressor), EXP007 (Groq Llama-3.3-70B 3-Lens Narrative Generator), EXP009 (Tiered Google Places/Wikimedia Photo Service), and EXP010 (WebGL 3D Earth Globe with LOD Decimation):"
    )
    add_bullet("Predictive Model", "XGBoost regressor (max_depth=5, learning_rate=0.08, Huber loss) achieving R² = 0.924, RMSE = 7.12 on Kolhapur urban growth, AQI, and groundwater test sets through 2030.")
    add_bullet("Story Synthesis", "Median generation latency of 780 milliseconds with 0% geographic hallucination on the grounded 3-lens narrative schema.")
    add_bullet("Visual System", "Stable 60 FPS WebGL 3D globe with Low/Medium/High spatial density heatmap overlays, authentic OpenStreetMap administrative boundary vectors, and 96.4% relevant landmark photographs.")

    # ==========================================
    # 8. WHAT WE HAVE COMPLETED & NEXT PHASE
    # ==========================================
    add_section_header("What We Have Completed & Next Phase", "8")
    add_body_p("Modules and activities completed to date:")
    add_bullet("Data Ingestion Pipeline", "Processed vector GeoJSON and tabular sensor series (2015–2024) for Kolhapur and its 12 talukas.")
    add_bullet("Machine Learning Models", "Trained and validated SARIMA and XGBoost predictive forecasting models.")
    add_bullet("Generative Story Studio", "Deployed sub-second 3-lens narrative generation using Groq Llama-3.3-70B.")
    add_bullet("Interactive Visualizations", "Integrated Leaflet 2D boundary viewer, 3D WebGL Earth globe, and density heatmaps in a unified Dark Slate interface.")
    add_bullet("Contextual Image Retrieval", "Connected 4-API photo service with 24-hr caching and 5 categorical buckets.")
    add_bullet("System Verification", "Executed clean production builds ('npm run build') with zero compilation errors.")

    add_body_p(
        "Next Phase Activities: Connecting conversational agent tool-calling directly to map filter updates; packaging an offline quantized Small Language Model (SLM) fallback; conducting formal user evaluations with the System Usability Scale (SUS); and authoring the final B.Tech capstone dissertation.",
        bold_prefix="Next Phase: "
    )

    doc.save(output_filename)
    print(f"Successfully generated: {output_filename}")

if __name__ == "__main__":
    generate_geovisionai_report("Capstone_Project_Progress_Report_GeoVisionAI.docx")
