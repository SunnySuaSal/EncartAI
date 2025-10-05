from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from models import Article, Abstract, Category, ArticleCategory
from schemas import ArticleCreate, ArticleUpdate, AbstractCreate, AbstractUpdate

def get_article(db: Session, article_id: int):
    return db.query(Article).filter(Article.id == article_id).first()

def get_articles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Article).offset(skip).limit(limit).all()

def create_article(db: Session, article: ArticleCreate):
    db_article = Article(title=article.title, abstract=article.abstract)
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def update_article(db: Session, article_id: int, article: ArticleUpdate):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if db_article:
        update_data = article.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_article, field, value)
        db.commit()
        db.refresh(db_article)
    return db_article

def delete_article(db: Session, article_id: int):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if db_article:
        db.delete(db_article)
        db.commit()
    return db_article

def search_articles(db: Session, query: str, skip: int = 0, limit: int = 100):
    """Search articles by query in title field."""
    search_filter = Article.title.ilike(f"%{query}%")
    return db.query(Article).filter(search_filter).offset(skip).limit(limit).all()

def search_abstracts(db: Session, query: str, skip: int = 0, limit: int = 100):
    """Search abstracts by query in abstract field and return article information."""
    search_filter = Abstract.abstract.ilike(f"%{query}%")
    return db.query(Article.id, Article.title, Article.link, Abstract.abstract).join(Abstract, Article.id == Abstract.id_article).filter(search_filter).offset(skip).limit(limit).all()

# Abstract CRUD operations
def get_abstract(db: Session, article_id: int):
    return db.query(Abstract).filter(Abstract.id_article == article_id).first()

def get_abstracts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Abstract).offset(skip).limit(limit).all()

def get_abstracts_by_article(db: Session, article_id: int):
    return db.query(Abstract).filter(Abstract.id_article == article_id).all()

def create_abstract(db: Session, abstract: AbstractCreate):
    db_abstract = Abstract(
        id_article=abstract.id_article,
        abstract=abstract.abstract
    )
    db.add(db_abstract)
    db.commit()
    db.refresh(db_abstract)
    return db_abstract

def update_abstract(db: Session, article_id: int, abstract: AbstractUpdate):
    db_abstract = db.query(Abstract).filter(Abstract.id_article == article_id).first()
    if db_abstract:
        update_data = abstract.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_abstract, field, value)
        db.commit()
        db.refresh(db_abstract)
    return db_abstract

def delete_abstract(db: Session, article_id: int):
    db_abstract = db.query(Abstract).filter(Abstract.id_article == article_id).first()
    if db_abstract:
        db.delete(db_abstract)
        db.commit()
    return db_abstract

def search_articles_by_query_and_categories(db: Session, query: str = None, categories: list = None, skip: int = 0, limit: int = 100):
    """
    Search articles by query in title field and filter by categories.
    Returns only article.id, article.title, and article.link.
    
    Args:
        db: Database session
        query: Search query for article title (optional)
        categories: List of category IDs to filter by (optional)
        skip: Number of articles to skip
        limit: Maximum number of articles to return
    
    Returns:
        List of tuples containing (id, title, link)
    """
    # Start with base query selecting only the required fields
    base_query = db.query(Article.id, Article.title, Article.link)
    
    # Apply filters
    filters = []
    
    # Add query filter if provided
    if query and query.strip():
        filters.append(Article.title.ilike(f"%{query.strip()}%"))
    
    # Add category filter if provided
    if categories and len(categories) > 0:
        # Filter out empty strings and None values
        valid_categories = [cat for cat in categories if cat and cat.strip()]
        if valid_categories:
            # Join with ArticleCategory table to filter by categories
            base_query = base_query.join(ArticleCategory, Article.id == ArticleCategory.id_article)
            filters.append(ArticleCategory.category.in_(valid_categories))
    
    # Apply all filters
    if filters:
        base_query = base_query.filter(and_(*filters))
    
    # Apply pagination and return results
    return base_query.offset(skip).limit(limit).all()

def count_articles_by_category(db: Session, category_id: str):
    """
    Count the number of articles in a specific category.
    
    Args:
        db: Database session
        category_id: The category ID to count articles for
    
    Returns:
        Integer count of articles in the category
    """
    if not category_id or not category_id.strip():
        return 0
    
    count = db.query(ArticleCategory).filter(ArticleCategory.category == category_id.strip()).count()
    return count
