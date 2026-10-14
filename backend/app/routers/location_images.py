# backend/app/routers/location_images.py
from fastapi import APIRouter, Query, HTTPException, Response
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from app.services.location_image_service import LocationImageService, CATEGORIES_META
from app.services.google_usage_tracker import GoogleUsageTracker

router = APIRouter()


class UsageConfigUpdate(BaseModel):
    max_monthly_allowance: Optional[int] = Field(None, ge=10, le=100000, description="Max Google requests allowed per month")
    threshold_info_pct: Optional[float] = Field(None, ge=1.0, le=99.0, description="Informational warning percentage")
    threshold_warning_pct: Optional[float] = Field(None, ge=1.0, le=99.0, description="Prominent warning percentage")
    threshold_pause_pct: Optional[float] = Field(None, ge=1.0, le=99.0, description="Hard cutoff pause percentage")
    is_manually_paused: Optional[bool] = Field(None, description="Administrator manual pause flag")
    clear_quota_error: Optional[bool] = Field(None, description="Clear quota exceeded error state")


class ResetCycleRequest(BaseModel):
    verification_note: Optional[str] = Field("Admin Confirmed Reset", description="Verification source or confirmation")


@router.get("/images")
async def get_location_images(
    location: str = Query(..., description="Target city, taluka, district, or global location name"),
    category: Optional[str] = Query(None, description="Optional category filter (e.g. 'famous_food', 'tourist_attractions')"),
    lat: Optional[float] = Query(None, description="Latitude of the location"),
    lon: Optional[float] = Query(None, description="Longitude of the location"),
    limit: Optional[int] = Query(6, ge=1, le=20, description="Max images per category")
):
    """
    Location-Based Image Retrieval System Endpoint.
    - Primary: Google Places Photos (enforced by GoogleUsageTracker budget limit).
    - Backup: Wikimedia Commons, Wikipedia, Curated Regional Registries, Unsplash, Pexels.
    - Automatic Fallback: Seamlessly activates backup if Google is paused or limit is reached.
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
            "categories": [],
            "googleUsage": GoogleUsageTracker.get_status()
        }


@router.get("/google-usage")
async def get_google_usage():
    """
    Returns current Google Places API usage, estimated request allowance,
    warning thresholds, and budget protection status.
    """
    return GoogleUsageTracker.get_status()


@router.post("/google-usage/config")
async def update_google_usage_config(payload: UsageConfigUpdate):
    """
    Configures Google Places usage thresholds, max monthly allowance,
    or manually pauses/resumes Google image retrieval.
    """
    updates = payload.model_dump(exclude_unset=True)
    new_status = GoogleUsageTracker.update_config(updates)
    return {
        "success": True,
        "message": "Google Places usage configuration updated successfully.",
        "config": new_status
    }


@router.post("/google-usage/reset")
async def reset_google_usage_cycle(payload: ResetCycleRequest):
    """
    Resets the Google usage cycle after verified provider renewal.
    Never assumes reset purely because calendar day flipped.
    """
    new_status = GoogleUsageTracker.reset_usage_cycle(
        force=True, 
        verification_note=payload.verification_note or "Manual Verification"
    )
    return {
        "success": True,
        "message": "Google Places usage cycle has been verified and reset.",
        "status": new_status
    }


@router.get("/photo-proxy")
async def proxy_google_photo(
    ref: str = Query(..., description="Google Places photo_reference token"),
    maxwidth: Optional[int] = Query(1200, ge=200, le=1600, description="Max image width"),
    name: Optional[str] = Query("", description="Optional sight or place name")
):
    """
    Secure Google Places Photo Proxy:
    - Never exposes secret API key to client.
    - Enforces GoogleUsageTracker zero-cost budget checks.
    - Uses disk-cached images for infinite 0ms, $0 repeat views.
    - If Google retrieval is paused, returns 503 or redirect to fallback.
    """
    content, mime_type, status_code = await LocationImageService.fetch_and_cache_google_photo(ref, maxwidth or 1200)
    
    if status_code == 200 and content:
        return Response(
            content=content,
            media_type=mime_type,
            headers={
                "Cache-Control": "public, max-age=604800, immutable",
                "X-Google-Places-Proxy": "GeoVisionAI-ZeroCost"
            }
        )
    elif status_code == 503:
        raise HTTPException(
            status_code=503, 
            detail="Google image request limit reached. Google image retrieval is temporarily paused and will resume when the usage allowance resets."
        )
    elif status_code == 429:
        raise HTTPException(
            status_code=429,
            detail="Google Places API quota exceeded. Retrieval paused."
        )
    else:
        raise HTTPException(status_code=status_code or 404, detail="Photo not available")


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
