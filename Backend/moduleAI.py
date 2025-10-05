from openai import OpenAI
import asyncio
from typing import List, Dict
from gtts import gTTS

class LocalOpenAIProcessor:
    def __init__(self, base_url: str = "http://192.168.137.1:1234/v1", model: str = "openai/gpt-oss-20b"):
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

    async def chat(self, messages: List[Dict[str, str]], max_tokens: int = 512, temperature: float = 0.3) -> str:
        """Chat with the local model using an array of role/content messages.

        Args:
            messages: List of dicts with keys 'role' and 'content'.
            max_tokens: Max tokens for response.
            temperature: Sampling temperature.

        Returns:
            Assistant message content as a string.
        """
        if not messages or not isinstance(messages, list):
            return "Invalid input messages"

        try:
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
            )

            if response.choices and len(response.choices) > 0:
                return response.choices[0].message.content.strip()
            return "No response generated"
        except Exception as e:
            print(f"Local OpenAI API chat error: {e}")
            return "Error contacting local model"