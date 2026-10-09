from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.models.database import get_db
from backend.models.device import Device
from backend.models.user import User


router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)


# ==============================
# REGISTER DEVICE
# ==============================

@router.post("/register")
def register_device(
    device_id: str,
    device_name: str,
    user_id: str,
    ip_address: str,
    db: Session = Depends(get_db)
):

    # Check user
    user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check device already exists
    existing_device = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if existing_device:
        raise HTTPException(
            status_code=400,
            detail="Device already registered"
        )

    # Create device
    new_device = Device(
        device_id=device_id,
        device_name=device_name,
        user_id=user_id,
        ip_address=ip_address,
        is_authorized=True,
        trust_status="trusted"
    )

    db.add(new_device)
    db.commit()
    db.refresh(new_device)

    return {
        "success": True,
        "message": "Device registered successfully",
        "device_id": new_device.device_id,
        "device_name": new_device.device_name,
        "user_id": new_device.user_id,
        "ip_address": new_device.ip_address,
        "is_authorized": new_device.is_authorized,
        "trust_status": new_device.trust_status
    }


# ==============================
# GET ALL DEVICES
# ==============================

@router.get("/")
def get_devices(
    db: Session = Depends(get_db)
):

    devices = db.query(Device).all()

    return {
        "success": True,
        "data": devices
    }


# ==============================
# GET ONE DEVICE
# ==============================

@router.get("/{device_id}")
def get_device(
    device_id: str,
    db: Session = Depends(get_db)
):

    device = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if not device:
        raise HTTPException(
            status_code=404,
            detail="Device not found"
        )

    return {
        "success": True,
        "data": device
    }