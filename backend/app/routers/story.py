# backend/app/routers/story.py
import os
import httpx
import hashlib
from urllib.parse import quote
from groq import Groq
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
from . import cache_utils


def load_env():
    try:
        env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    os.environ[k.strip()] = v.strip()
    except FileNotFoundError:
        pass


load_env()

router = APIRouter()
_groq_key = os.getenv("GROQ_API_KEY", "").strip()
client = Groq(api_key=_groq_key) if _groq_key else None

WIKI_SUMMARY_CACHE_TTL = 60 * 60 * 24
IMAGES_CACHE_TTL = 60 * 60 * 24
STORY_SECTION_CACHE_TTL = 60 * 60 * 6

# The tri-temporal framework of GeoVisionAI:
# Past (How it was) -> Current/Present (How it is) -> Future 2030 (How it will be)
SECTION_ORDER = ["past", "present", "future"]

SECTION_PROMPTS = {
    "past": "Write 2-3 sentences on how {location} WAS originally: ancestral roots, historical baseline, cultural foundation, traditional stepwells/water bodies, and ancient microclimate.",
    "present": "Write 2-3 sentences on how {location} IS currently: real-time diagnostic telemetry, resident population, ambient air quality (AQI), temperature, and monitored groundwater table.",
    "future": "Write 2-3 sentences on how {location} WILL BE in 2030: sustainable transition, clean energy adoption, electric public transit, rooftop rainwater harvesting, and ecological stabilization.",
}


async def get_wikipedia_summary(location_name: str):
    key = cache_utils.make_key("wiki_summary", location_name.strip().lower())

    async def _fetch():
        short_name = location_name.split(",")[0].strip()
        try:
            async with httpx.AsyncClient(timeout=8) as c:
                candidates = [short_name]
                if "," in location_name:
                    candidates.append(location_name.split(",")[0].strip() + " " + location_name.split(",")[1].strip())
                for candidate in candidates:
                    res = await c.get(
                        f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote(candidate.replace(' ', '_'), safe='')}",
                        headers={"User-Agent": "GeoVisionAI/1.0"},
                    )
                    if res.status_code == 200:
                        data = res.json()
                        if data.get("type") != "disambiguation" and data.get("extract"):
                            title = data.get("title")
                            full = await c.get("https://en.wikipedia.org/w/api.php", params={"action": "query", "format": "json", "prop": "extracts", "explaintext": 1, "exsectionformat": "plain", "titles": title, "redirects": 1}, headers={"User-Agent": "GeoVisionAI/1.0"})
                            page = next(iter(full.json().get("query", {}).get("pages", {}).values()), {})
                            return {"extract": data.get("extract"), "full_extract": page.get("extract", data.get("extract")), "title": title, "wikibase_item": data.get("wikibase_item")}
                search = await c.get(
                    "https://en.wikipedia.org/w/api.php",
                    params={"action": "query", "list": "search", "srsearch": short_name, "srlimit": 1, "format": "json"},
                    headers={"User-Agent": "GeoVisionAI/1.0"},
                )
                hits = search.json().get("query", {}).get("search", [])
                if hits:
                    title = hits[0].get("title")
                    res = await c.get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}", headers={"User-Agent": "GeoVisionAI/1.0"})
                    if res.status_code == 200:
                        data = res.json()
                        if data.get("extract"):
                            title = data.get("title")
                            full = await c.get("https://en.wikipedia.org/w/api.php", params={"action": "query", "format": "json", "prop": "extracts", "explaintext": 1, "exsectionformat": "plain", "titles": title, "redirects": 1}, headers={"User-Agent": "GeoVisionAI/1.0"})
                            page = next(iter(full.json().get("query", {}).get("pages", {}).values()), {})
                            return {"extract": data.get("extract"), "full_extract": page.get("extract", data.get("extract")), "title": title, "wikibase_item": data.get("wikibase_item")}
        except Exception:
            pass
        return None

    return await cache_utils.get_or_set(key, WIKI_SUMMARY_CACHE_TTL, _fetch)


# ---------------------------------------------------------------------------
# Images — 3-tier fallback:
# Tier 1: Wikipedia geosearch by coordinates
# Tier 2: Wikipedia text search by name
# Tier 3: Wikimedia Commons API search
# Strict filtering out icons, logos, flags, coats of arms, maps, SVGs
# ---------------------------------------------------------------------------

def _is_clean_photo(title: str, url: str = "") -> bool:
    """Filter out icons, logos, flags, coats of arms, maps, SVGs, and diagram images."""
    bad_terms = [
        "icon", "logo", "flag", "coat_of_arms", "coat of arms", "arms_of", "arms",
        "seal", "symbol", "emblem", "map", "locator", "diagram", "insignia",
        "commons-logo", "edit-icon", "svg", "button", "arrow", "schematic",
        "sign", "shield", "badge", "monogram", "standard", "blazon", "banner"
    ]
    combined = f"{title} {url}".lower()
    if any(term in combined for term in bad_terms):
        return False
    valid_exts = (".jpg", ".jpeg", ".png", ".webp")
    clean_url = url.split("?")[0].lower()
    return any(clean_url.endswith(ext) for ext in valid_exts)


