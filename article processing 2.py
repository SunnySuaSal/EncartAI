import asyncio
from playwright.async_api import async_playwright
import pandas as pd
import json
import time
from gtts import gTTS
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv
from openai import OpenAI
import re

# Load environment variables
load_dotenv()

class WebScraper:
    def __init__(self):
        self.playwright = None
        self.browser = None

    async def setup(self):
        """Initialize Playwright browser"""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=True)

    async def close(self):
        """Clean up resources"""
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def scrape_page(self, url: str) -> Dict:
        """Scrape a single page"""
        page = await self.browser.new_page()

        try:
            await page.goto(url, wait_until='domcontentloaded', timeout=30000)

            # Extract content - more specific for PubMed articles
            title = await page.title()

            # Try to get the main content area for PubMed articles
            content = await page.evaluate("""
                () => {
                    // Try multiple selectors for PubMed content
                    const selectors = [
                        '#main-content',
                        '.article-body',
                        '.tsec',
                        '.abstract',
                        'article',
                        '.jig-ncbiinpagenav',
                        '.body'
                    ];
                    
                    let content = '';
                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element) {
                            content = element.innerText;
                            break;
                        }
                    }
                    
                    // Fallback to body if no specific content found
                    if (!content) {
                        const body = document.querySelector('body');
                        content = body ? body.innerText : '';
                    }
                    
                    return content;
                }
            """)

            return {
                'url': url,
                'title': title,
                'text': content.strip(),
                'success': True
            }

        except Exception as e:
            return {
                'url': url,
                'error': str(e),
                'success': False
            }
        finally:
            await page.close()


class LocalOpenAIProcessor:
    def __init__(self, base_url: str = "http://127.0.0.1:1234/v1", model: str = "openai/gpt-oss-20b"):
        self.base_url = base_url
        self.model = model

        # Initialize OpenAI client for local LM Studio
        self.client = OpenAI(
            base_url=base_url,
            api_key="lm-studio"  # not needed for LM Studio, but required by client
        )

    async def process_scraped_data(self, data: List[Dict]) -> List[Dict]:
        """Process scraped data with local OpenAI API"""
        processed_data = []

        for i, item in enumerate(data):
            if not item['success']:
                processed_data.append(item)
                continue

            try:
                print(f"Processing article {i+1}/{len(data)}: {item.get('title', 'Unknown')}")

                # Avoid rate limiting
                await asyncio.sleep(1)

                summary = await self._summarize_with_local_model(item['text'])

                # Generate audio from summary
                audio = gTTS(text=summary, lang='en', slow=False)
                audio.save("transcript.mp3")

                processed_data.append({
                    **item,
                    'summary': summary,
                    'processed': True
                })

            except Exception as e:
                print(f"Error processing {item['url']}: {str(e)}")
                processed_data.append({**item, 'processed': False, 'error': str(e)})

        return processed_data

    async def _summarize_with_local_model(self, text: str) -> str:
        """Generate a summary using local OpenAI model"""
        if not text.strip():
            return "No content available"

        # Truncate text to avoid token limits
        truncated_text = text[:4000]  # reasonable limit

        try:
            # Use asyncio.to_thread to make the sync API call async
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert scientific research summarizer. Provide clear, concise summaries of research articles."
                    },
                    {
                        "role": "user",
                        "content": (
                            "Summarize the following scientific article text in 3-4 concise sentences, "
                            "focusing on the research goal, methods, key findings, and conclusions:\n\n"
                            f"{truncated_text}"
                        )
                    }
                ],
                max_tokens=350,
                temperature=0.3
            )

            # Extract the summary from response
            if response.choices and len(response.choices) > 0:
                return response.choices[0].message.content.strip()
            else:
                return "Summary generation failed - no response content"

        except Exception as e:
            print(f"Local OpenAI API error: {e}")
            # Fallback: return first 200 characters if API fails
            return f"Error generating summary. First 200 chars: {text[:200]}..."

    def test_connection(self) -> bool:
        """Test connection to local OpenAI API"""
        try:
            models = self.client.models.list()
            print("Connected to local OpenAI API. Available models:")
            for model in models.data:
                print(f" - {model.id}")
            return True
        except Exception as e:
            print(f"Failed to connect to local OpenAI API: {e}")
            print("Make sure LM Studio is running with the server active")
            return False


