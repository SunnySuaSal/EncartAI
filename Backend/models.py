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