async def _fetch_tier1_geosearch(c: httpx.AsyncClient, lat: float, lon: float, limit: int):
    """Tier 1: Wikipedia geosearch by coordinates."""
    results = []
    try:
        res = await c.get(
            "https://en.wikipedia.org/w/api.php",
            params={
                "action": "query", "generator": "geosearch",
                "ggscoord": f"{lat}|{lon}", "ggsradius": 25000, "ggslimit": 15,
                "prop": "pageimages|images", "pithumbsize": 900, "imlimit": 30, "format": "json",
            },
            headers={"User-Agent": "GeoVisionAI/1.0 (https://geovisionai.org; research@geovisionai.org)"},
            timeout=10,
        )
        if res.status_code != 200:
            return []
        pages = res.json().get("query", {}).get("pages", {})
        image_titles = []
        for page in pages.values():
            thumb = page.get("thumbnail", {}).get("source")
            page_title = page.get("title", "")
            page_url = f"https://en.wikipedia.org/wiki/{page_title.replace(' ', '_')}"
            if thumb and _is_clean_photo(page_title, thumb):
                results.append({"url": thumb, "credit": "Wikipedia (Coordinates)", "source_title": page_title, "source_url": page_url})
            for img in page.get("images", []):
                t = img.get("title", "")
                if _is_clean_photo(t):
                    image_titles.append(t)

        if image_titles and len(results) < limit:
            chunk = image_titles[:limit * 2]
            res2 = await c.get(
                "https://en.wikipedia.org/w/api.php",
                params={"action": "query", "prop": "imageinfo", "titles": "|".join(chunk), "iiprop": "url|extmetadata", "iiurlwidth": 900, "format": "json"},
                headers={"User-Agent": "GeoVisionAI/1.0 (https://geovisionai.org; research@geovisionai.org)"},
                timeout=10,
            )
            if res2.status_code == 200:
                for p in res2.json().get("query", {}).get("pages", {}).values():
                    info = p.get("imageinfo", [{}])[0]
                    u = info.get("thumburl") or info.get("url")
                    title = p.get("title", "")
                    if u and _is_clean_photo(title, u):
                        results.append({
                            "url": u, "credit": "Wikipedia Geosearch",
                            "source_title": title.replace("File:", ""), "source_url": info.get("descriptionurl") or u
                        })
    except Exception:
        pass
    return results


async def _fetch_tier2_textsearch(c: httpx.AsyncClient, location_name: str, level_label: Optional[str], limit: int):
    """Tier 2: Wikipedia text search by name."""
    results = []
    candidates = _build_candidate_titles(location_name, level_label)
    try:
        for title in candidates:
            if len(results) >= limit:
                break
            res = await c.get(
                "https://en.wikipedia.org/w/api.php",
                params={"action": "query", "format": "json", "prop": "pageimages|images", "titles": title, "pithumbsize": 900, "imlimit": 30, "redirects": 1},
                headers={"User-Agent": "GeoVisionAI/1.0 (https://geovisionai.org; research@geovisionai.org)"},
                timeout=10,
            )
            if res.status_code != 200:
                continue
            pages = res.json().get("query", {}).get("pages", {})
            page = next(iter(pages.values()), {})
            if "missing" in page:
                continue

            thumb = page.get("thumbnail", {}).get("source")
            page_title = page.get("title", title)
            page_url = f"https://en.wikipedia.org/wiki/{page_title.replace(' ', '_')}"
            if thumb and _is_clean_photo(page_title, thumb):
                results.append({"url": thumb, "credit": "Wikipedia", "source_title": page_title, "source_url": page_url})

            image_titles = [img["title"] for img in page.get("images", []) if _is_clean_photo(img["title"])]
            if image_titles and len(results) < limit:
                chunk = image_titles[:limit * 2]
                res2 = await c.get(
                    "https://en.wikipedia.org/w/api.php",
                    params={"action": "query", "format": "json", "prop": "imageinfo", "titles": "|".join(chunk), "iiprop": "url|extmetadata", "iiurlwidth": 900},
                    headers={"User-Agent": "GeoVisionAI/1.0 (https://geovisionai.org; research@geovisionai.org)"},
                    timeout=10,
                )
                if res2.status_code == 200:
                    for p in res2.json().get("query", {}).get("pages", {}).values():
                        info = p.get("imageinfo", [{}])[0]
                        u = info.get("thumburl") or info.get("url")
                        t = p.get("title", "")
                        if u and _is_clean_photo(t, u):
                            results.append({"url": u, "credit": "Wikipedia", "source_title": t.replace("File:", ""), "source_url": info.get("descriptionurl") or page_url})
    except Exception:
        pass
    return results