class PubMedArticleManager:
    def __init__(self, csv_path: str):
        self.csv_path = csv_path

    def find_articles_by_topic(self, topic: str, max_articles: int = 10) -> List[Dict]:
        """
        Find articles related to a specific topic in the CSV file.

        Args:
            topic: String to search for in article titles (case-insensitive)
            max_articles: Maximum number of articles to return (default: 10)

        Returns:
            List of article dictionaries matching the topic
        """
        articles = []

        try:
            df = pd.read_csv(self.csv_path)

            # Validate required columns
            if 'Title' not in df.columns or 'Link' not in df.columns:
                raise ValueError("CSV must contain 'title' and 'Link' columns")

            print(f"Searching for articles about '{topic}'...")

            # Filter for PubMed Central articles that match the topic
            matching_count = 0
            for _, row in df.iterrows():
                link = str(row['Link'])
                title = str(row['Title'])

                # Check if it's a PubMed article and matches the topic
                if ('ncbi.nlm.nih.gov/pmc/articles' in link and
                        self._matches_topic(title, topic)):

                    articles.append({
                        'Title': title,
                        'Link': link,
                        'match_score': self._calculate_match_score(title, topic)
                    })
                    matching_count += 1

                    # Stop if we've reached the maximum
                    if matching_count >= max_articles:
                        break

            # Sort by match score (higher score = better match)
            articles.sort(key=lambda x: x['match_score'], reverse=True)

            # Remove match_score from final result
            for article in articles:
                del article['match_score']

            print(f"Found {len(articles)} articles about '{topic}'")
            return articles

        except Exception as e:
            print(f"Error searching articles: {e}")
            return []

    def _matches_topic(self, title: str, topic: str) -> bool:
        """Check if title matches the topic (case-insensitive with word boundaries)"""
        # Create a regex pattern that matches whole words
        pattern = r'\b' + re.escape(topic.lower()) + r'\b'
        return re.search(pattern, title.lower()) is not None

    def _calculate_match_score(self, title: str, topic: str) -> int:
        """Calculate how well the title matches the topic"""
        title_lower = title.lower()
        topic_lower = topic.lower()

        score = 0

        # Exact match gets highest score
        if topic_lower in title_lower:
            score += 10

        # Word boundary matches get good score
        if re.search(r'\b' + re.escape(topic_lower) + r'\b', title_lower):
            score += 5

        # Multiple occurrences increase score
        score += title_lower.count(topic_lower) * 2

        # Topic at beginning of title gets bonus
        if title_lower.startswith(topic_lower):
            score += 3

        return score

    def get_all_articles(self, max_articles: int = None) -> List[Dict]:
        """Get all PubMed articles from CSV (without topic filtering)"""
        articles = []

        try:
            df = pd.read_csv(self.csv_path)

            # Validate required columns
            if 'Title' not in df.columns or 'Link' not in df.columns:
                raise ValueError("CSV must contain 'Title' and 'Link' columns")

            # Filter for PubMed Central articles and limit if specified
            for _, row in df.iterrows():
                link = str(row['Link'])
                if 'ncbi.nlm.nih.gov/pmc/articles' in link:
                    articles.append({
                        'Title': row['Title'],
                        'Link': link
                    })

            # Apply max articles limit
            if max_articles and len(articles) > max_articles:
                articles = articles[:max_articles]

            print(f"Loaded {len(articles)} PubMed articles from CSV")
            return articles

        except Exception as e:
            print(f"Error loading CSV: {e}")
            return []

    def save_results(self, processed_data: List[Dict], output_file: str = "results.csv"):
        """Save processed results to CSV"""
        try:
            # Prepare data for CSV
            output_data = []
            for item in processed_data:
                output_data.append({
                    'Title': item.get('Title', ''),
                    'url': item.get('url', ''),
                    'summary': item.get('summary', ''),
                    'success': item.get('success', False),
                    'processed': item.get('processed', False),
                    'error': item.get('error', '')
                })

            df = pd.DataFrame(output_data)
            df.to_csv(output_file, index=False)
            print(f"Results saved to {output_file}")

        except Exception as e:
            print(f"Error saving results: {e}")


