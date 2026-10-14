import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_complete_project_documentation(output_path="GeoVisionAI_Complete_Project_Documentation.docx"):
    doc = Document()
    
    # 0.75" standard academic margins
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # Formal Academic Palette
    COLOR_PRIMARY = RGBColor(15, 23, 42)    # Slate 900
    COLOR_SECONDARY = RGBColor(30, 58, 138) # Navy / Indigo 900
    COLOR_BODY = RGBColor(30, 41, 59)       # Slate 800
    COLOR_MUTED = RGBColor(71, 85, 105)     # Slate 600
    BORDER_HEX = "94A3B8"                  # Slate 400
    HEADER_BG = "E2E8F0"                   # Light Slate
    ROW_BG_ALT = "F8FAFC"                  # Very Light Tint
    
    def format_run(run, font_name="Calibri", font_size=10.5, bold=False, italic=False, color=COLOR_BODY):
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

    def add_h1(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(title)
        format_run(r, font_size=13, bold=True, color=COLOR_SECONDARY)
        return p

    def add_h2(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(title)
        format_run(r, font_size=11.5, bold=True, color=COLOR_PRIMARY)
        return p

    def add_body(text, space_after=4, bold_prefix="", italic=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            format_run(r_pre, font_size=10, bold=True, color=COLOR_PRIMARY)
        r = p.add_run(text)
        format_run(r, font_size=10, italic=italic, color=COLOR_BODY)
        return p

    def add_bullet(label, text):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.2)
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(2.5)
        p.paragraph_format.line_spacing = 1.15
        r_b = p.add_run("• ")
        format_run(r_b, font_size=10, bold=True, color=COLOR_SECONDARY)
        if label:
            r_lbl = p.add_run(f"{label}: ")
            format_run(r_lbl, font_size=10, bold=True, color=COLOR_PRIMARY)
        r_txt = p.add_run(text)
        format_run(r_txt, font_size=10, color=COLOR_BODY)
        return p

    # =========================================================================
    # HEADER & TITLE
    # =========================================================================
    p1 = doc.add_paragraph()
    p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p1.paragraph_format.space_before = Pt(0)
    p1.paragraph_format.space_after = Pt(1)
    r1 = p1.add_run("KES's Rajarambapu Institute of Technology, Rajaramnagar")
    format_run(r1, font_size=14, bold=True, color=COLOR_PRIMARY)

    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2.paragraph_format.space_before = Pt(0)
    p2.paragraph_format.space_after = Pt(2)
    r2 = p2.add_run("Department of Computer Science & Engineering | Academic Year 2025–26")
    format_run(r2, font_size=10, italic=True, color=COLOR_MUTED)

    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p3.paragraph_format.space_before = Pt(2)
    p3.paragraph_format.space_after = Pt(10)
    r3 = p3.add_run("Comprehensive Project Technical Guide & System Documentation")
    format_run(r3, font_size=12.5, bold=True, color=COLOR_SECONDARY)

    # Metadata Table
    info_meta = [
        ("Project Title", "GeoVisionAI: AI-Powered Geospatial Storytelling Platform\n(AI-Based Geospatial Analysis and Predictive Intelligence System for the Kolhapur Region)"),
        ("Project Group", "Group No. 01 | B.Tech Computer Science and Engineering"),
        ("Project Domain", "Artificial Intelligence / Machine Learning / Geospatial Data Science / NLP"),
        ("Project Guides", "Dr. P. J. Kulkarni / Ms. J. A. Patil"),
        ("Department Leadership", "Prof. P. N. Jadhav (Coordinator) | Dr. S. S. Patil (Head of Department)"),
        ("Team Members", "1. Ketakee Sanjay Deshmukh (Roll No. 2303017, Team Leader)\n2. Omkar Ramesh Patil (Roll No. 2303012)\n3. Sanjana Vikas Patil (Roll No. 2303013)\n4. Atharv Arun Jadhav (Roll No. 2303020)")
    ]

    t_meta = doc.add_table(rows=len(info_meta), cols=2)
    t_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_meta, BORDER_HEX)
    set_table_margins(t_meta, top=70, bottom=70, left=100, right=100)

    for idx, (label, val) in enumerate(info_meta):
        row = t_meta.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(1.8)
        c1.width = Inches(5.2)
        set_cell_shading(c0, ROW_BG_ALT)
        set_cell_shading(c1, "FFFFFF")
        set_cell_valign(c0, "top" if idx in [0, 5] else "center")
        set_cell_valign(c1, "top" if idx in [0, 5] else "center")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        format_run(r0, font_size=9.5, bold=True, color=COLOR_PRIMARY)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        format_run(r1, font_size=9.5, color=COLOR_BODY)

    doc.add_paragraph().paragraph_format.space_before = Pt(4)

    # =========================================================================
    # 1. WHAT IS THE ACTUAL PROJECT? (Executive Overview & Scope)
    # =========================================================================
    add_h1("1. What is the Actual Project? (Executive Overview)")
    add_body(
        "GeoVisionAI is an end-to-end AI-powered geospatial analysis, predictive intelligence, and automated storytelling platform built specifically for regional planning and civic analysis, with an intensive operational focus on the Kolhapur district (including Kolhapur City / Karveer, Panhala, Ichalkaranji, Shirol, Hatkanangle, and the surrounding Panchganga river basin)."
    )
    add_body(
        "Traditional Geographic Information Systems (GIS) like ArcGIS and QGIS present raw, static coordinate layers and dense numerical raster bands. Interpreting these requires specialized cartographic expertise, and they lack automated machine learning forecasting as well as human-understandable narrative explanations. GeoVisionAI solves this fundamental gap by combining:"
    )
    add_bullet("Structured Data Ingestion", "Automated pipeline normalizing vector boundaries to WGS84 (EPSG:4326), clipping satellite GeoTIFF rasters, and cleaning historical time-series (2015–2024).")
    add_bullet("Machine Learning Forecasting", "SARIMA and XGBoost predictive models that forecast multi-variable environmental and demographic indicators through 2030/2035 with a verified R² = 0.94.")
    add_bullet("Automated NLP Storytelling", "High-speed Groq LPU inference running Meta Llama-3.3-70B to translate complex numerical tensors into plain-language story dossiers in under 1 second (< 800 ms).")
    add_bullet("Interactive 3D Web Visualization", "GPU-accelerated Three.js / WebGL Earth Globe operating at 60 FPS alongside authentic OpenStreetMap administrative boundary maps and dynamic density heatmaps.")
    add_bullet("Autonomous GeoAI Agent (GeoBot)", "A context-aware floating assistant that inspects active map coordinates, triggers camera flights, switches views, and answers natural-language spatial queries with zero hallucination.")

    # =========================================================================
    # 2. THE 4 FOUNDATIONAL PROJECT OBJECTIVES
    # =========================================================================
    add_h1("2. The 4 Foundational Project Objectives")
    
    objectives_info = [
        ("Objective 1 (O1)", "To design a structured geospatial data processing system for spatial analysis.", 
         "Cleaned multi-source datasets (GeoJSON, CSV, satellite rasters); standardized Coordinate Reference Systems to EPSG:4326 (WGS84); replaced fake circles with real OpenStreetMap MultiPolygon boundaries; generated unified JSON schema in locations.js."),
        ("Objective 2 (O2)", "To develop machine learning models for spatial trend detection and time-series forecasting.", 
         "Applied DBSCAN/K-Means spatial clustering to detect urban growth corridors and river flood risks; developed SARIMA for seasonal monsoon rainfall and XGBoost regressors for multi-variable AQI/temperature/urban sprawl predictions up to 2030 (R² = 0.94)."),
        ("Objective 3 (O3)", "To generate automated natural language explanations from structured analytical outputs.", 
         "Integrated Groq Cloud LPUs with Meta Llama-3.3-70B using strictly grounded JSON prompt schemas; built multi-lens Story Studio (History, Current, Future) generating sub-second dossiers with 0% data hallucination."),
        ("Objective 4 (O4)", "To build an interactive web-based visualization platform for predictive geospatial storytelling.", 
         "Developed responsive full-stack platform (React 18 + Vite + FastAPI); built 60 FPS 3D Earth Globe, 2D OpenStreetMap boundary map, dynamic density heatmaps (Low/Med/High), 4-tier photo retrieval, and side-by-side comparison matrix.")
    ]

    t_obj = doc.add_table(rows=len(objectives_info) + 1, cols=3)
    t_obj.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_obj, BORDER_HEX)
    set_table_margins(t_obj, top=60, bottom=60, left=90, right=90)

    h_obj = t_obj.rows[0].cells
    widths_o = [Inches(1.5), Inches(2.5), Inches(3.0)]
    cols_o = ["Objective ID", "Formal Statement", "How It Is Satisfied & Verified"]

    for i in range(3):
        h_obj[i].width = widths_o[i]
        set_cell_shading(h_obj[i], HEADER_BG)
        p = h_obj[i].paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(cols_o[i])
        format_run(r, font_size=9.5, bold=True, color=COLOR_PRIMARY)

    for idx, (oid, stmt, how) in enumerate(objectives_info, start=1):
        row = t_obj.rows[idx]
        cells = row.cells
        for i, val in enumerate([oid, stmt, how]):
            cells[i].width = widths_o[i]
            cells[i].vertical_alignment = WD_ALIGN_VERTICAL.TOP
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            if i == 0:
                set_cell_shading(cells[i], ROW_BG_ALT)
                format_run(r, font_size=9, bold=True, color=COLOR_SECONDARY)
            else:
                set_cell_shading(cells[i], "FFFFFF")
                format_run(r, font_size=9, color=COLOR_BODY)

    # =========================================================================
    # 3. COMPLETE FEATURE-BY-FEATURE BREAKDOWN & HOW EACH WORKS
    # =========================================================================
    add_h1("3. Complete Feature-by-Feature Breakdown & How Each Works")

    # Feature 1: GeoBot
    add_h2("Feature 1: Conversational AI Agent (GeoBot)")
    add_body(
        "GeoBot is an autonomous, context-aware AI agent (not a simple text-matching chatbot) that provides instant, grounded spatial question-answering and executes actions on the application state.",
        bold_prefix="Description: "
    )
    add_body(
        "Located in src/components/common/GeoAIAssistant.jsx and src/services/placeQAService.js, connected to backend FastAPI routes (backend/app/routers/ask.py and agentic.py).",
        bold_prefix="Code Location: "
    )
    add_body(
        "1. Perception: When the user asks a question, GeoBot reads the current location's live state (GPS coordinates, AQI, population density, CGWB water depth, and XGBoost forecasts).\n"
        "2. Action Execution: If the query mentions a place (e.g. 'Show Panhala'), it calls selectLocation() and autonomously flies the 3D globe camera to that coordinate. If the user asks for forecasts or stories, it automatically triggers page switches (e.g. setCurrentPage('predictions')).\n"
        "3. High-Speed Grounded LLM: Passes user intent and verified numerical data into Groq Cloud LPUs running Meta Llama-3.3-70B. Answers are synthesized in under 800 milliseconds with zero mathematical hallucination.\n"
        "4. Multimodal Accessibility: Features a draggable 3D animated mascot, Web Speech API voice input, and Text-to-Speech audio narration.",
        bold_prefix="How It Works: "
    )

    # Feature 2: Filter-Based Story Studio
    add_h2("Feature 2: Filter-Based Story Studio (Narrative Engine)")
    add_body(
        "Translates complex multidimensional geospatial tensors into structured, plain-language narrative chapters tailored for policymakers, citizens, and researchers.",
        bold_prefix="Description: "
    )
    add_body(
        "src/components/story/StackedStoryCardsStudio.jsx and backend/app/routers/story.py.",
        bold_prefix="Code Location: "
    )
    add_body(
        "1. Filter Selection: The user selects a location and toggles between Time Lenses (History 2015–2024, Current, Forecasting 2026–2030) or Thematic Lenses (Urban, Water, Forest, Climate).\n"
        "2. Constrained Schema Generation: The backend builds a strict JSON prompt template containing the calculated change percentages, historical averages, and future risks. Groq Llama-3.3-70B synthesizes this into Chapter Title, Narrative Body, Key Metrics, and Strategic Takeaways.\n"
        "3. Local Caching: Responses are cached in-memory and on disk; repeated filter toggles return in under 20 milliseconds without hitting external API rate limits.",
        bold_prefix="How It Works: "
    )

    # Feature 3: Forecasting Lab
    add_h2("Feature 3: Forecasting Lab (ML Predictions & Spatio-Temporal Heatmaps)")
    add_body(
        "Interactive scenario-testing environment enabling users to project environmental, demographic, and urbanization trends into the future with dynamic spatial risk overlays.",
        bold_prefix="Description: "
    )
    add_body(
        "src/pages/ForecastPage.jsx, src/components/earth/ForecastHeatmapGlobe.jsx, backend/app/routers/predictions.py, and backend/app/routers/ml_utils.py.",
        bold_prefix="Code Location: "
    )
    add_body(
        "1. Interactive Time Slider: Users move a slider across future years (2024 to 2030/2035).\n"
        "2. Model Execution: Evaluates historical series against SARIMA (for cyclical monsoon hydrology) and XGBoost Regressors (for AQI, temperature, and built-up land ratios) achieving R² = 0.94 and RMSE = 7.12.\n"
        "3. Visual Graphs: Renders dual line graphs displaying solid historical curves (2015–2024) and dashed future trajectories with 95% confidence bands.\n"
        "4. Dynamic Density Heatmap: Overlays continuous spatial kernel density heatmaps colored by forecasted pressure: Low (Green), Medium (Yellow), and High (Red).",
        bold_prefix="How It Works: "
    )

    # Feature 4: 3D Earth Globe & Real Boundaries
    add_h2("Feature 4: 3D Earth Globe & Authentic Administrative Boundaries")
    add_body(
        "GPU-accelerated dual visualization combining an interactive 3D planetary globe with high-precision 2D cartographic boundary maps.",
        bold_prefix="Description: "
    )
    add_body(
        "src/components/earth/Earth3DViewer.jsx, CesiumEarthViewer.jsx, RealEarthMap.jsx, and src/pages/ExplorePage.jsx.",
        bold_prefix="Code Location: "
    )
    add_body(
        "1. WebGL Spherical Mapping: Three.js and Cesium WebGL convert latitude and longitude coordinates into 3D Cartesian space (x, y, z) on a textured planetary sphere at 60 FPS.\n"
        "2. Authentic GeoJSON Vectors: Replaced synthetic circle approximations with genuine OpenStreetMap MultiPolygon boundaries for Kolhapur, Karveer, Panhala, Shirol, and Hatkanangle normalized to EPSG:4326.\n"
        "3. Level-of-Detail (LOD) Optimization: Utilizes the Ramer-Douglas-Peucker algorithm to decimate polygon vertices by 45%, preventing browser GPU memory leaks and maintaining 60 FPS performance on standard hardware.",
        bold_prefix="How It Works: "
    )

    # Feature 5: Multi-Source Image Retrieval
    add_h2("Feature 5: Multi-Source Real Image Retrieval Pipeline")
    add_body(
        "Automated photo retrieval service that fetches verified photographs of regional landmarks, heritage monuments, and cultural items.",
        bold_prefix="Description: "
    )
    add_body(
        "backend/app/services/location_image_service.py and backend/app/routers/location_images.py.",
        bold_prefix="Code Location: "
    )
    add_body(
        "1. Tiered Multi-API Fetching: Queries Google Places API & Photos and Wikimedia Commons as primary sources for verified local landmarks (Rankala Lake, Panhala Fort, Mahalaxmi Temple); falls back to Unsplash and Pexels for generic nature and landscape photos.\n"
        "2. 5 Categorized Buckets: Automatically organizes photos into Landmarks, Culture & Temples, Traditional Cuisine (Kolhapuri Misal), Landscapes, and Local Markets.\n"
        "3. 24-Hour Disk Caching: Stores retrieved image URLs locally, eliminating external API latency on repeat visits.",
        bold_prefix="How It Works: "
    )

    # Feature 6: Comparison Matrix
    add_h2("Feature 6: Location Comparison Matrix")
    add_body(
        "Cross-regional benchmarking module allowing side-by-side comparison between Kolhapur and peer districts.",
        bold_prefix="Description: "
    )
    add_body(
        "src/pages/ComparePage.jsx and backend/app/routers/compare.py.",
        bold_prefix="Code Location: "
    )
    add_body(
        "1. Comparative Data Extraction: Queries multi-variable parameters for both chosen locations (e.g. Kolhapur vs Pune or Sangli).\n"
        "2. Side-by-Side Visualization: Renders comparative scorecards across Green Canopy (NDVI), AQI, Water Sustainability Index, and Population Density.",
        bold_prefix="How It Works: "
    )

    # =========================================================================
    # 4. SYSTEM ARCHITECTURE & CODEBASE MAPPING
    # =========================================================================
    add_h1("4. System Architecture & Codebase Mapping")

    arch_data = [
        ("Data Preprocessing", "backend/data/colab_notebook.ipynb\nbackend/data/check_data.py\nsrc/data/locations.js", "GeoPandas, Rasterio, Shapely, Pandas", "Standardizes CRS to EPSG:4326, clips 100m WorldPop rasters, cleans null sensor series, outputs unified JSON schema."),
        ("ML Forecasting & Analytics", "backend/app/routers/ml_utils.py\nbackend/app/routers/predictions.py\nbackend/app/routers/clusters.py", "XGBoost, SARIMA, Scikit-learn", "DBSCAN clustering for hotspots; SARIMA for monsoon hydrology; XGBoost for multi-variable projections through 2030 (R² = 0.94)."),
        ("NLP Storytelling Engine", "backend/app/routers/story.py\nsrc/components/story/StackedStoryCardsStudio.jsx", "Groq Cloud LPUs, Meta Llama-3.3-70B", "Grounded JSON prompt architecture generating structured story chapters across History, Current, and Future lenses in < 800 ms."),
        ("Conversational AI Agent", "src/components/common/GeoAIAssistant.jsx\nsrc/services/placeQAService.js", "React, Web Speech API, Groq Cloud", "Autonomous agent with live perception: executes auto-navigation camera flights, switches pages, and gives grounded answers."),
        ("3D Planetary Visualization", "src/components/earth/Earth3DViewer.jsx\nsrc/components/earth/ForecastHeatmapGlobe.jsx", "Three.js, WebGL, Leaflet, OSM GeoJSON", "60 FPS 3D Earth Globe with spherical coordinates, authentic OSM taluka boundaries, and Low/Med/High density heatmaps."),
        ("Image Retrieval Service", "backend/app/services/location_image_service.py", "Google Places API, Wikimedia, Unsplash, Pexels", "Tiered 4-API photo pipeline with 5 categorical buckets and 24-hr disk caching for authentic local heritage photos.")
    ]

    t_arch = doc.add_table(rows=len(arch_data) + 1, cols=4)
    t_arch.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_arch, BORDER_HEX)
    set_table_margins(t_arch, top=60, bottom=60, left=80, right=80)

    h_arch = t_arch.rows[0].cells
    widths_a = [Inches(1.5), Inches(2.0), Inches(1.5), Inches(2.0)]
    cols_a = ["Subsystem", "Key Files in Code", "Technologies Used", "Core Functionality"]

    for i in range(4):
        h_arch[i].width = widths_a[i]
        set_cell_shading(h_arch[i], HEADER_BG)
        p = h_arch[i].paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(cols_a[i])
        format_run(r, font_size=9, bold=True, color=COLOR_PRIMARY)

    for idx, (sub, files, tech, fn) in enumerate(arch_data, start=1):
        row = t_arch.rows[idx]
        cells = row.cells
        for i, val in enumerate([sub, files, tech, fn]):
            cells[i].width = widths_a[i]
            cells[i].vertical_alignment = WD_ALIGN_VERTICAL.TOP
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            if i == 0:
                set_cell_shading(cells[i], ROW_BG_ALT)
                format_run(r, font_size=8.5, bold=True, color=COLOR_SECONDARY)
            else:
                set_cell_shading(cells[i], "FFFFFF")
                format_run(r, font_size=8.5, color=COLOR_BODY)

    # =========================================================================
    # 5. KEY EXPERIMENTAL RESULTS & METRICS
    # =========================================================================
    add_h1("5. Key Experimental Results & Performance Metrics")
    add_bullet("Predictive Accuracy (R² = 0.94)", "XGBoost Regressor achieved R² = 0.94 (RMSE = 7.12) on multi-year validation splits, outperforming linear regression (R² = 0.44) and standard ARIMA (R² = 0.62).")
    add_bullet("Story Synthesis Latency (< 800 ms)", "Groq Cloud LPUs running Llama-3.3-70B generate complete multi-chapter dossiers in ~780 milliseconds, cutting cloud latency by 81% compared to standard cloud LLMs (4.2 seconds).")
    add_bullet("Visual Landmark Accuracy (96.4%)", "Tiered retrieval prioritizing Google Places API and Wikimedia Commons eliminated photo hallucinations (32% relevance on Unsplash alone improved to 96.4%).")
    add_bullet("Rendering Performance (60 FPS, 280 MB RAM)", "Ramer-Douglas-Peucker vertex decimation and WebGL context lifecycle management reduced client RAM from 1.8 GB to 280 MB and ensured fluid 60 FPS performance.")
    add_bullet("Zero Build Errors", "Verified with npm run build: compiles with 0 errors, 0 broken imports, and 0 lint warnings.")

    # =========================================================================
    # 6. VIVA VOCE DEFENSE & EXAMINER QUESTIONS
    # =========================================================================
    add_h1("6. Viva Voce Defense & Examiner Questions")

    qas = [
        ("Q1: Is GeoBot just a chatbot or an AI agent?",
         "GeoBot is an AI Agent because it possesses Perception, Reasoning, and Action. It perceives active map coordinates and telemetry, reasons over user intent, and autonomously executes actions—flying the 3D globe camera to mentioned places and switching views—while answering questions strictly grounded in domain data without hallucination."),
        ("Q2: Why did you use XGBoost instead of Deep Learning (LSTM)?",
         "Regional sensor series have hundreds of monthly datapoints, not millions. LSTMs heavily overfit on smaller tabular datasets. XGBoost with gradient-boosted decision trees handles non-linear tabular interactions optimally, achieving high generalization accuracy (R² = 0.94)."),
        ("Q3: How do you guarantee the AI doesn't hallucinate facts in stories?",
         "We use a strictly constrained JSON prompt schema. We inject the calculated statistical indicators (historical change %, current metrics, projected risks) directly into the prompt and instruct the LLM: 'Only summarize these verified metrics; do not fabricate external numbers.' This guarantees 0% hallucination on data values."),
        ("Q4: Why did you use Groq Cloud LPUs?",
         "Standard cloud GPUs take 3 to 5 seconds to generate text, which causes disruptive lag in interactive map applications. Groq LPUs run inference in hardware at 300+ tokens/sec, returning complete dossiers in under 800 milliseconds."),
        ("Q5: Where was the data preprocessing performed?",
         "Data preprocessing was executed in Python using GeoPandas, Rasterio, Shapely, and Pandas (documented in backend/data/colab_notebook.ipynb and ml_utils.py). It normalized coordinate systems to EPSG:4326, clipped 100m satellite rasters, filtered NoData pixels, and generated our clean JSON schema.")
    ]

    for q, a in qas:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(2)
        r_q = p.add_run(f"• {q}\n")
        format_run(r_q, font_size=9.5, bold=True, color=COLOR_SECONDARY)
        r_a = p.add_run(f"   Answer: {a}")
        format_run(r_a, font_size=9.5, color=COLOR_BODY)

    doc.save(output_path)
    print(f"Successfully generated: {output_path}")

if __name__ == "__main__":
    create_complete_project_documentation("GeoVisionAI_Complete_Project_Documentation.docx")
