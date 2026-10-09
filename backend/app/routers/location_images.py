# backend/app/routers/location_images.py
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, Dict, Any
from app.services.location_image_service import LocationImageService, CATEGORIES_META

router = APIRouter()

@router.get("/images")
async def get_location_images(
    location: str = Query(..., description="Target city, taluka, district, or global location name"),
    category: Optional[str] = Query(None, description="Optional category filter (e.g. 'food', 'tourist_attractions', 'history')"),
    lat: Optional[float] = Query(None, description="Latitude of the location"),
    lon: Optional[float] = Query(None, description="Longitude of the location"),
    limit: Optional[int] = Query(6, ge=1, le=20, description="Max images per category")
):
    """
    Location-Based Image Retrieval System Endpoint.
    Retrieves real photographs across Google Places, Wikimedia Commons,
    Unsplash, and Pexels organized into 5 standardized categories:
    1. Tourist Attractions
    2. Historical Places
    3. Famous Local Food
    4. Nature & Scenery
    5. Local Culture & Markets
    """
    if not location or not location.strip():
        raise HTTPException(status_code=400, detail="Location parameter is required")
        
    try:
        result = await LocationImageService.get_categorized_images(
            location=location,
            category=category,
            lat=lat,
            lon=lon,
            limit_per_category=limit or 6
        )
        return result
    except Exception as e:
        print(f"[location_images] Error retrieving images for {location}: {e}")
        return {
            "location": location,
            "coordinates": {"lat": lat, "lng": lon} if lat and lon else None,
            "totalImages": 0,
            "categories": []
        }

@router.get("/categories")
async def get_supported_categories():
    """
    Returns the 5 standardized image categories and metadata.
    """
    return {
        "categories": [
            {
                "id": c["id"],
                "name": c["name"],
                "description": c["description"]
            }
            for c in CATEGORIES_META
        ]
    }
