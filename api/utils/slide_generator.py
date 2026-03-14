from typing import Dict, List
import json
from datetime import datetime

class RevealSlideGenerator:
    def __init__(self):
        self.template = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.4.0/reveal.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.4.0/theme/black.css" id="theme">
    <style>
        .reveal .slides section {{
            text-align: left;
        }}
        .reveal .slides section h1,
        .reveal .slides section h2 {{
            color: #ff6b6b;
            margin-bottom: 30px;
        }}
        .reveal .slides section .citation {{
            font-size: 0.5em;
            color: #888;
            margin-top: 30px;
            border-top: 1px solid #444;
            padding-top: 10px;
        }}
        .stranger-things {{
            background: #111;
            color: #eee;
        }}
    </style>
</head>
<body>
    <div class="reveal stranger-things">
        <div class="slides">
            {slides}
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.4.0/reveal.js"></script>
    <script>
        Reveal.initialize({{
            controls: true,
            progress: true,
            center: true,
            hash: true,
            transition: 'slide',
            fragments: true
        }});
    </script>
</body>
</html>
        """
    
    def generate(self, outline: Dict, references: List[Dict]) -> str:
        """Generate complete Reveal.js HTML"""
        slides_html = ""
        
        # Generate slides from outline
        for i, slide in enumerate(outline.get('slides', [])):
            slide_html = self._generate_slide(slide, i)
            slides_html += slide_html
        
        # Add references slide
        slides_html += self._generate_references_slide(references)
        
        return self.template.format(
            title=outline.get('title', 'Mr. Clarke\'s Briefing'),
            slides=slides_html
        )
    
    def _generate_slide(self, slide: Dict, index: int) -> str:
        """Generate individual slide HTML with animations"""
        slide_type = slide.get('type', 'content')
        title = slide.get('title', '')
        content = slide.get('content', [])
        
        if slide_type == 'title':
            html = f"""
            <section>
                <h1>{title}</h1>
            """
            for i, point in enumerate(content):
                html += f'<p class="fragment" data-fragment-index="{i}">{point}</p>'
            html += "</section>"
            return html
        
        else:
            html = f"""
            <section>
                <h2>{title}</h2>
                <ul>
            """
            for i, point in enumerate(content):
                html += f'<li class="fragment" data-fragment-index="{i}">{point}</li>'
            html += """
                </ul>
            </section>
            """
            return html
    
    def _generate_references_slide(self, references: List[Dict]) -> str:
        html = """
        <section>
            <h2>References</h2>
            <ul style="font-size: 0.7em;">
        """
        for ref in references:
            source = ref.get('source', 'Unknown')
            page = ref.get('page', '')
            snippet = ref.get('snippet', '')[:100] + "..."
            
            html += f"""
            <li class="fragment">
                <strong>{source}</strong>
                {f"(Page {page})" if page else ""}
                <br><small>"{snippet}"</small>
            </li>
            """
        
        html += """
            </ul>
        </section>
        """
        return html