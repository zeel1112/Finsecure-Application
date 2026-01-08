# FinSecure Backend API

FastAPI-based backend for FinSecure personal finance management application.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (via Supabase)
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Authentication**: JWT (python-jose)
- **Password Hashing**: passlib[bcrypt]
- **Validation**: Pydantic
- **Testing**: pytest + httpx
- **Code Quality**: ruff

## Features

- JWT-based authentication
- CRUD operations for transactions, budgets, accounts, and goals
- Rule-based transaction categorization
- Financial insights and analytics
- Comprehensive test coverage
- Auto-generated API documentation (FastAPI Swagger)

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-here
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

### 4. Run Migrations

```bash
alembic upgrade head
```

### 5. Start Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

Run all tests:

```bash
pytest
```

Run with coverage:

```bash
pytest --cov=app --cov-report=term-missing
```

## Code Quality

Format and lint:

```bash
ruff check .
ruff format .
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user info

### Transactions
- `GET /api/v1/transactions` - Get all transactions
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions/{id}` - Get transaction by ID
- `PUT /api/v1/transactions/{id}` - Update transaction
- `DELETE /api/v1/transactions/{id}` - Delete transaction
- `POST /api/v1/transactions/categorize` - Categorize transaction

### Budgets
- `GET /api/v1/budgets` - Get all budgets
- `POST /api/v1/budgets` - Create budget
- `GET /api/v1/budgets/{id}` - Get budget by ID
- `PUT /api/v1/budgets/{id}` - Update budget
- `DELETE /api/v1/budgets/{id}` - Delete budget

### Accounts
- `GET /api/v1/accounts` - Get all accounts
- `POST /api/v1/accounts` - Create account
- `GET /api/v1/accounts/{id}` - Get account by ID
- `PUT /api/v1/accounts/{id}` - Update account
- `DELETE /api/v1/accounts/{id}` - Delete account

### Goals
- `GET /api/v1/goals` - Get all goals
- `POST /api/v1/goals` - Create goal
- `GET /api/v1/goals/{id}` - Get goal by ID
- `PUT /api/v1/goals/{id}` - Update goal
- `DELETE /api/v1/goals/{id}` - Delete goal

### Insights
- `GET /api/v1/insights?month=YYYY-MM` - Get financial insights

## Database Schema

### Users
- id, email, hashed_password, first_name, last_name, role
- timestamps: created_at, updated_at

### Accounts
- id, user_id, name, type, balance, currency, is_active
- timestamps: created_at, updated_at

### Transactions
- id, user_id, account_id, date, amount, description, type, category, is_recurring, notes
- timestamps: created_at, updated_at

### Budgets
- id, user_id, category, amount, spent, period, start_date, end_date
- timestamps: created_at, updated_at

### Goals
- id, user_id, name, type, target_amount, current_amount, start_date, target_date, status, notes
- timestamps: created_at, updated_at

## Deployment

### Render/Fly.io

1. Create `render.yaml` or `fly.toml`
2. Set environment variables
3. Deploy:

```bash
# Render
git push origin main

# Fly.io
fly deploy
```

## Development Workflow

1. Create feature branch
2. Write tests first (TDD)
3. Implement feature
4. Run tests and linting
5. Create pull request

## License

MIT
