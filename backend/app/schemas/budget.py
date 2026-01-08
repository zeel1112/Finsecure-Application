from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional


class BudgetBase(BaseModel):
    category: str
    amount: float
    period: str
    start_date: date
    end_date: date


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    spent: Optional[float] = None
    period: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class BudgetResponse(BudgetBase):
    id: str
    user_id: str
    spent: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