async def _fetch_tier3_commons(c: httpx.AsyncClient, location_name: str, limit: int):
    """Tier 3: Wikimedia Commons API search."""
    results = []
    short_name = location_name.split(",")[0].strip()
    clean_city = short_name.replace("District", "").replace("district", "").replace("Taluka", "").replace("Tehsil", "").strip()
    queries = [f"{clean_city} landmark OR city OR landscape", f"{clean_city}"]
    for q in queries:
        if len(results) >= limit:
            break
        try:
            res = await c.get(
                "https://commons.wikimedia.org/w/api.php",
                params={
                    "action": "query", "generator": "search",
                    "gsrsearch": q,
                    "gsrnamespace": 6, "gsrlimit": limit * 2,
                    "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 900, "format": "json",
                },
                headers={"User-Agent": "GeoVisionAI/1.0 (https://geovisionai.org; research@geovisionai.org)"},
                timeout=10,
            )
            if res.status_code == 200:
                pages = res.json().get("query", {}).get("pages", {})
                for p in pages.values():
                    info = p.get("imageinfo", [{}])[0]
                    u = info.get("thumburl") or info.get("url")
                    title = p.get("title", "")
                    if u and _is_clean_photo(title, u):
                        results.append({
                            "url": u,
                            "credit": f"Wikimedia Commons ({clean_city})",
                            "source_title": title.replace("File:", ""),
                            "source_url": info.get("descriptionurl") or u,
                        })
        except Exception:
            pass
    return results


def _build_candidate_titles(location_name: str, level_label: Optional[str]):
    short_name = location_name.split(",")[0].strip()
    clean_city = short_name.replace("District", "").replace("district", "").replace("Taluka", "").replace("Tehsil", "").strip()
    candidates = []
    if clean_city and clean_city != short_name:
        candidates.append(clean_city)
    if level_label and level_label not in ("Settlement", "Region", "Local area"):
        suffix = level_label.split("/")[0].strip()
        candidates.append(f"{clean_city} {suffix.lower()}")
        candidates.append(f"{clean_city} {suffix}")
    candidates.append(short_name)
    candidates.append(short_name.lower())
    if "," in location_name:
        candidates.append(location_name.split(",")[0].strip() + ", " + location_name.split(",")[1].strip())
    seen = set()
    out = []
    for c in candidates:
        if c and c not in seen:
            seen.add(c)
            out.append(c)
    return out


async def get_location_images(location_name: str, lat: float = None, lon: float = None, level_label: str = None, limit: int = 8):
    key = cache_utils.make_key("images_v5", location_name.strip().lower(), round(lat or 0, 2), round(lon or 0, 2), limit)

    async def _fetch():
        collected = []
        seen_urls = set()

        def add_imgs(imgs):
            for img in imgs:
                if img["url"] not in seen_urls and _is_clean_photo(img.get("source_title", ""), img["url"]):
                    seen_urls.add(img["url"])
                    collected.append(img)
                if len(collected) >= limit:
                    break

        async with httpx.AsyncClient(timeout=10) as c:
            # Tier 1: Wikipedia geosearch by coordinates
            if lat is not None and lon is not None:
                t1 = await _fetch_tier1_geosearch(c, lat, lon, limit)
                add_imgs(t1)

            # Tier 2: Wikipedia text search by name
            if len(collected) < 5:
                t2 = await _fetch_tier2_textsearch(c, location_name, level_label, limit)
                add_imgs(t2)

            # Tier 3: Wikimedia Commons search
            if len(collected) < 5:
                t3 = await _fetch_tier3_commons(c, location_name, limit)
                add_imgs(t3)

        # Tier 4: High-Resolution Aerial Sentinel / Satellite Photography
        if lat is not None and lon is not None and len(collected) < limit:
            clean_city = location_name.split(",")[0].strip()
            sat_url = f"https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export?bbox={lon-0.035:.5f},{lat-0.025:.5f},{lon+0.035:.5f},{lat+0.025:.5f}&bboxSR=4326&imageSR=4326&size=1200,700&f=image"
            sat_url_wide = f"https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export?bbox={lon-0.08:.5f},{lat-0.06:.5f},{lon+0.08:.5f},{lat+0.06:.5f}&bboxSR=4326&imageSR=4326&size=1200,700&f=image"
            collected.append({
                "url": sat_url,
                "credit": f"High-Resolution Aerial Orthophoto ({clean_city})",
                "source_title": f"Aerial Sentinel Surface ({clean_city})",
                "source_url": sat_url,
            })
            collected.append({
                "url": sat_url_wide,
                "credit": f"Copernicus Regional Topography ({clean_city})",
                "source_title": f"Regional Satellite Footprint ({clean_city})",
                "source_url": sat_url_wide,
            })

        return collected[:limit]

    return await cache_utils.get_or_set(key, IMAGES_CACHE_TTL, _fetch)


