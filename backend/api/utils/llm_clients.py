import os
from groq import Groq
from typing import Dict
import json
import google.genai as genai

class LLMClient:
    def __init__(self, provider: str = "gemini"):
        self.provider = provider
        self._init_client()
    
    def _init_client(self):
        if self.provider == "gemini":
            # NEW: Google GenAI client initialization
            self.client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
            self.model = "gemini-1.5-flash"  # or "gemini-pro"
        
        elif self.provider == "groq":
            self.client = Groq(api_key=os.getenv('GROQ_API_KEY'))
           
            self.model = "llama-3.3-70b-versatile"
        
        else:
            raise ValueError(f"Unsupported provider: {self.provider}. Use 'gemini' or 'groq'")
    
    def generate_slide_outline(self, query: str, context: str, slide_count: int = 5) -> Dict:
        """Generate presentation outline from context"""
        
        prompt = f"""
        You are Mr. Clarke's Automated Briefing Generator. Based on the following documents,
        create a detailed presentation outline about: {query}
        
        Retrieved Documents Context:
        {context}
        
        Generate a {slide_count}-slide presentation outline with:
        1. Title slide
        2. Introduction (2-3 key points)
        3. Main content slides (bullet points)
        4. Conclusion slide
        5. References slide with source citations
        
        Format the response as valid JSON with this structure:
        {{
            "title": "Presentation Title",
            "slides": [
                {{
                    "type": "title",
                    "title": "Slide Title",
                    "content": ["bullet point 1", "bullet point 2"]
                }},
                // more slides...
            ],
            "references": [
                {{
                    "source": "filename.pdf",
                    "page": 5,
                    "snippet": "quoted text"
                }}
            ]
        }}
        
        IMPORTANT: Only return valid JSON, no other text.
        """
        
        if self.provider == "gemini":
            return self._generate_gemini(prompt)
        elif self.provider == "groq":
            return self._generate_groq(prompt)
    
    def _generate_gemini(self, prompt: str) -> Dict:
        try:
            # NEW: Google GenAI API syntax
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            text = response.text
            
            # Extract JSON from response (handle markdown code blocks)
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            
            # Clean the text
            text = text.strip()
            
            # Parse JSON
            return json.loads(text)
            
        except Exception as e:
            print(f"❌ Gemini generation error: {e}")
            print(f"Raw response text: {text if 'text' in locals() else 'No response'}")
            # Return a fallback outline
            return {
                "title": f"Briefing on {query[:50]}...",
                "slides": [
                    {"type": "title", "title": "Introduction", "content": ["Overview of topic"]},
                    {"type": "content", "title": "Key Points", "content": ["Point 1", "Point 2", "Point 3"]},
                    {"type": "content", "title": "Conclusion", "content": ["Summary"]}
                ],
                "references": [{"source": "Mr. Clarke's Documents", "page": 1, "snippet": "Reference material"}]
            }
    
    def _generate_groq(self, prompt: str) -> Dict:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=4000
            )
            text = response.choices[0].message.content
            
            # Extract JSON from response
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            
            text = text.strip()
            return json.loads(text)
            
        except Exception as e:
            print(f"❌ Groq generation error: {e}")
            # Return a fallback outline
            return {
                "title": f"Briefing on {query[:50]}...",
                "slides": [
                    {"type": "title", "title": "Introduction", "content": ["Overview of topic"]},
                    {"type": "content", "title": "Key Points", "content": ["Point 1", "Point 2", "Point 3"]},
                    {"type": "content", "title": "Conclusion", "content": ["Summary"]}
                ],
                "references": [{"source": "Mr. Clarke's Documents", "page": 1, "snippet": "Reference material"}]
            }