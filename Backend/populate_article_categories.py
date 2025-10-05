#!/usr/bin/env python3
import asyncio
import argparse
import json
from dataclasses import dataclass
from typing import List, Dict, Set, Tuple

from sqlalchemy.orm import Session

from database import SessionLocal
from models import Article, ArticleCategory
from moduleAI import LocalOpenAIProcessor


@dataclass
class CategorySpec:
    id: str
    title: str
    description: str


def load_category_specs(path: str = "categories.json") -> List[CategorySpec]:
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    result: List[CategorySpec] = []
    for item in raw:
        # categories.json uses keys: id, title, description
        result.append(CategorySpec(
            id=item["id"],
            title=item.get("title", ""),
            description=item.get("description", ""),
        ))
    return result


def fetch_articles(session: Session, limit: int = 100, skip: int = 0) -> List[Tuple[int, str]]:
    articles = session.query(Article).offset(skip).limit(limit).all()
    return [(a.id, a.title or "") for a in articles]


def fetch_existing_pairs(session: Session) -> Set[Tuple[int, str]]:
    pairs: Set[Tuple[int, str]] = set()
    for ac in session.query(ArticleCategory).all():
        pairs.add((ac.id_article, ac.category))
    return pairs


def build_system_prompt(categories: List[CategorySpec]) -> str:
    lines = [
        "You are a precise classifier. Your task: map an article title to zero or more category IDs from the provided list.",
        "Rules:",
        "- Only choose IDs from the provided list.",
        "- Prefer 1-2 IDs that best fit.",
        "- If none fit, return an empty array.",
        "Output strictly as compact JSON with shape: {\"categories\": [\"id1\", \"id2\"]}",
        "- No extra keys, no commentary.",
        "",
        "Available categories:"
    ]
    for c in categories:
        lines.append(f"- id={c.id} | title={c.title} | description={c.description}")
    return "\n".join(lines)


def build_user_prompt(title: str) -> str:
    return f"Article title: {title}\nReturn JSON now."


async def classify_titles(
    articles: List[Tuple[int, str]],
    categories: List[CategorySpec],
    processor: LocalOpenAIProcessor,
) -> Dict[int, List[str]]:
    system_prompt = build_system_prompt(categories)
    id_to_categories: Dict[int, List[str]] = {}

    for article_id, title in articles:
        if not title:
            id_to_categories[article_id] = []
            print(f"Processed article {article_id}: 0 categories")
            continue

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": build_user_prompt(title)},
        ]

        try:
            content = await processor.chat(messages=messages, max_tokens=128, temperature=0.0)
        except Exception:
            content = "{}"

        chosen: List[str] = []
        try:
            data = json.loads(content)
            if isinstance(data, dict) and isinstance(data.get("categories"), list):
                # normalize to strings and only keep known ids
                valid_ids = {c.id for c in categories}
                chosen = [str(x) for x in data["categories"] if str(x) in valid_ids]
        except Exception:
            chosen = []

        # Progress output per article
        try:
            print(f"Processed article {article_id}: {len(chosen)} categories")
        except Exception:
            # Ensure progress reporting never breaks the flow
            pass

        id_to_categories[article_id] = chosen

    return id_to_categories


def persist_article_categories(
    session: Session,
    id_to_categories: Dict[int, List[str]],
    existing_pairs: Set[Tuple[int, str]],
) -> int:
    inserted = 0
    for article_id, cats in id_to_categories.items():
        for cat_id in cats:
            pair = (article_id, cat_id)
            if pair in existing_pairs:
                continue
            session.add(ArticleCategory(id_article=article_id, category=cat_id))
            existing_pairs.add(pair)
            inserted += 1
    session.commit()
    return inserted


def main() -> None:
    parser = argparse.ArgumentParser(description="Populate article_categories by classifying article titles with AI")
    parser.add_argument("--limit", type=int, default=50, help="Number of articles to process")
    parser.add_argument("--skip", type=int, default=0, help="Number of articles to skip from the start")
    args = parser.parse_args()

    categories = load_category_specs("categories.json")
    processor = LocalOpenAIProcessor()  # Uses local LM Studio per moduleAI configuration

    session: Session = SessionLocal()
    try:
        articles = fetch_articles(session, limit=args.limit, skip=args.skip)
        print(f"Processing {len(articles)} articles (skip={args.skip}, limit={args.limit})")
        existing = fetch_existing_pairs(session)

        id_to_categories = asyncio.run(classify_titles(articles, categories, processor))
        inserted = persist_article_categories(session, id_to_categories, existing)
        print(f"Inserted {inserted} article-category rows.")
    finally:
        session.close()


if __name__ == "__main__":
    main()


