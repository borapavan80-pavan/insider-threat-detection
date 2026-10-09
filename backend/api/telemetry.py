from fastapi import APIRouter
from datetime import datetime, timezone

from backend.ai.hybrid_detector import hybrid_anomaly_score


router = APIRouter(
    prefix="/telemetry",
    tags=["Telemetry"]
)


# ============================================================
# LATEST TELEMETRY
# ============================================================

latest_telemetry = {}


# ============================================================
# OFFLINE TIMEOUT
# ============================================================

OFFLINE_TIMEOUT = 30


# ============================================================
# RECEIVE TELEMETRY
# ============================================================

@router.post("/")
def receive_telemetry(
    device_id: str,
    user_id: str,

    typing_speed: float,
    mouse_speed: float,
    mouse_movements: int,
    idle_time: float,

    activity_state: str,
    last_activity: float,

    failed_logins: int = 0
):

    current_time = datetime.now(timezone.utc)

    # --------------------------------------------------------
    # Create feature list for Hybrid Detector
    # --------------------------------------------------------

    features = [
        typing_speed,
        mouse_speed,
        mouse_movements,
        idle_time
    ]

    # --------------------------------------------------------
    # Hybrid Classical + Quantum Detection
    # --------------------------------------------------------

    detection_result = hybrid_anomaly_score(features)

    # --------------------------------------------------------
    # Store telemetry
    # --------------------------------------------------------

    latest_telemetry[device_id] = {

        "device_id": device_id,
        "user_id": user_id,

        # ---------------- Behavior ----------------

        "typing_speed": typing_speed,
        "mouse_speed": mouse_speed,
        "mouse_movements": mouse_movements,
        "idle_time": idle_time,

        # ---------------- Activity ----------------

        "activity_state": activity_state,
        "last_activity": last_activity,

        # ---------------- Connection ----------------

        "last_seen": current_time.isoformat(),
        "device_status": "Connected",

        # ---------------- Authentication ----------------

        "failed_logins": failed_logins,

        # ---------------- AI Detection ----------------

        "classical_score": detection_result["classical_score"],
        "quantum_score": detection_result["quantum_score"],
        "hybrid_score": detection_result["hybrid_score"]
    }

    # --------------------------------------------------------
    # Risk Level
    # --------------------------------------------------------

    hybrid_score = detection_result["hybrid_score"]

    if hybrid_score >= 0.70:
        risk_level = "High"

    elif hybrid_score >= 0.40:
        risk_level = "Medium"

    else:
        risk_level = "Low"

    latest_telemetry[device_id]["risk_level"] = risk_level

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "success": True,
        "message": "Telemetry received successfully",
        "data": latest_telemetry[device_id]
    }


# ============================================================
# CHECK CONNECTION STATUS
# ============================================================

def update_connection_status(data):

    last_seen = datetime.fromisoformat(
        data["last_seen"]
    )

    current_time = datetime.now(timezone.utc)

    seconds_since_last_seen = (
        current_time - last_seen
    ).total_seconds()

    if seconds_since_last_seen > OFFLINE_TIMEOUT:

        data["device_status"] = "Offline"

    else:

        data["device_status"] = "Connected"

    return data


# ============================================================
# GET ALL DEVICE TELEMETRY
# ============================================================

@router.get("/")
def get_all_telemetry():

    result = []

    for device_id, data in latest_telemetry.items():

        data = update_connection_status(data)

        result.append(data)

    return {
        "success": True,
        "data": result
    }


# ============================================================
# GET ONE DEVICE TELEMETRY
# ============================================================

@router.get("/{device_id}")
def get_current_telemetry(device_id: str):

    if device_id not in latest_telemetry:

        return {
            "success": False,
            "message": "No telemetry received for this device"
        }

    data = latest_telemetry[device_id]

    data = update_connection_status(data)

    return {
        "success": True,
        "data": data
    }