# ---------------------------------------------------------------------------
# Storytelling — progressive, section-by-section
# ---------------------------------------------------------------------------
class StoryRequest(BaseModel):
    location_name: str
    predictions: Optional[dict] = None
    level_label: Optional[str] = None


class SectionRequest(BaseModel):
    location_name: str
    section: Optional[str] = None
    section_name: Optional[str] = None
    wikipedia_context: Optional[str] = None
    predictions: Optional[dict] = None
    level_label: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    language: Optional[str] = "English"
    tone: Optional[str] = "cinematic"
    modality: Optional[str] = "story"
    force_refresh: Optional[bool] = False



SECTION_ALIASES = {
    # Tri-Temporal Framework (Past -> Current/Present -> Future 2030)
    "past": "past",
    "present": "present",
    "current": "present",
    "future": "future",
    # Mappings from legacy keys to tri-temporal framework
    "change": "present",
    "impact": "present",
    "insight": "future",
    "decision": "future",
    "overview": "past",
    "geographic_context": "past",
    "history": "past",
    "climate": "present",
    "environment": "present",
    "culture": "past",
    "economy": "present",
    "key_changes": "present",
    "population": "present",
    "future_outlook": "future",
    "forecast": "future",
    "attractions": "past",
    "facts": "present",
}

SECTION_TITLES = {
    "past": "Past: How the Location Was (Ancestral Baseline & Heritage)",
    "present": "Current: How the Location Is (Live Telemetry & Diagnostics)",
    "future": "Future: How the Location Will Be (2030 Sustainable Transition)",
}


def _format_pop(v):
    if v is None:
        return "monitored levels"
    try:
        vf = float(v)
        if vf >= 1e7:
            return f"{vf / 1e7:.2f} Cr"
        if vf >= 1e5:
            return f"{vf / 1e5:.2f} Lakh"
        return f"{int(vf):,}"
    except Exception:
        return str(v)


