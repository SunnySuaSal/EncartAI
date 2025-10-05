#!/usr/bin/env python3
"""
Script to create the articles and abstracts tables in the PostgreSQL database and populate them with data.
Run this script after setting up your database connection.
"""

import json
import csv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL
from models import Article, Abstract

def create_tables_and_populate():
    """Create the articles and abstracts tables and populate them with data if empty."""
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        # Create tables using SQLAlchemy metadata
        from models import Base
        Base.metadata.create_all(bind=engine)
        
        print("✅ Tables created successfully!")
        print("Articles table structure:")
        print("- id: BIGINT PRIMARY KEY")
        print("- title: VARCHAR")
        print("- link: VARCHAR")
        print("\nAbstracts table structure:")
        print("- id_article: INTEGER PRIMARY KEY FOREIGN KEY")
        print("- abstract: VARCHAR")
        
        # Check if tables are empty and populate with data
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        try:
            # Check if articles table has any data
            existing_articles_count = db.query(Article).count()
            existing_abstracts_count = db.query(Abstract).count()
            
            if existing_articles_count == 0:
                print("\n📄 Articles table is empty. Loading data from CSV...")
                
                # Load articles data from CSV file
                articles_data = []
                with open('SB_publication_PMC.csv', 'r', encoding='utf-8-sig') as file:
                    csv_reader = csv.DictReader(file)
                    for row in csv_reader:
                        articles_data.append({
                            'title': row['Title'],
                            'link': row['Link']
                        })
                
                # Insert articles data
                for i, article_data in enumerate(articles_data, 1):
                    article = Article(
                        # id=i,  # Using sequential IDs starting from 1
                        title=article_data['title'],
                        link=article_data['link']
                    )
                    db.add(article)
                
                db.commit()
                print(f"✅ Successfully inserted {len(articles_data)} articles from CSV!")
                print("Sample articles inserted:")
                for i, article_data in enumerate(articles_data[:5], 1):  # Show first 5
                    print(f"  {i}. {article_data['title'][:50]}...")
            else:
                print(f"\n📊 Articles table already contains {existing_articles_count} articles. Skipping data insertion.")
            
            if existing_abstracts_count == 0:
                print("\n📄 Abstracts table is empty. Loading data from JSON...")
                
                # Load abstracts data from JSON file
                with open('sample.json', 'r', encoding='utf-8') as file:
                    abstracts_data = json.load(file)
                
                # Insert abstracts data
                for i, abstract_data in enumerate(abstracts_data, 1):
                    abstract = Abstract(
                        id_article=i,  # Link to corresponding article
                        abstract=abstract_data['abstract']
                    )
                    db.add(abstract)
                
                db.commit()
                print(f"✅ Successfully inserted {len(abstracts_data)} abstracts from JSON!")
                print("Sample abstracts inserted:")
                for i, abstract_data in enumerate(abstracts_data, 1):
                    print(f"  {i}. {abstract_data['abstract'][:100]}...")
            else:
                print(f"\n📊 Abstracts table already contains {existing_abstracts_count} abstracts. Skipping data insertion.")
                
        finally:
            db.close()
        
    except FileNotFoundError as e:
        print(f"❌ Error: File not found - {e}")
        print("Make sure both SB_publication_PMC.csv and sample.json are in the same directory as this script.")
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing sample.json: {e}")
    except Exception as e:
        print(f"❌ Error creating tables or inserting data: {e}")
        print("\nMake sure:")
        print("1. PostgreSQL is running")
        print("2. Database 'mydb' exists")
        print("3. User 'space' has proper permissions")
        print("4. Connection details are correct")
        print("5. Both CSV and JSON files exist and are valid")

if __name__ == "__main__":
    create_tables_and_populate()
