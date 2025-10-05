from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine
from models import Base
from schemas import Article, ArticleCreate, ArticleUpdate, Abstract, AbstractCreate, AbstractUpdate, ArticleWithAbstracts, AbstractSearchResult, ArticleSearchResult, CategoryCount
from crud import (
    get_article, get_articles, create_article, update_article, delete_article, search_articles,
    get_abstract, get_abstracts, create_abstract, update_abstract, delete_abstract, search_abstracts,
    get_abstracts_by_article, search_articles_by_query_and_categories, count_articles_by_category
)
from schemas import ChatRequest, ChatResponse
from moduleAI import LocalOpenAIProcessor

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Article API", description="A simple API for managing articles")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"], # Métodos permitidos
    allow_headers=["*"], # Encabezados permitidos
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Article API"}

@app.post("/articles/", response_model=Article)
async def create_new_article(article: ArticleCreate, db: Session = Depends(get_db)):
    return create_article(db=db, article=article)

@app.get("/articles/", response_model=list[Article])
async def read_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    articles = get_articles(db, skip=skip, limit=limit)
    return articles

@app.get("/articles/{article_id}", response_model=Article)
async def read_article(article_id: int, db: Session = Depends(get_db)):
    db_article = get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@app.put("/articles/{article_id}", response_model=Article)
async def update_existing_article(article_id: int, article: ArticleUpdate, db: Session = Depends(get_db)):
    db_article = update_article(db, article_id=article_id, article=article)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@app.delete("/articles/{article_id}", response_model=Article)
async def delete_existing_article(article_id: int, db: Session = Depends(get_db)):
    db_article = delete_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@app.get("/articles/search/", response_model=list[Article])
async def search_articles_endpoint(
    q: str, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Search articles by query in title field.
    
    - **q**: Search query (required)
    - **skip**: Number of articles to skip (default: 0)
    - **limit**: Maximum number of articles to return (default: 100)
    """
    if not q.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    articles = search_articles(db, query=q.strip(), skip=skip, limit=limit)
    return articles

# Abstract endpoints
@app.post("/abstracts/", response_model=Abstract)
async def create_new_abstract(abstract: AbstractCreate, db: Session = Depends(get_db)):
    return create_abstract(db=db, abstract=abstract)

@app.get("/abstracts/", response_model=list[Abstract])
async def read_abstracts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    abstracts = get_abstracts(db, skip=skip, limit=limit)
    return abstracts

@app.get("/abstracts/{article_id}", response_model=Abstract)
async def read_abstract(article_id: int, db: Session = Depends(get_db)):
    db_abstract = get_abstract(db, article_id=article_id)
    if db_abstract is None:
        raise HTTPException(status_code=404, detail="Abstract not found")
    return db_abstract

@app.put("/abstracts/{article_id}", response_model=Abstract)
async def update_existing_abstract(article_id: int, abstract: AbstractUpdate, db: Session = Depends(get_db)):
    db_abstract = update_abstract(db, article_id=article_id, abstract=abstract)
    if db_abstract is None:
        raise HTTPException(status_code=404, detail="Abstract not found")
    return db_abstract

@app.delete("/abstracts/{article_id}", response_model=Abstract)
async def delete_existing_abstract(article_id: int, db: Session = Depends(get_db)):
    db_abstract = delete_abstract(db, article_id=article_id)
    if db_abstract is None:
        raise HTTPException(status_code=404, detail="Abstract not found")
    return db_abstract

@app.get("/abstracts/search/", response_model=list[AbstractSearchResult])
async def search_abstracts_endpoint(
    q: str, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Search abstracts by query in abstract field and return article information.
    
    - **q**: Search query (required)
    - **skip**: Number of abstracts to skip (default: 0)
    - **limit**: Maximum number of abstracts to return (default: 100)
    """
    if not q.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    results = search_abstracts(db, query=q.strip(), skip=skip, limit=limit)
    # Convert tuple results to dictionary format for the schema
    search_results = []
    for result in results:
        search_results.append({
            "id": result[0],  # Article.id
            "title": result[1],  # Article.title
            "link": result[2],  # Article.link
            "abstract": result[3]  # Abstract.abstract
        })
    return search_results

@app.get("/articles/{article_id}/abstracts", response_model=list[Abstract])
async def get_article_abstracts(article_id: int, db: Session = Depends(get_db)):
    """Get all abstracts for a specific article."""
    abstracts = get_abstracts_by_article(db, article_id=article_id)
    return abstracts

@app.get("/articles/search/advanced/", response_model=list[ArticleSearchResult])
async def search_articles_advanced(
    q: str = None, 
    categories: str = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Advanced search for articles by query and categories.
    Returns only article.id, article.title, and article.link.
    
    - **q**: Search query for article title (optional)
    - **categories**: Comma-separated list of category IDs to filter by (optional)
    - **skip**: Number of articles to skip (default: 0)
    - **limit**: Maximum number of articles to return (default: 100)
    
    Example categories: "biologia,microgravedad,tecnologia"
    """
    # Parse categories if provided
    category_list = None
    if categories and categories.strip():
        category_list = [cat.strip() for cat in categories.split(',') if cat.strip()]
    
    # Search articles using the new CRUD function
    results = search_articles_by_query_and_categories(
        db=db, 
        query=q, 
        categories=category_list, 
        skip=skip, 
        limit=limit
    )
    
    # Convert tuple results to dictionary format for the schema
    search_results = []
    for result in results:
        search_results.append({
            "id": result[0],  # Article.id
            "title": result[1],  # Article.title
            "link": result[2]   # Article.link
        })
    
    return search_results

@app.get("/categories/{category_id}/count", response_model=CategoryCount)
async def get_category_article_count(category_id: str, db: Session = Depends(get_db)):
    """
    Get the number of articles in a specific category.
    
    - **category_id**: The category ID to count articles for (e.g., "biologia", "microgravedad", "tecnologia")
    
    Returns the category ID and the count of articles in that category.
    """
    if not category_id or not category_id.strip():
        raise HTTPException(status_code=400, detail="Category ID cannot be empty")
    
    count = count_articles_by_category(db, category_id)
    
    return {
        "category_id": category_id,
        "count": count
    }

# Chat endpoint leveraging LocalOpenAIProcessor (LM Studio)
processor = LocalOpenAIProcessor()

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    # Ensure system prompt exists for safety
    messages = payload.messages
    if not any(m.role == "system" for m in messages):
        messages = ([{"role": "system", "content": "You are a helpful research assistant."}] +
                    [m.model_dump() for m in messages])
    else:
        messages = [m.model_dump() for m in messages]

    content = await processor.chat(
        messages=messages,
        max_tokens=payload.max_tokens or 512,
        temperature=payload.temperature or 0.3,
    )
    return ChatResponse(content=content)
