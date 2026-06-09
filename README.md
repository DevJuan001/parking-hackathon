# Parking-hackathon

## Prerequisites

- Python 3.13+
- Node.js 18+
- pnpm (or npm)
- Docker & Docker Compose

## Setup Instructions

### 1. Start Docker Services

Start Redis and MySQL using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- **Redis** on `localhost:6379`
- **MySQL** on `localhost:3306`

### 2. Initialize the Database

Run the DDL script to create the database schema:

```bash
mysql -h localhost -u root -p < db/parking_db_ddl.sql
```

*(Use the password from your `.env` file: `12345` by default)*

### 3. Backend Setup

```bash
cd backend

# Install uv if not already installed
pip install uv

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Sync dependencies with uv
uv sync

# Copy and configure environment variables
copy .env.example .env
# Edit .env with your database credentials

# Run the API
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies with pnpm
pnpm install

# Or with npm
npm install

# Run the frontend
pnpm dev

# Or with npm
npm run dev
```

### 5. Celery (Background Tasks)

In a new terminal, from the `backend` directory:

```bash
cd backend
celery -A app.core.celery_app worker --loglevel=info
```

---

**Note:** Ensure Redis is running via Docker before starting the API or Celery worker.