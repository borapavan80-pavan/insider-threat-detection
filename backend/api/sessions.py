from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession

from backend.models.database import get_db
from backend.models.session import Session as SessionModel


router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"]
)


# ==========================================
# CREATE SESSION
# ==========================================

@router.post("/create")
def create_session(
    session_id: str,
    user_id: str,
    device_id: str,
    login_time: str,
    db: DBSession = Depends(get_db)
):

    new_session = SessionModel(
        session_id=session_id,
        user_id=user_id,
        device_id=device_id,
        login_time=login_time,
        is_active=True,
        risk_score=0,
        risk_level="Low"
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return {
        "message": "Session created successfully",
        "session_id": new_session.session_id,
        "user_id": new_session.user_id,
        "device_id": new_session.device_id,
        "login_time": new_session.login_time,
        "is_active": new_session.is_active,
        "risk_score": new_session.risk_score,
        "risk_level": new_session.risk_level
    }


# ==========================================
# GET ALL SESSIONS
# ==========================================

@router.get("/")
def get_sessions(
    db: DBSession = Depends(get_db)
):

    sessions = db.query(SessionModel).all()

    return {
        "success": True,
        "data": sessions
    }


# ==========================================
# GET ONE SESSION
# ==========================================

@router.get("/{session_id}")
def get_session(
    session_id: str,
    db: DBSession = Depends(get_db)
):

    session = db.query(SessionModel).filter(
        SessionModel.session_id == session_id
    ).first()

    if not session:
        return {
            "success": False,
            "message": "Session not found"
        }

    return {
        "success": True,
        "data": session
    }