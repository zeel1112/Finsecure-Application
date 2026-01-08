from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import date

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse

router = APIRouter()


def calculate_budget_spent(db: Session, user_id: str, category: str, start_date: date, end_date: date) -> float:
    total = db.query(Transaction).filter(
        and_(
            Transaction.user_id == user_id,
            Transaction.category == category,
            Transaction.type == "expense",
            Transaction.date >= start_date,
            Transaction.date <= end_date
        )
    ).with_entities(Transaction.amount).all()

    return sum(t[0] for t in total) if total else 0.0


@router.get("", response_model=List[BudgetResponse])
def get_budgets(
    month: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Budget).filter(Budget.user_id == current_user.id)

    if month:
        try:
            year, month_num = map(int, month.split('-'))
            query = query.filter(
                and_(
                    Budget.start_date <= date(year, month_num, 28),
                    Budget.end_date >= date(year, month_num, 1)
                )
            )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid month format. Use YYYY-MM"
            )

    budgets = query.all()

    for budget in budgets:
        budget.spent = calculate_budget_spent(
            db, current_user.id, budget.category, budget.start_date, budget.end_date
        )

    db.commit()

    return budgets


@router.post("", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_budget(
    budget_data: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_budget = Budget(
        user_id=current_user.id,
        **budget_data.model_dump()
    )

    new_budget.spent = calculate_budget_spent(
        db, current_user.id, new_budget.category, new_budget.start_date, new_budget.end_date
    )

    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)

    return new_budget


@router.get("/{budget_id}", response_model=BudgetResponse)
def get_budget(
    budget_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()

    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )

    budget.spent = calculate_budget_spent(
        db, current_user.id, budget.category, budget.start_date, budget.end_date
    )
    db.commit()

    return budget


@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: str,
    budget_data: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()

    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )

    for field, value in budget_data.model_dump(exclude_unset=True).items():
        setattr(budget, field, value)

    budget.spent = calculate_budget_spent(
        db, current_user.id, budget.category, budget.start_date, budget.end_date
    )

    db.commit()
    db.refresh(budget)

    return budget


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()

    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )

    db.delete(budget)
    db.commit()

    return None
