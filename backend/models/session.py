from sqlalchemy import Column, String, Boolean, Float

from backend.models.database import Base


class Session(Base):

    __tablename__ = "sessions"

    session_id = Column(
        String,
        primary_key=True,
        index=True
    )

    user_id = Column(
        String,
        nullable=False
    )

    device_id = Column(
        String,
        nullable=False
    )

    login_time = Column(
        String,
        nullable=False
    )

    last_seen = Column(
        String,
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True
    )

    risk_score = Column(
        Float,
        default=0.0
    )

    risk_level = Column(
        String,
        default="Low"
    )