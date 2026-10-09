from sqlalchemy import Column, Integer, String, Boolean
from .database import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)

    device_id = Column(String, unique=True, nullable=False)

    device_name = Column(String, nullable=False)

    user_id = Column(String, nullable=False)

    ip_address = Column(String, nullable=False)

    is_authorized = Column(Boolean, default=False)

    trust_status = Column(String, default="pending")

    agent_version = Column(String, default="1.0")

    last_seen = Column(String, nullable=True)