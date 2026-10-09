from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.models.database import get_db
from backend.models.user import User
from backend.models.session import Session as SessionModel

router = APIRouter(
    prefix="/monitoring",
    tags=["Monitoring"]
)


@router.get("/status")
def get_monitoring_status(
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    result = []

    for user in users:

        active_session = db.query(SessionModel).filter(
            SessionModel.user_id == user.user_id,
            SessionModel.is_active == True
        ).first()

        if active_session:

            status = "Online"

            last_seen = active_session.last_seen
            risk_score = active_session.risk_score
            risk_level = active_session.risk_level

        else:

            status = "Offline"

            last_seen = None
            risk_score = 0.0
            risk_level = "Low"

        result.append({
            "user_id": user.user_id,
            "name": user.name,
            "device_id": user.device_id,
            "status": status,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "last_seen": last_seen
        })

    return {
        "success": True,
        "data": result
    }