import os
from typing import List, Tuple
import ee
import geemap


def init_ee():
    """Initialize Google Earth Engine."""
    try:
        ee.Initialize()
    except Exception:
        try:
            # Fallback initialization attempt
            ee.Initialize(opt_url='https://earthengine.googleapis.com')
        except Exception as e:
            print(f"Warning: Earth Engine initialization encountered an issue: {e}")


def fetch_sar_pair(
    bbox: List[float],
    pre_dates: Tuple[str, str],
    post_dates: Tuple[str, str],
    out_dir: str,
    scale: int = 100
) -> Tuple[str, str]:
    """
    Fetch Sentinel-1 GRD 'VV' band imagery pre- and post-event for a given bounding box.

    :param bbox: Bounding box [min_lon, min_lat, max_lon, max_lat]
    :param pre_dates: Tuple of (start_date, end_date) strings, e.g. ('2024-09-01', '2024-09-10')
    :param post_dates: Tuple of (start_date, end_date) strings, e.g. ('2024-09-15', '2024-09-25')
    :param out_dir: Target directory to save GeoTIFF files
    :param scale: Spatial resolution scale in meters (default: 100m)
    :return: Tuple of file paths (pre_sar.tif, post_sar.tif)
    """
    init_ee()

    os.makedirs(out_dir, exist_ok=True)
    pre_path = os.path.join(out_dir, "pre_sar.tif")
    post_path = os.path.join(out_dir, "post_sar.tif")

    min_lon, min_lat, max_lon, max_lat = bbox
    roi = ee.Geometry.BBox(min_lon, min_lat, max_lon, max_lat)

    def get_sar_composite(start_date: str, end_date: str) -> ee.Image:
        collection = (
            ee.ImageCollection("COPERNICUS/S1_GRD")
            .filterBounds(roi)
            .filterDate(start_date, end_date)
            .filter(ee.Filter.eq("instrumentMode", "IW"))
            .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VV"))
            .select("VV")
        )
        return collection.median().clip(roi)

    pre_img = get_sar_composite(pre_dates[0], pre_dates[1])
    post_img = get_sar_composite(post_dates[0], post_dates[1])

    print(f"Exporting pre-event SAR imagery to {pre_path}...")
    geemap.ee_export_image(
        pre_img,
        filename=pre_path,
        scale=scale,
        region=roi,
        file_per_band=False
    )

    print(f"Exporting post-event SAR imagery to {post_path}...")
    geemap.ee_export_image(
        post_img,
        filename=post_path,
        scale=scale,
        region=roi,
        file_per_band=False
    )

    return pre_path, post_path
