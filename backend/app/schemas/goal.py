from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional


class GoalBase(BaseModel):
    name: str
    type: str
    target_amount: float
    start_date: date
    target_date: date
    notes: Optional[str] = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    start_date: Optional[date] = None
    target_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class GoalResponse(GoalBase):
    id: str
    user_id: str
    current_amount: float
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
