from sqlalchemy import Column, Integer, String
from .database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    alert_id = Column(String, unique=True, nullable=False)

    user_id = Column(String, nullable=False)

    device_id = Column(String, nullable=False)

    session_id = Column(String, nullable=False)

    alert_type = Column(String, nullable=False)

    risk_score = Column(Integer, default=0)

    risk_level = Column(String, default="Low")

    message = Column(String, nullable=False)

    timestamp = Column(String, nullable=False)

    status = Column(String, default="Open")