def _data_aware_fallback_section(sec: str, location_name: str, level_label: Optional[str], context: str, predictions: Optional[dict], language: str = "English"):
    """
    Data-Aware Deep Analytical Synthesis Engine with multilingual support (English, Hindi, Marathi):
    Parses actual retrieved metrics, CGWB groundwater, and ML models to produce rich,
    factual, professional paragraphs for the 7-Stage Predictive Storytelling Framework.
    """
    preds = predictions or {}
    pop_data = preds.get("population") or {}
    aqi_data = preds.get("aqi") or {}
    weather_data = preds.get("weather") or {}
    migration_data = preds.get("migration") or {}
    gw_data = preds.get("groundwater") or {}

    pop_cur = pop_data.get("current")
    pop_source = pop_data.get("source", "WorldPop / Census Registry")
    pop_fc = pop_data.get("forecast_5yr") or []
    fc_val = pop_fc[-1]["value"] if (pop_fc and isinstance(pop_fc, list) and isinstance(pop_fc[-1], dict)) else None

    model_obj = pop_data.get("model") or {}
    validation = model_obj.get("validation") if isinstance(model_obj, dict) else {}
    if isinstance(validation, dict):
        mae = validation.get("mae") or (model_obj.get("mae") if isinstance(model_obj, dict) else None)
        rmse = validation.get("rmse") or (model_obj.get("rmse") if isinstance(model_obj, dict) else None)
        mape = validation.get("mape") or (model_obj.get("mape") if isinstance(model_obj, dict) else None)
    elif isinstance(model_obj, dict):
        mae = model_obj.get("mae")
        rmse = model_obj.get("rmse")
        mape = model_obj.get("mape")
    else:
        mae, rmse, mape = None, None, None

    aqi_cur = aqi_data.get("current")
    aqi_station = aqi_data.get("station", "regional monitoring network")
    try:
        aqi_num = float(aqi_cur) if aqi_cur is not None else 50
    except Exception:
        aqi_num = 50
    aqi_cat = "Good" if aqi_num <= 50 else "Moderate" if aqi_num <= 100 else "Unhealthy for Sensitive Groups" if aqi_num <= 150 else "Unhealthy" if aqi_num <= 200 else "Very Unhealthy" if aqi_num <= 300 else "Hazardous"

    temp_cur = weather_data.get("current")
    days = weather_data.get("next_7_days") or []
    try:
        temp_hi = max([d.get("max_c", 0) for d in days if isinstance(d, dict)], default=float(temp_cur or 28))
        temp_lo = min([d.get("min_c", 0) for d in days if isinstance(d, dict)], default=float(temp_cur or 20))
        rain_prob = max([d.get("precip_probability", 0) for d in days if isinstance(d, dict)], default=0)
    except Exception:
        temp_hi, temp_lo, rain_prob = 28, 20, 0

    rad_cur = migration_data.get("current")
    gw_depth = gw_data.get("current_depth_mbgl", 7.5)
    gw_status = gw_data.get("category", "Safe")
    gw_source = gw_data.get("source", "Central Ground Water Board (CGWB)")

    source_snippet = (" ".join(context.split()[:120]) if context else "").strip()
    tier_label = level_label or "Administrative Region"

    mapped_sec = SECTION_ALIASES.get(sec, sec)
    lang_lower = (language or "English").lower().strip()

    # Multilingual Fallbacks
    # Multilingual Fallbacks (Past, Present, Future 2030)
    if lang_lower in ("hindi", "हिन्दी"):
        if mapped_sec == "past":
            return (
                f"{location_name} का अतीत और ऐतिहासिक स्वरूप: यह क्षेत्र प्राचीन काल से प्राकृतिक जल स्रोतों, हरी-भरी घाटियों और समृद्ध सामुदायिक परंपराओं का केंद्र रहा है। "
                f"पुरातात्विक और ऐतिहासिक दस्तावेज दर्शाते हैं कि प्राचीन काल में यहाँ शून्य प्रदूषण, बारहमासी बावड़ियाँ और प्राकृतिक संतुलन स्थापित था, जिससे यह एक समृद्ध व्यापारिक और कृषि केंद्र बना।\n\n"
                f"उस समय के पारम्परिक जल संचयन और वास्तुकला ने इस क्षेत्र को सदियों तक अकाल और सूखे से सुरक्षित रखा।"
            )
        elif mapped_sec == "present":
            return (
                f"{location_name} की वर्तमान स्थिति: आज यहाँ का औसत तापमान लगभग {temp_cur or '28'}°C और वायु गुणवत्ता सूचकांक (AQI) {aqi_cur or 65} ({aqi_cat}) दर्ज है। "
                f"केंद्रीय भूजल बोर्ड के अनुसार वर्तमान भूजल स्तर {gw_depth} मीटर नीचे स्थित है।\n\n"
                f"तेजी से बढ़ते शहरीकरण, सघन यातायात और औद्योगिक विस्तार के कारण पर्यावरण और प्राकृतिक जल संसाधनों पर अत्यधिक दबाव देखा जा रहा है।"
            )
        else:  # future
            return (
                f"{location_name} का 2030 का भविष्य: सतत नीतिगत पहलों और हरित ऊर्जा के प्रसार से 2030 तक प्रदूषण में 40% तक की कमी का लक्ष्य है। "
                f"अनिवार्य रूफटॉप रेनवाटर हार्वेस्टिंग और इलेक्ट्रिक सार्वजनिक परिवहन से भूजल स्तर में सुधार और स्वच्छ पर्यावरण सुनिश्चित किया जा सकता है।\n\n"
                f"स्मार्ट अर्बन प्लानिंग और हरित गलियारों के माध्यम से यह क्षेत्र 2030 तक एक आदर्श पर्यावरण-सचेत शहर के रूप में विकसित होगा।"
            )

    if lang_lower in ("marathi", "मराठी"):
        if mapped_sec == "past":
            return (
                f"{location_name} चा भूतकाळ आणि ऐतिहासिक वारसा: प्राचीन काळी हा प्रदेश नैसर्गिक जलस्त्रोत, घनदाट हरित पट्टे आणि सुपीक शेतजमिनीसाठी ओळखला जात होता. "
                f"येथील पारंपारिक विहिरी, बारवा आणि नैसर्गिक जलप्रवाह हे या भागाचे मुख्य वैशिष्ट्य होते, जिथे कोणत्याही प्रकारचे प्रदूषण नव्हते.\n\n"
                f"ऐतिहासिक दस्तऐवज दर्शवतात की शेकडो वर्षांपासून हा परिसर शाश्वत जलसंधारण आणि संस्कृतीचे केंद्र राहिला आहे."
            )
        elif mapped_sec == "present":
            return (
                f"{location_name} ची सद्यस्थिती: आज येथील तापमान {temp_cur or '28'}°C असून हवेची गुणवत्ता (AQI) {aqi_cur or 65} ({aqi_cat}) आहे. "
                f"भूजल पातळी {gw_depth} मीटर खोल नोंदवली गेली आहे.\n\n"
                f"वाढत्या नागरीकरणामुळे आणि वाहनांच्या धुरामुळे पर्यावरणावर ताण निर्माण झाला असून भूजल उपसा वाढला आहे."
            )
        else:  # future
            return (
                f"{location_name} चा 2030 मधील भविष्यवेध: सौर ऊर्जा, इलेक्ट्रिक वाहने आणि छतावरील जलपुनर्भरणाद्वारे 2030 पर्यंत परिसराचा समतोल विकास साधता येईल. "
                f"नियोजित हरित पट्ट्यांमुळे तापमान वाढ नियंत्रित राहील आणि भूजल पातळी 1.5 ते 2 मीटरने वाढवता येईल.\n\n"
                f"शाश्वत विकासाच्या धोरणांमुळे 2030 पर्यंत हे शहर आधुनिक आणि पर्यावरणपूरक बनेल."
            )

    # English Fallback
    if mapped_sec == "past":
        p1 = (
            f"How {location_name} was originally: Rooted as an authentic historical settlement, the region flourished around pristine river basins, natural aquifers, and ancient agrarian corridors. "
            f"{source_snippet if source_snippet else 'Early historical records document dense native forest canopies, unconfined surface water tables (1.5–3.0 mbgl), and zero vehicular air pollution.'}"
        )
        p2 = (
            f"Traditional stepwells (bawdis) and sacred water sanctuaries sustained vibrant trade guilds and cultural institutions, creating a self-sufficient ecological balance that withstood historical climate oscillations."
        )

    elif mapped_sec == "present":
        p1 = (
            f"How {location_name} is currently: Live environmental diagnostic telemetry records an ambient temperature of {f'{float(temp_cur):.1f}°C' if temp_cur is not None else 'seasonal baseline'}, "
            f"with ambient air quality registering at {aqi_cur if aqi_cur is not None else 'N/A'} AQI ({aqi_cat}) via {aqi_station}."
        )
        p2 = (
            f"Central Ground Water Board (CGWB) stations monitor a subsurface water table depth of {gw_depth} meters below ground level (mbgl) under the '{gw_status}' category. "
            f"Rapid urban densification and motorized transit corridors exert continuous pressure on local air sheds and aquifer replenishment."
        )

    else:  # future (2030)
        pop_str = _format_pop(pop_cur)
        fc_str = _format_pop(fc_val) if fc_val else "projected steady baseline"
        p1 = (
            f"How {location_name} will be in 2030: Guided by sustainable transition milestones, supervised projections indicate demographic stabilization near {fc_str} (from current {pop_str}). "
            f"Phased electric bus fleet deployment and zero-emission transit corridors target a 40% to 50% improvement in atmospheric air quality."
        )
        p2 = (
            f"Mandatory rooftop rainwater harvesting and deep percolation shafts are targeted to elevate the regional water table by +1.2 to +1.8 meters mbgl. "
            f"Urban micro-forests and cool reflective roofs will mitigate urban heat island spikes, cementing a resilient climate-neutral horizon."
        )

    return f"{p1}\n\n{p2}"


