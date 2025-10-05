from sqlalchemy import Column, BigInteger, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(BigInteger, primary_key=True, index=True)
    title = Column(String, index=True)
    link = Column(String)

class Abstract(Base):
    __tablename__ = "abstracts"
    id_article = Column(Integer, ForeignKey("articles.id"), primary_key=True, nullable=False, index=True)
    abstract = Column(String)
    
    # Relationship to Article
    article = relationship("Article", back_populates="abstracts")

# Add the reverse relationship
Article.abstracts = relationship("Abstract", back_populates="article")

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)

class ArticleCategory(Base):
    __tablename__ = "article_categories"

    id_article = Column(Integer, ForeignKey("articles.id"), primary_key=True, nullable=False, index=True)
    category = Column(String, ForeignKey("categories.id"), primary_key=True, nullable=False, index=True)
    
    # Relationships
    article = relationship("Article")
    category_ref = relationship("Category")
