import asyncio
from playwright.async_api import async_playwright
from typing import Dict

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