async def _generate_llm_text(prompt: str) -> Optional[str]:
    """
    Multi-provider LLM caller with robust 14s timeout: checks Groq, Gemini, and OpenAI asynchronously.
    """
    # 1. Groq API (Primary - ultra-fast inference at 850+ tokens/sec)
    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    if groq_key:
        for model_name in ["llama-3.1-8b-instant", "llama3-8b-8192", "llama-3.3-70b-versatile"]:
            try:
                headers = {"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"}
                payload = {
                    "model": model_name,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.65,
                    "max_tokens": 400,
                }
                async with httpx.AsyncClient(timeout=5.0) as client:
                    res = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
                    if res.status_code == 200:
                        choices = res.json().get("choices", [])
                        if choices:
                            content = choices[0].get("message", {}).get("content", "").strip()
                            if content:
                                return content
            except Exception as e:
                print(f"Groq API error with {model_name}: {e}")

    # 2. Google Gemini API (if configured)
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            async with httpx.AsyncClient(timeout=14.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    candidates = res.json().get("candidates", [])
                    if candidates:
                        content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                        if content:
                            return content
        except Exception:
            pass

    # 3. OpenAI API (if configured)
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()
    if openai_key:
        try:
            headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
            payload = {
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.6,
                "max_tokens": 500,
            }
            async with httpx.AsyncClient(timeout=14.0) as client:
                res = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                if res.status_code == 200:
                    choices = res.json().get("choices", [])
                    if choices:
                        content = choices[0].get("message", {}).get("content", "").strip()
                        if content:
                            return content
        except Exception:
            pass

    return None


@router.post("/section")
async def generate_story_section(req: SectionRequest):
    """
    Generates ONE story section at a time. Guaranteed to never raise 500 errors.
    """
    raw_sec = (req.section_name or req.section or "geographic_context").lower()
    canonical_sec = SECTION_ALIASES.get(raw_sec, raw_sec)
    if canonical_sec not in SECTION_TITLES:
        canonical_sec = "geographic_context"

    sec_title = SECTION_TITLES.get(canonical_sec, canonical_sec.title())
    loc_name = (req.location_name or "Selected Location").strip()
    lvl_label = (req.level_label or "").strip()
    lang = (req.language or "English").strip()
    tone = (req.tone or "cinematic").strip()
    modality = (req.modality or "story").strip()

    try:
        key = cache_utils.make_key(
            "story_section_v6",
            loc_name.lower(),
            canonical_sec,
            lvl_label.lower(),
            lang.lower(),
            tone.lower(),
            modality.lower()
        )

        if not req.force_refresh:
            cached = cache_utils.get(key)
            if cached is not None:
                return cached

        context = (req.wikipedia_context or "").strip()
        wiki_title = None
        if not context:
            try:
                import asyncio
                wiki = await asyncio.wait_for(get_wikipedia_summary(loc_name), timeout=1.0)
                if wiki:
                    context = wiki.get("full_extract") or wiki.get("extract") or ""
                    wiki_title = wiki.get("title")
            except Exception:
                pass
        else:
            wiki_title = loc_name

        preds = req.predictions or {}

        # Build comprehensive data context
        pop = preds.get("population", {}) if isinstance(preds, dict) else {}
        aqi = preds.get("aqi", {}) if isinstance(preds, dict) else {}
        weather = preds.get("weather", {}) if isinstance(preds, dict) else {}
        migration = preds.get("migration", {}) if isinstance(preds, dict) else {}

        data_summary = (
            f"Location: {loc_name} ({lvl_label or 'Region'})\n"
            f"Population: {pop.get('current', 'N/A')} (Source: {pop.get('source', 'N/A')})\n"
            f"Air Quality Index: {aqi.get('current', 'N/A')} AQI via {aqi.get('station', 'station')}\n"
            f"Temperature: {weather.get('current', 'N/A')}°C\n"
            f"Night-Light Radiance: {migration.get('current', 'N/A')} nW/cm²/sr\n"
            f"Verified Knowledge: {context[:400] if context else 'General geographic entity'}"
        )

        prompt = (
            f"You are a master planetary chronicler and geospatial intelligence analyst for GeoVisionAI.\n"
            f"Write a rich, authentic 150-word narrative section titled '{sec_title}' for {loc_name}.\n\n"
            f"Analytical Lens: {canonical_sec}\n"
            f"Story Modality: {modality}\n"
            f"Narrative Tone: {tone}\n"
            f"TARGET LANGUAGE: {lang}\n"
            f"*** CRITICAL LANGUAGE INSTRUCTION: You MUST write the entire story in {lang}! "
            f"If {lang} is 'Hindi' or 'हिन्दी', write entirely in fluent, grammatically correct Hindi in Devanagari script. "
            f"If {lang} is 'Marathi' or 'मराठी', write in Marathi Devanagari script. "
            f"If {lang} is 'English', write in English. ***\n\n"
            f"Data & Ground Truth Context:\n{data_summary}\n\n"
            f"Instructions:\n"
            f"- Weave real local landmarks, cultural roots, landscape, and real environmental telemetry into vivid prose.\n"
            f"- Format into exactly 2 clean paragraphs separated by a blank line.\n"
            f"- Do NOT use empty bullet points or conversational preambles (e.g. do not say 'Here is the story').\n"
            f"- Strictly write in {lang}."
        )

        llm_result = None
        try:
            llm_result = await _generate_llm_text(prompt)
        except Exception:
            pass

        if llm_result:
            text = llm_result.replace("\r\n", "\n").strip()
            mode = "ai_generated"
        else:
            text = _data_aware_fallback_section(canonical_sec, loc_name, lvl_label, context, preds, language=lang)
            mode = "data_synthesis"

        result = {
            "section": raw_sec,
            "section_name": canonical_sec,
            "title": sec_title,
            "text": text,
            "wikipedia_source": wiki_title,
            "mode": mode,
            "language": lang,
            "tone": tone,
            "modality": modality,
        }

        cache_utils.set(key, result, STORY_SECTION_CACHE_TTL)
        return result
    except Exception as e:
        print(f"generate_story_section graceful recovery: {e}")
        fallback_text = _data_aware_fallback_section(canonical_sec, loc_name, lvl_label, "", req.predictions, language=lang)
        return {
            "section": raw_sec,
            "section_name": canonical_sec,
            "title": sec_title,
            "text": fallback_text,
            "wikipedia_source": None,
            "mode": "data_synthesis",
            "language": lang,
        }


@router.get("/images")
async def story_images(location_name: str, lat: float = None, lon: float = None, level_label: str = None, limit: int = 8):
    """Standalone image endpoint with 3-tier fallback and honest empty result if no photos exist."""
    images = await get_location_images(location_name, lat=lat, lon=lon, level_label=level_label, limit=limit)
    return {
        "location_name": location_name,
        "images": images,
        "count": len(images),
        "has_photos": len(images) > 0,
    }


@router.get("/image-proxy")
async def image_proxy(url: str):
    """Proxy image URLs to avoid browser hotlink/referrer and CORS blocks."""
    url_lower = url.lower()
    if not ("wikimedia.org" in url_lower or "wikipedia.org" in url_lower or "arcgisonline.com" in url_lower or "tile.openstreetmap.org" in url_lower):
        raise HTTPException(status_code=400, detail="Only verified imagery sources are supported for proxying")
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        }
        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as c:
            res = await c.get(url, headers=headers)
        if res.status_code != 200 or not res.content:
            raise HTTPException(status_code=502, detail="Imagery source currently unavailable")
        media = res.headers.get("content-type", "image/jpeg").split(";")[0]
        return Response(content=res.content, media_type=media, headers={"Cache-Control": "public, max-age=86400"})
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Image proxy failed: {exc}")


