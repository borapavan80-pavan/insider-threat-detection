from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.models.database import get_db
from backend.models.alert import Alert


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


@router.post("/create")
def create_alert(
    user_id: str,
    device_id: str,
    alert_type: str,
    message: str,
    risk_score: float = 0,
    risk_level: str = "Low",
    db: Session = Depends(get_db)
):
    new_alert = Alert(
        user_id=user_id,
        device_id=device_id,
        alert_type=alert_type,
        message=message,
        risk_score=risk_score,
        risk_level=risk_level
    )

    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)

    return {
        "message": "Alert created successfully",
        "alert_id": new_alert.id,
        "user_id": new_alert.user_id,
        "device_id": new_alert.device_id,
        "alert_type": new_alert.alert_type,
        "message_text": new_alert.message,
        "risk_score": new_alert.risk_score,
        "risk_level": new_alert.risk_level
    }


@router.get("/")
def get_alerts(
    db: Session = Depends(get_db)
):
    alerts = db.query(Alert).all()

    return alerts