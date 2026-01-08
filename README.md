# FinSecure - Personal Finance Management Application

A full-stack personal finance management application built with React and FastAPI.

## Live Demo

Frontend: [https://finsecureapp.netlify.app/](https://finsecureapp.netlify.app/)

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Charts**: Chart.js + React-ChartJS-2
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (Supabase)
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Authentication**: JWT (python-jose)
- **Password Hashing**: passlib[bcrypt]
- **Validation**: Pydantic
- **Testing**: pytest + httpx
- **Code Quality**: ruff

## Features

- User Authentication (JWT-based)
- Transaction Management (CRUD)
- Budget Tracking
- Financial Goals
- Account Management
- Rule-based Transaction Categorization
- Financial Insights & Analytics
- Dark Mode Support
- Responsive Design

## Project Structure

```
finsecure/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/endpoints/     # API route handlers
│   │   ├── core/              # Core functionality (config, security, database)
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── tests/             # Backend tests
│   ├── alembic/               # Database migrations
│   ├── requirements.txt       # Python dependencies
│   └── README.md             # Backend documentation
├── src/                       # React frontend
│   ├── components/            # Reusable React components
│   ├── contexts/              # React contexts (theme)
│   ├── lib/                   # Utilities and API client
│   ├── pages/                 # Page components
│   ├── services/api/          # API service layer
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript types
│   └── utils/                 # Helper functions
└── README.md                  # This file
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL (or Supabase account)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-here
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

5. Run migrations:
```bash
alembic upgrade head
```

6. Start backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

Backend API will be available at `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

4. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Transactions
- `GET /api/v1/transactions` - Get all transactions (with filters)
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

## Testing

### Backend Tests

```bash
cd backend
pytest
pytest --cov=app --cov-report=term-missing  # With coverage
```

### Frontend Tests

```bash
npm test
```

## Code Quality

### Backend Linting

```bash
cd backend
ruff check .
ruff format .
```

### Frontend Linting

```bash
npm run lint
```

## Building for Production

### Frontend

```bash
npm run build
```

Build output will be in `dist/` directory.

### Backend

Backend runs directly with:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Deployment

### Frontend (Netlify)

1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Backend (Render/Fly.io)

#### Render
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

#### Fly.io
1. Install Fly CLI
2. Run `fly launch` in backend directory
3. Configure fly.toml
4. Run `fly deploy`

### Database (Supabase/Neon)

1. Create new Supabase project
2. Get connection string from settings
3. Update `DATABASE_URL` in backend environment
4. Run migrations: `alembic upgrade head`

## Environment Variables

### Backend
```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
BACKEND_CORS_ORIGINS=["http://localhost:5173","https://your-domain.com"]
ENVIRONMENT=development
```

### Frontend
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Database Schema

### Users
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `hashed_password` (String)
- `first_name` (String)
- `last_name` (String)
- `role` (Enum: admin, user)
- `created_at`, `updated_at` (Timestamps)

### Accounts
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key)
- `name`, `type`, `balance`, `currency`
- `is_active` (Boolean)
- `created_at`, `updated_at`

### Transactions
- `id` (UUID, Primary Key)
- `user_id`, `account_id` (Foreign Keys)
- `date`, `amount`, `description`
- `type` (income/expense/transfer)
- `category` (housing/food/etc.)
- `is_recurring` (Boolean)
- `notes` (Text, Optional)
- `created_at`, `updated_at`

### Budgets
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key)
- `category`, `amount`, `spent`
- `period` (weekly/monthly/yearly)
- `start_date`, `end_date`
- `created_at`, `updated_at`

### Goals
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key)
- `name`, `type`
- `target_amount`, `current_amount`
- `start_date`, `target_date`
- `status` (in_progress/achieved/failed)
- `notes` (Text, Optional)
- `created_at`, `updated_at`

## Development Workflow

1. Create feature branch from `main`
2. Make changes
3. Write/update tests
4. Run tests and linting
5. Commit with descriptive message
6. Create pull request
7. Review and merge

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Built with FastAPI and React
- Styled with Tailwind CSS
- Icons by Lucide
- Hosted on Netlify and Render
