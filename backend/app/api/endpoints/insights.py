from typing import Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime
from dateutil.relativedelta import relativedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.transaction import Transaction
from app.models.budget import Budget
from app.models.account import Account

router = APIRouter()


@router.get("", response_model=Dict[str, Any])
def get_insights(
    month: str = Query(..., description="Month in YYYY-MM format"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        year, month_num = map(int, month.split('-'))
        start_date = date(year, month_num, 1)
        end_date = start_date + relativedelta(months=1) - relativedelta(days=1)
    except ValueError:
        return {"error": "Invalid month format. Use YYYY-MM"}

    total_income = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "income",
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).scalar() or 0.0

    total_expenses = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).scalar() or 0.0

    spending_by_category = db.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).group_by(Transaction.category).all()

    category_breakdown = {cat: float(total) for cat, total in spending_by_category}

    total_balance = db.query(func.sum(Account.balance)).filter(
        Account.user_id == current_user.id,
        Account.is_active == True
    ).scalar() or 0.0

    savings_rate = 0.0
    if total_income > 0:
        savings_rate = ((total_income - total_expenses) / total_income) * 100

    budgets = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.start_date <= end_date,
        Budget.end_date >= start_date
    ).all()

    budget_status = []
    for budget in budgets:
        spent = db.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user.id,
            Transaction.category == budget.category,
            Transaction.type == "expense",
            Transaction.date >= budget.start_date,
            Transaction.date <= budget.end_date
        ).scalar() or 0.0

        percentage = (spent / budget.amount * 100) if budget.amount > 0 else 0
        budget_status.append({
            "category": budget.category,
            "budget": budget.amount,
            "spent": spent,
            "remaining": budget.amount - spent,
            "percentage": percentage,
            "status": "over" if spent > budget.amount else "warning" if percentage > 80 else "good"
        })

    prev_month_start = start_date - relativedelta(months=1)
    prev_month_end = start_date - relativedelta(days=1)

    prev_month_expenses = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.date >= prev_month_start,
        Transaction.date <= prev_month_end
    ).scalar() or 0.0

    expense_trend = 0.0
    if prev_month_expenses > 0:
        expense_trend = ((total_expenses - prev_month_expenses) / prev_month_expenses) * 100

    return {
        "month": month,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_savings": total_income - total_expenses,
        "savings_rate": round(savings_rate, 2),
        "total_balance": total_balance,
        "spending_by_category": category_breakdown,
        "budget_status": budget_status,
        "expense_trend": round(expense_trend, 2),
        "insights": generate_insights(
            total_income,
            total_expenses,
            savings_rate,
            budget_status,
            expense_trend
        )
    }


def generate_insights(
    total_income: float,
    total_expenses: float,
    savings_rate: float,
    budget_status: list,
    expense_trend: float
) -> list:
    insights = []

    if savings_rate > 20:
        insights.append({
            "type": "positive",
            "message": f"Great job! You're saving {savings_rate:.1f}% of your income."
        })
    elif savings_rate < 10:
        insights.append({
            "type": "warning",
            "message": f"Your savings rate is {savings_rate:.1f}%. Consider reducing expenses."
        })

    over_budget = [b for b in budget_status if b["status"] == "over"]
    if over_budget:
        categories = ", ".join([b["category"] for b in over_budget])
        insights.append({
            "type": "warning",
            "message": f"You're over budget in: {categories}"
        })

    warning_budget = [b for b in budget_status if b["status"] == "warning"]
    if warning_budget:
        categories = ", ".join([b["category"] for b in warning_budget])
        insights.append({
            "type": "info",
            "message": f"You're close to budget limit in: {categories}"
        })

    if expense_trend > 20:
        insights.append({
            "type": "warning",
            "message": f"Your expenses increased by {expense_trend:.1f}% compared to last month."
        })
    elif expense_trend < -10:
        insights.append({
            "type": "positive",
            "message": f"Great! Your expenses decreased by {abs(expense_trend):.1f}% compared to last month."
        })

    return insights
