# backend/app/routers/satara.py
"""
Satara Regional Intelligence Hub & AI Tourist Guide Router.
Provides deep-dive intelligence for all 11 Talukas of Satara District,
along with an interactive AI Tourist Guide powered by Groq.
"""

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from groq import Groq
from .satara_data import SATARA_DISTRICT_META, SATARA_TALUKAS
from .ml_models import train_ml_forecast

router = APIRouter()

_groq_key = os.getenv("GROQ_API_KEY", "").strip()
_groq_client = Groq(api_key=_groq_key) if _groq_key else None


class TouristGuideRequest(BaseModel):
    taluka_id: Optional[str] = "satara-city"
    travel_type: Optional[str] = "heritage"  # "heritage" | "nature_adventure" | "food_trail" | "pilgrimage" | "complete"
    duration_days: Optional[int] = 1
    user_query: Optional[str] = None


@router.get("/overview")
async def get_district_overview():
    """Returns high-level statistics and metadata for Satara District."""
    return SATARA_DISTRICT_META


@router.get("/talukas")
async def get_all_talukas():
    """Returns summary cards and coordinates for all 11 Talukas of Satara."""
    return {
        "district": SATARA_DISTRICT_META,
        "total_talukas": len(SATARA_TALUKAS),
        "talukas": SATARA_TALUKAS,
    }


@router.get("/taluka/{taluka_id}")
async def get_taluka_detail(taluka_id: str):
    """Returns deep-dive intelligence and ML projection for a specific taluka."""
    matched = next((t for t in SATARA_TALUKAS if t["id"].lower() == taluka_id.lower() or t["name"].lower() == taluka_id.lower()), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Taluka '{taluka_id}' not found in Satara district.")

    years = [p["year"] for p in matched["population_history"]]
    vals = [p["value"] for p in matched["population_history"]]
    ml_pop = train_ml_forecast(years, vals, forecast_steps=5, model_type="random_forest")

    return {
        "taluka": matched,
        "district_meta": SATARA_DISTRICT_META,
        "population_ml_forecast": ml_pop,
    }


@router.post("/tourist-guide")
async def generate_tourist_guide(req: TouristGuideRequest):
    """
    AI Tourist Guide for Satara.
    Generates personalized itineraries, historical stories, and food guides
    grounded in the real assets of the selected taluka.
    """
    matched = next((t for t in SATARA_TALUKAS if t["id"].lower() == req.taluka_id.lower() or t["name"].lower() == req.taluka_id.lower()), None)
    if not matched:
        matched = SATARA_TALUKAS[0]  # Fallback to Satara City

    prompt = f"""
You are the official AI Tourist Guide and Cultural Historian for Satara District, Maharashtra.
The traveler is interested in exploring: {matched['name']} Taluka ({matched['marathi_name']}).
Duration: {req.duration_days} Day(s).
Travel Focus: {req.travel_type}.
Specific Question/Request: {req.user_query or 'Create a comprehensive guide with must-see spots, history, and food'}.

Context on {matched['name']} Taluka:
- Description: {matched['description']}
- Top Attractions: {', '.join([a['name'] + ' (' + a['type'] + ')' for a in matched['top_attractions']])}
- Culinary Specialties: {matched['food_trail']}
- Best Season to Visit: {matched['best_season']}
- District Heritage Context: Chhatrapati Shivaji Maharaj, Chhatrapati Shahu Maharaj I (Satara Capital 1708), Ajinkyatara Fort, Kaas Plateau UNESCO World Heritage, Sajjangad, Thoseghar Waterfalls, and Satara Kandi Pedha.

Instructions:
1. Provide a welcoming introduction highlighting why {matched['name']} is special.
2. Outline a realistic, step-by-step {req.duration_days}-Day itinerary (Morning, Afternoon, Evening) visiting the top attractions.
3. Recommend specific culinary spots and authentic dishes to try ({matched['food_trail']}).
4. Share practical travel tips (best time, road connectivity via NH-48, eco-guidelines for Kaas/Sahyadris).
Keep the tone inspiring, historically accurate, and rich in local pride.
"""

    if not _groq_client:
        # High quality offline fallback
        return {
            "guide": f"### Welcome to {matched['name']} Taluka, Satara District\n\n{matched['description']}\n\n**Top Attractions:**\n" +
                     "\n".join([f"- **{a['name']}** ({a['type']}): {a['desc']}" for a in matched['top_attractions']]) +
                     f"\n\n**Culinary Trail:** {matched['food_trail']}\n**Best Season:** {matched['best_season']}",
            "taluka": matched['name'],
            "status": "cached_offline"
        }

    try:
        completion = _groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000,
        )
        return {
            "guide": completion.choices[0].message.content,
            "taluka": matched['name'],
            "status": "generated"
        }
    except Exception as e:
        return {
            "guide": f"### Exploring {matched['name']} Taluka\n\n{matched['description']}\n\n**Top Sights:**\n" +
                     "\n".join([f"- **{a['name']}**: {a['desc']}" for a in matched['top_attractions']]),
            "taluka": matched['name'],
            "status": "fallback"
        }