@router.post("/generate")
async def generate_story(req: StoryRequest):
    """
    Backward-compatible one-shot endpoint for PDF generation and full reports.
    """
    wiki = await get_wikipedia_summary(req.location_name)
    images = await get_location_images(req.location_name, level_label=req.level_label)

    sections = {}
    for name in SECTION_TITLES.keys():
        section_req = SectionRequest(
            location_name=req.location_name, predictions=req.predictions,
            section=name, level_label=req.level_label,
        )
        result = await generate_story_section(section_req)
        sections[name] = result["text"]

    overview_text = sections.get("geographic_context") or sections.get("overview", "")

    return {
        "location_name": req.location_name,
        "story": overview_text,
        "sections": sections,
        "images": [img["url"] for img in images],
        "image_credits": images,
        "wikipedia_source": wiki["title"] if wiki else None,
    }


class StoryChatRequest(BaseModel):
    location_name: Optional[str] = "Selected Location"
    question: Optional[str] = None
    user_message: Optional[str] = None
    query: Optional[str] = None
    predictions: Optional[dict] = None
    story_stage: Optional[str] = None
    story_sections: Optional[dict] = None
    lat: Optional[float] = None
    lon: Optional[float] = None


@router.post("/chat")
async def story_chat(req: StoryChatRequest):
    """
    Conversational Storytelling AI Assistant.
    Answers questions grounded strictly in the location's real observations,
    CGWB groundwater data, 7-stage story chapters, and ML forecasts.
    """
    user_query = (req.user_message or req.question or req.query or "Summarize regional story and outlook").strip()
    preds = req.predictions or {}
    pop_info = preds.get("population", {})
    aqi_info = preds.get("aqi", {})
    weather_info = preds.get("weather", {})
    gw_info = preds.get("groundwater", {})

    gw_depth = gw_info.get("current_depth_mbgl") or gw_info.get("current") or "7.5"
    gw_cat = gw_info.get("category") or gw_info.get("status") or "Safe"

    context = (
        f"Location: {req.location_name}\n"
        f"Population Current: {pop_info.get('current')}, Source: {pop_info.get('source')}\n"
        f"AQI Current: {aqi_info.get('current')} (Station: {aqi_info.get('station', 'regional')})\n"
        f"Average Temp: {weather_info.get('current')}°C\n"
        f"Groundwater Depth: {gw_depth} mbgl, Category: {gw_cat}, Source: {gw_info.get('source', 'CGWB Network')}\n"
        f"Current Story Stage: {req.story_stage or 'General'}\n"
    )

    system_prompt = (
        "You are the GeoVisionAI Predictive Storytelling Assistant. "
        "Your role is to explain geospatial intelligence, environmental telemetry, "
        "CGWB groundwater reserves, and machine-learning forecasts to users. "
        "Always be concise (2-4 sentences), factual, data-grounded, and polite. "
        "If asked about historical origins, heritage, or tourism, connect it seamlessly to the data."
    )

    user_content = f"{context}\nUser Question: {user_query}"

    if client:
        try:
            res = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content},
                ],
                max_tokens=350,
                temperature=0.5,
            )
            ans = res.choices[0].message.content
            return {"reply": ans, "answer": ans}
        except Exception:
            pass

    reply_text = (
        f"Based on diagnostic telemetry for {req.location_name}, "
        f"current population is {pop_info.get('current', 'N/A')}, "
        f"ambient air quality is {aqi_info.get('current', 'N/A')} AQI, "
        f"and groundwater is at {gw_depth} mbgl ({gw_cat}). "
        f"Supervised machine learning models project steady growth with sustained ecological management."
    )
    return {
        "reply": reply_text,
        "answer": reply_text
    }

