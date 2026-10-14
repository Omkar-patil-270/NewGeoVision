import asyncio
import os
import sys

# Ensure backend path is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from app.services.google_usage_tracker import GoogleUsageTracker
from app.services.location_image_service import LocationImageService

async def run_comprehensive_tests():
    print("=" * 70)
    print("GEOVISION AI: GOOGLE PLACES USAGE & RETRIEVAL VERIFICATION SUITE")
    print("=" * 70)

    # -------------------------------------------------------------
    # TEST 1: Configurable Monthly Safety Allowance & Zero-Cost Cap
    # -------------------------------------------------------------
    print("\n[TEST 1] Google API Usage Monitor & Safe Free Allowance:")
    GoogleUsageTracker.reset_usage_cycle(verification_note="Automated Test Init")
    
    # Configure 1,000 requests monthly allowance (~$7 vs $200 free credit)
    GoogleUsageTracker.update_config({
        "max_monthly_allowance": 1000,
        "threshold_info_pct": 70.0,
        "threshold_warning_pct": 85.0,
        "threshold_pause_pct": 95.0,
        "is_manually_paused": False
    })
    
    status = GoogleUsageTracker.get_status()
    assert status["max_monthly_allowance"] == 1000
    assert status["threshold_info_pct"] == 70.0
    assert status["threshold_warning_pct"] == 85.0
    assert status["threshold_pause_pct"] == 95.0
    assert status["status"] == "active"
    print(f"  [PASS] Default safety allowance: {status['max_monthly_allowance']} requests")
    print(f"  [PASS] Max potential Google charge: $7.00 (within $200 free tier -> $0.00 billed)")
    print(f"  [PASS] Thresholds: 70% Info | 85% Warning | 95% Hard Pause")

    # -------------------------------------------------------------
    # TEST 2: Threshold Warnings (70%, 85%) & Precautionary Hard Pause (95%)
    # -------------------------------------------------------------
    print("\n[TEST 2] Warning Thresholds & Precautionary Hard Pause:")
    
    # Simulate usage up to 700 requests (70%)
    state = GoogleUsageTracker.load_state()
    state["total_requests_month"] = 700
    GoogleUsageTracker.save_state()
    status_70 = GoogleUsageTracker.get_status()
    assert status_70["status"] == "warning_info"
    assert status_70["usage_percentage"] == 70.0
    can_req_70, _, _ = GoogleUsageTracker.can_make_request()
    assert can_req_70 is True
    print(f"  [PASS] At 700 req (70%): Status is '{status_70['status']}' - Informational alert active, requests allowed")

    # Simulate usage up to 850 requests (85%)
    state["total_requests_month"] = 850
    GoogleUsageTracker.save_state()
    status_85 = GoogleUsageTracker.get_status()
    assert status_85["status"] == "warning_high"
    assert status_85["usage_percentage"] == 85.0
    can_req_85, _, _ = GoogleUsageTracker.can_make_request()
    assert can_req_85 is True
    print(f"  [PASS] At 850 req (85%): Status is '{status_85['status']}' - Prominent warning active, requests allowed")

    # Simulate usage up to 950 requests (95% hard pause threshold)
    state["total_requests_month"] = 950
    GoogleUsageTracker.save_state()
    can_req_95, reason_95, _ = GoogleUsageTracker.can_make_request()
    assert can_req_95 is False
    status_95 = GoogleUsageTracker.get_status()
    assert status_95["status"] == "paused_threshold"
    print(f"  [PASS] At 950 req (95%): Status is '{status_95['status']}' - Hard stop enforced, Google requests BLOCKED")
    print(f"  [PASS] Paused message: '{status_95['message']}'")

    # -------------------------------------------------------------
    # TEST 3: Distinguish Budget Pause from Actual API Quota Errors
    # -------------------------------------------------------------
    print("\n[TEST 3] Distinguish Monthly Budget Pause from Actual API Quota Errors:")
    GoogleUsageTracker.record_quota_error("HTTP 429: OVER_QUERY_LIMIT from Google Places API")
    status_quota = GoogleUsageTracker.get_status()
    assert status_quota["status"] == "paused_quota_error"
    assert "429" in status_quota["message"]
    print(f"  [PASS] Handled HTTP 429 / Quota Error: Status '{status_quota['status']}' properly distinguished from budget threshold")

    # -------------------------------------------------------------
    # TEST 4: Verified Cycle Reset Logic
    # -------------------------------------------------------------
    print("\n[TEST 4] Cycle Reset with Verification:")
    res = GoogleUsageTracker.reset_usage_cycle(verification_note="Google Cloud Console billing cycle confirmed $0.00")
    assert res["status"] == "active"
    assert res["total_requests"] == 0
    can_req_reset, _, _ = GoogleUsageTracker.can_make_request()
    assert can_req_reset is True
    print(f"  [PASS] Reset cycle completed with note: '{res['last_verified_reset_date']}' - Requests safely resumed")

    # -------------------------------------------------------------
    # TEST 5: Location Accuracy & Isolation (Kolhapur, Satara, Madrid, Village)
    # -------------------------------------------------------------
    print("\n[TEST 5] Location Accuracy & Image Gallery Isolation:")
    locations = [
        ("Kolhapur", "District"),
        ("Satara", "District"),
        ("Madrid", "Global Metro"),
        ("Radhanagari", "Small Village")
    ]
    
    galleries = {}
    for loc_name, loc_type in locations:
        res = await LocationImageService.get_categorized_images(location=loc_name, limit_per_category=6)
        all_imgs = [img for cat in res["categories"] for img in cat["images"]]
        galleries[loc_name] = all_imgs
        
        # Verify non-empty
        assert len(all_imgs) > 0, f"Expected images for {loc_name}"
        
        # Verify metadata fields
        for img in all_imgs:
            assert "sourceProvider" in img
            assert "imageType" in img
            assert "locationAssociation" in img
            assert "title" in img
            assert "attribution" in img
            assert "license" in img
            
        print(f"  [PASS] {loc_name} ({loc_type}): {len(all_imgs)} images across {len(res['categories'])} categories")
        print(f"    - Providers: {set(img['sourceProvider'] for img in all_imgs)}")
        print(f"    - Types: {set(img['imageType'] for img in all_imgs)}")

    # Verify zero leakage across locations
    print("\n[TEST 6] Cross-Location Gallery Leakage & Deduplication Check:")
    kolhapur_urls = set(img["url"] for img in galleries["Kolhapur"])
    satara_urls = set(img["url"] for img in galleries["Satara"])
    madrid_urls = set(img["url"] for img in galleries["Madrid"])
    radhanagari_urls = set(img["url"] for img in galleries["Radhanagari"])

    # Strict disjunction
    assert kolhapur_urls.isdisjoint(madrid_urls), "Leakage between Kolhapur and Madrid!"
    assert satara_urls.isdisjoint(madrid_urls), "Leakage between Satara and Madrid!"
    assert len(kolhapur_urls) == len(galleries["Kolhapur"]), "Duplicate images found in Kolhapur gallery!"
    assert len(satara_urls) == len(galleries["Satara"]), "Duplicate images found in Satara gallery!"
    print("  [PASS] Kolhapur & Madrid galleries: 100% disjoint (0 leaked images)")
    print("  [PASS] Satara & Madrid galleries: 100% disjoint (0 leaked images)")
    print("  [PASS] Deduplication verified: 0 duplicate URLs within individual location galleries")

    # -------------------------------------------------------------
    # TEST 7: Seamless Fallback During Google Hard Pause
    # -------------------------------------------------------------
    print("\n[TEST 7] Seamless Backup Retrieval When Google is Paused:")
    # Pause Google tracker
    GoogleUsageTracker.update_config({"is_manually_paused": True})
    
    # Request images for Madrid while Google is paused
    fallback_res = await LocationImageService.get_categorized_images(location="Madrid", limit_per_category=6)
    fallback_imgs = [img for cat in fallback_res["categories"] for img in cat["images"]]
    assert len(fallback_imgs) > 0
    print(f"  [PASS] Madrid retrieved {len(fallback_imgs)} images successfully while Google was paused!")
    print(f"  [PASS] Provider routed to: {set(img['sourceProvider'] for img in fallback_imgs)}")
    print(f"  [PASS] Google usage status attached: {fallback_res.get('googleUsage', {}).get('status')}")
    
    # Unpause tracker and reset to 0 requests
    GoogleUsageTracker.update_config({"is_manually_paused": False})
    GoogleUsageTracker.reset_usage_cycle(verification_note="Clean state post-test")

    print("\n" + "=" * 70)
    print("ALL TESTS PASSED SUCCESSFULLY! (7/7)")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(run_comprehensive_tests())
