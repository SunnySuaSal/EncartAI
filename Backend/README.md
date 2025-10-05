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

## API Endpoints (current)

- `GET /` — Health/welcome

- `POST /articles/` — Create article
  - body: `ArticleCreate { title: string, link: string }`
  - returns: `Article { id, title, link }`

- `GET /articles/` — List articles
  - query: `skip` (int, default 0), `limit` (int, default 100)
  - returns: `Article[]`

- `GET /articles/{article_id}` — Get article by id
  - returns: `Article`

- `PUT /articles/{article_id}` — Update article
  - body: `ArticleUpdate { title?: string, link?: string }`
  - returns: `Article`

- `DELETE /articles/{article_id}` — Delete article
  - returns: `Article`

- `GET /articles/search/` — Search articles by title
  - query: `q` (string, required), `skip` (int), `limit` (int)
  - returns: `Article[]`

- `GET /articles/{article_id}/abstracts` — List abstracts of an article
  - returns: `Abstract[]`

- `GET /articles/search/advanced/` — Advanced search by title and categories
  - query: `q` (string, optional), `categories` (comma-separated category ids, optional), `skip` (int), `limit` (int)
  - returns: `ArticleSearchResult[]` where each item is `{ id, title, link }`

- `GET /categories/{category_id}/count` — Count articles in a category
  - returns: `CategoryCount { category_id: string, count: number }`

Abstracts CRUD

- `POST /abstracts/` — Create abstract
  - body: `AbstractCreate { id_article: number, abstract: string }`
  - returns: `Abstract`

- `GET /abstracts/` — List abstracts
  - query: `skip` (int), `limit` (int)
  - returns: `Abstract[]`

- `GET /abstracts/{article_id}` — Get abstract by article id
  - returns: `Abstract`

- `PUT /abstracts/{article_id}` — Update abstract by article id
  - body: `AbstractUpdate { abstract?: string }`
  - returns: `Abstract`

- `DELETE /abstracts/{article_id}` — Delete abstract by article id
  - returns: `Abstract`

- `GET /abstracts/search/` — Search abstracts by text
  - query: `q` (string, required), `skip` (int), `limit` (int)
  - returns: `AbstractSearchResult[]` where each item is `{ id, title, link }`

## Database Schema

High-level schema (as exposed by API models):

- Article
  - `id` (int)
  - `title` (string)
  - `link` (string)

- Abstract
  - `id_article` (int)
  - `abstract` (string)

- ArticleSearchResult
  - `id` (int)
  - `title` (string)
  - `link` (string)

- CategoryCount
  - `category_id` (string)
  - `count` (int)

## Interactive API Documentation

Once the server is running, you can access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
