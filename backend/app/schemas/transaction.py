from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional


class TransactionBase(BaseModel):
    account_id: str
    date: date
    amount: float
    description: str
    type: str
    category: str
    is_recurring: bool = False
    notes: Optional[str] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    account_id: Optional[str] = None
    date: Optional[date] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    is_recurring: Optional[bool] = None
    notes: Optional[str] = None


class TransactionResponse(TransactionBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CategorizeRequest(BaseModel):
    description: str


class CategorizeResponse(BaseModel):
    category: str
    confidence: float
