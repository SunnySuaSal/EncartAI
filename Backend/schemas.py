from pydantic import BaseModel
from typing import Optional, List

class ArticleBase(BaseModel):
    title: str
    link: str

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    link: Optional[str] = None

class Article(ArticleBase):
    id: int

    class Config:
        from_attributes = True

class AbstractBase(BaseModel):
    id_article: int
    abstract: str

class AbstractCreate(AbstractBase):
    pass

class AbstractUpdate(BaseModel):
    abstract: Optional[str] = None

class Abstract(AbstractBase):
    class Config:
        from_attributes = True

class ArticleWithAbstracts(Article):
    abstracts: List[Abstract] = []

class AbstractSearchResult(BaseModel):
    id: int
    title: str
    link: str
    # abstract: str

    class Config:
        from_attributes = True

class ArticleSearchResult(BaseModel):
    id: int
    title: str
    link: str

    class Config:
        from_attributes = True

class CategoryCount(BaseModel):
    category_id: str
    count: int

    class Config:
        from_attributes = True


# Chat schemas
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    max_tokens: Optional[int] = 512
    temperature: Optional[float] = 0.3

class ChatResponse(BaseModel):
    content: str