async def scrape_articles(article_list: List[Dict], batch_size: int = 3) -> List[Dict]:
    """Scrape multiple articles with batching and rate limiting"""
    scraper = WebScraper()
    await scraper.setup()

    scraped_data = []

    try:
        for i in range(0, len(article_list), batch_size):
            batch = article_list[i:i + batch_size]
            print(f"Scraping batch {i//batch_size + 1}/{(len(article_list)-1)//batch_size + 1}")

            # Scrape batch concurrently
            tasks = []
            for article in batch:
                tasks.append(scraper.scrape_page(article['Link']))

            batch_results = await asyncio.gather(*tasks)

            # Add titles to results
            for j, result in enumerate(batch_results):
                if result['success']:
                    result['Title'] = batch[j]['Title']
                else:
                    result['Title'] = batch[j]['Title']
                    result['error'] = result.get('error', 'Unknown scraping error')

            scraped_data.extend(batch_results)

            # Rate limiting between batches
            if i + batch_size < len(article_list):
                print("Waiting 1 second before next batch...")
                await asyncio.sleep(1)

    except Exception as e:
        print(f"Error during scraping: {e}")
    finally:
        await scraper.close()

    return scraped_data


async def process_articles_from_csv(csv_path: str, topic: Optional[str] = None, max_articles: int = 10):
    """
    Main function to process articles from CSV with optional topic filtering.

    Args:
        csv_path: Path to the CSV file with articles
        topic: Optional topic to filter articles by (word or phrase)
        max_articles: Maximum number of articles to process (default: 10)
    """
    try:
        # Step 1: Load articles from CSV
        print("Loading articles from CSV...")
        article_manager = PubMedArticleManager(csv_path)

        if topic:
            # Find articles matching the topic
            articles = article_manager.find_articles_by_topic(topic, max_articles)
        else:
            # Get all articles up to max_articles
            articles = article_manager.get_all_articles(max_articles)

        if not articles:
            print("No articles found to process.")
            return

        # Step 2: Scrape articles
        print(f"Scraping {len(articles)} articles...")
        scraped_data = await scrape_articles(articles, batch_size=2)

        # Step 3: Process with Local OpenAI
        print("Initializing Local OpenAI processor...")
        processor = LocalOpenAIProcessor()

        # Test connection first
        if not processor.test_connection():
            print("Warning: Could not connect to local OpenAI API. Continuing anyway...")

        print("Processing articles with local AI...")
        processed_data = await processor.process_scraped_data(scraped_data)

        # Step 4: Save results
        output_file = f"processed_articles_{topic.replace(' ', '_') if topic else 'all'}.csv"
        article_manager.save_results(processed_data, output_file)

        # Step 5: Print summary
        successful = [d for d in processed_data if d.get('success')]
        processed = [d for d in successful if d.get('processed')]

        print(f"\n--- Processing Summary ---")
        if topic:
            print(f"Topic: {topic}")
        print(f"Total articles processed: {len(articles)}")
        print(f"Successfully scraped: {len(successful)}")
        print(f"Successfully processed with AI: {len(processed)}")
        print(f"Results saved to: {output_file}")



    except Exception as e:
        print(f"Error in processing: {str(e)}")
        import traceback
        traceback.print_exc()


def create_sample_csv():
    """Create a sample CSV file with diverse articles for testing"""
    sample_data = [
        {
            'Title': 'COVID-19 Vaccine Efficacy Study',
            'Link': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11386075/'
        },
        {
            'Title': 'Cancer Immunotherapy Research',
            'Link': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5498037/'
        },
        {
            'Title': 'Diabetes Treatment with Metformin',
            'Link': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11223344/'
        },
        {
            'Title': 'COVID-19 Long-term Effects',
            'Link': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11445567/'
        },
        {
            'Title': 'Cancer Genomics and Personalized Medicine',
            'Link': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5532123/'
        },
        {
            'Title': 'Mental Health During COVID-19 Pandemic',
            'Link': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11556678/'
        },
        {
            'Title': 'Advances in Cancer Detection Methods',
            'Link': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5543211/'
        },
        {
            'Title': 'Diabetes Prevention Strategies',
            'Link': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11223345/'
        }
    ]

    df = pd.DataFrame(sample_data)
    df.to_csv('pmc_articles.csv', index=False)
    print("Sample CSV file 'pmc_articles.csv' created with 8 example articles")


if __name__ == "__main__":
    # Create sample CSV if it doesn't exist
    if not os.path.exists('pmc_articles.csv'):
        create_sample_csv()

    # Example usage patterns:

    # 1. Process all articles (max 10)
    print("=== Processing all articles (max 10) ===")
    asyncio.run(process_articles_from_csv("pmc_articles.csv"))

    print("\n" + "="*50 + "\n")

    # 2. Process articles about chosen topic  (max 10 articles)
    topic = 'cheese'     # <- Here goes the search query
    print("=== Processing articles about " + topic + " ===")
    asyncio.run(process_articles_from_csv("pmc_articles.csv", topic))

    print("\n" + "="*50 + "\n")