from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime

from backend.models.database import get_db
from backend.models.user import User
from backend.models.session import Session as SessionModel

from backend.services.otp_service import generate_otp, verify_otp
from backend.services.email_service import send_otp_email


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# =========================================================
# REGISTER USER
# =========================================================

@router.post("/register")
def register_user(
    user_id: str,
    name: str,
    email: str,
    device_id: str,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered. Please use another email."
        )

    new_user = User(
        user_id=user_id,
        name=name,
        email=email,
        device_id=device_id,
        is_authorized=True,
        trust_status="trusted"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "User registered successfully",
        "user_id": new_user.user_id,
        "name": new_user.name,
        "email": new_user.email,
        "device_id": new_user.device_id,
        "trust_status": new_user.trust_status
    }


# =========================================================
# GET ALL USERS
# =========================================================

@router.get("/")
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    return {
        "success": True,
        "data": users
    }


# =========================================================
# SEND OTP
# =========================================================

@router.post("/send-otp")
def send_otp(
    email: str
):

    otp = generate_otp(email)

    email_sent = send_otp_email(
        receiver_email=email,
        otp=otp
    )

    if not email_sent:
        return {
            "success": False,
            "message": "Failed to send OTP"
        }

    return {
        "success": True,
        "message": "OTP sent successfully",
        "email": email
    }


# =========================================================
# VERIFY OTP
# =========================================================

@router.post("/verify-otp")
def verify_user_otp(
    email: str,
    otp: str
):

    success, message = verify_otp(
        email,
        otp
    )

    return {
        "success": success,
        "message": message
    }


# =========================================================
# LOGIN USER
# =========================================================

@router.post("/login")
def login_user(
    user_id: str,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # Find user
    # -----------------------------------------------------

    user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -----------------------------------------------------
    # Check authorization
    # -----------------------------------------------------

    if not user.is_authorized:
        raise HTTPException(
            status_code=403,
            detail="User is not authorized"
        )

    # -----------------------------------------------------
    # Check existing active session
    # -----------------------------------------------------

    existing_session = db.query(SessionModel).filter(
        SessionModel.user_id == user.user_id,
        SessionModel.is_active == True
    ).first()

    # -----------------------------------------------------
    # User already logged in
    # -----------------------------------------------------

    if existing_session:

        existing_session.last_seen = datetime.now().isoformat()

        db.commit()
        db.refresh(existing_session)

        return {
            "success": True,
            "message": "User is already logged in",
            "user_id": user.user_id,
            "name": user.name,
            "device_id": user.device_id,
            "session_id": existing_session.session_id,
            "status": "Online",
            "last_seen": existing_session.last_seen
        }

    # -----------------------------------------------------
    # Create new session
    # -----------------------------------------------------

    current_time = datetime.now().isoformat()

    new_session = SessionModel(
        session_id=str(uuid4()),
        user_id=user.user_id,
        device_id=user.device_id,
        login_time=current_time,
        last_seen=current_time,
        is_active=True,
        risk_score=0.0,
        risk_level="Low"
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    # -----------------------------------------------------
    # Login response
    # -----------------------------------------------------

    return {
        "success": True,
        "message": "Login successful",
        "user_id": user.user_id,
        "name": user.name,
        "device_id": user.device_id,
        "session_id": new_session.session_id,
        "status": "Online",
        "last_seen": new_session.last_seen
    }