# backend/app/routers/kolhapur.py
"""
Kolhapur Regional Intelligence Hub & AI Tourist Guide Router.
Provides deep-dive intelligence for all 12 Talukas of Kolhapur District,
along with an interactive AI Tourist Guide powered by Groq.
"""

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from groq import Groq
from .kolhapur_data import KOLHAPUR_DISTRICT_META, KOLHAPUR_TALUKAS
from .ml_models import train_ml_forecast

router = APIRouter()

_groq_key = os.getenv("GROQ_API_KEY", "").strip()
_groq_client = Groq(api_key=_groq_key) if _groq_key else None


class TouristGuideRequest(BaseModel):
    taluka_id: Optional[str] = "karvir"
    travel_type: Optional[str] = "heritage"  # "heritage" | "nature_adventure" | "food_trail" | "pilgrimage" | "complete"
    duration_days: Optional[int] = 1
    user_query: Optional[str] = None


@router.get("/overview")
async def get_district_overview():
    """Returns high-level statistics and metadata for Kolhapur District."""
    return KOLHAPUR_DISTRICT_META


@router.get("/talukas")
async def get_all_talukas():
    """Returns summary cards and coordinates for all 12 Talukas of Kolhapur."""
    return {
        "district": KOLHAPUR_DISTRICT_META,
        "total_talukas": len(KOLHAPUR_TALUKAS),
        "talukas": KOLHAPUR_TALUKAS,
    }


@router.get("/taluka/{taluka_id}")
async def get_taluka_detail(taluka_id: str):
    """Returns deep-dive intelligence and ML population projection for a specific taluka."""
    matched = next((t for t in KOLHAPUR_TALUKAS if t["id"].lower() == taluka_id.lower()), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Taluka '{taluka_id}' not found in Kolhapur district.")

    years = [p["year"] for p in matched["population_history"]]
    vals = [p["value"] for p in matched["population_history"]]
    ml_pop = train_ml_forecast(years, vals, forecast_steps=5, model_type="random_forest")

    return {
        "taluka": matched,
        "district_meta": KOLHAPUR_DISTRICT_META,
        "population_ml_forecast": ml_pop,
    }


@router.post("/tourist-guide")
async def generate_tourist_guide(req: TouristGuideRequest):
    """
    AI Tourist Guide for Kolhapur.
    Generates personalized itineraries, historical stories, and food guides
    grounded in the real assets of the selected taluka.
    """
    matched = next((t for t in KOLHAPUR_TALUKAS if t["id"].lower() == req.taluka_id.lower()), None)
    if not matched:
        matched = KOLHAPUR_TALUKAS[0]  # Fallback to Karvir

    prompt = f"""
You are the official AI Tourist Guide and Cultural Historian for Kolhapur, Maharashtra.
The traveler is interested in exploring: {matched['name']} Taluka ({matched['marathi_name']}).
Duration: {req.duration_days} Day(s).
Travel Focus: {req.travel_type}.
Specific Question/Request: {req.user_query or 'Create a comprehensive guide with must-see spots, history, and food'}.

Context on {matched['name']} Taluka:
- Description: {matched['description']}
- Top Attractions: {', '.join([a['name'] + ' (' + a['type'] + ')' for a in matched['top_attractions']])}
- Culinary Specialties: {matched['food_trail']}
- Best Season to Visit: {matched['best_season']}
- District Heritage Context: Chhatrapati Shivaji Maharaj, Rajarshi Chhatrapati Shahu Maharaj, wrestling culture (Khasbag/Motibaug Talims), Kolhapuri Chappals, and jaggery.

Instructions:
1. Provide a welcoming introduction highlighting why {matched['name']} is special.
2. Outline a realistic, step-by-step {req.duration_days}-Day itinerary (Morning, Afternoon, Evening) visiting the top attractions.
3. Recommend authentic local eateries and must-taste dishes (e.g. Tambda/Pandhra Rassa, Misal, Jaggery sweets).
4. Share 2 fascinating historical or cultural anecdotes (e.g., Maratha empire connections, Shahu Maharaj's social reforms).
5. Give practical travel tips (best hours to visit, local transport, dress codes for temples).

Keep the tone enthusiastic, culturally respectful, evocative, and practical.
"""

    if _groq_client:
        try:
            res = _groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a knowledgeable and passionate tourism ambassador for Kolhapur, Maharashtra."},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=900,
                temperature=0.6,
            )
            guide_text = res.choices[0].message.content
        except Exception as e:
            guide_text = f"Guide generation error: {str(e)}"
    else:
        # High quality static guide fallback
        guide_text = (
            f"### Welcome to {matched['name']} Taluka, Kolhapur!\n\n"
            f"{matched['description']}\n\n"
            f"#### Recommended {req.duration_days}-Day Itinerary:\n"
            + "\n".join([f"- **{a['name']}** ({a['type']}): {a['desc']}" for a in matched["top_attractions"][:3]])
            + f"\n\n#### Authentic Food Trail:\n{matched['food_trail']}\n\n"
            f"#### Best Time to Visit:\n{matched['best_season']}"
        )

    return {
        "taluka": matched["name"],
        "taluka_id": matched["id"],
        "travel_type": req.travel_type,
        "duration_days": req.duration_days,
        "guide": guide_text,
        "attractions": matched["top_attractions"],
        "food_trail": matched["food_trail"],
    }
