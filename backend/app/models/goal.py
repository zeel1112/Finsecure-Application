from sqlalchemy import Column, String, DateTime, Float, Enum, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base


class GoalType(str, enum.Enum):
    SAVINGS = "savings"
    DEBT = "debt"
    PURCHASE = "purchase"
    EMERGENCY = "emergency"
    OTHER = "other"


class GoalStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    ACHIEVED = "achieved"
    FAILED = "failed"


class Goal(Base):
    __tablename__ = "goals"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(Enum(GoalType), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0, nullable=False)
    start_date = Column(Date, nullable=False)
    target_date = Column(Date, nullable=False)
    status = Column(Enum(GoalStatus), default=GoalStatus.IN_PROGRESS, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="goals")
