# FastAPI Backend

A simple FastAPI backend with PostgreSQL database integration.

## Setup

1. Activate your virtual environment:
   ```bash
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure your database connection in `config.py`:
   - Update the `DATABASE_URL` with your PostgreSQL credentials
   - Format: `postgresql://username:password@localhost:5432/database_name`

4. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

- `GET /` - Welcome message
- `POST /articles/` - Create a new article
- `GET /articles/` - Get all articles (with pagination)
- `GET /articles/{article_id}` - Get a specific article
- `PUT /articles/{article_id}` - Update an article
- `DELETE /articles/{article_id}` - Delete an article

## Database Schema

The `articles` table has the following structure:
- `id` (BigInt) - Primary key
- `title` (String) - Article title
- `abstract` (String) - Article abstract

## Interactive API Documentation

Once the server is running, you can access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
