from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Article, Abstract
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
