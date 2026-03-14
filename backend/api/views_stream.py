import json
import asyncio
from django.http import StreamingHttpResponse
from django.views.decorators.http import require_GET
from .utils.rag_retriever import RAGRetriever
from .utils.llm_clients import LLMClient
import logging

logger = logging.getLogger(__name__)

@require_GET
def generate_slides_stream(request):
    """Streaming endpoint that sends slides one by one as they're generated"""
    session_id = request.GET.get('session_id', 'default')
    question = request.GET.get('question', '')
    document_ids = request.GET.getlist('doc_ids[]', [])
    provider = request.GET.get('provider', 'gemini')
    
    if not question:
        return StreamingHttpResponse(
            f"data: {json.dumps({'error': 'No question provided'})}\n\n",
            content_type='text/event-stream'
        )
    
    def event_stream():
        try:
            # 1. Retrieve relevant chunks
            retriever = RAGRetriever()
            chunks = retriever.get_chunks_for_streaming(
                question, 
                document_ids=[int(id) for id in document_ids] if document_ids else None,
                top_k=15
            )
            
            # 2. Format context for LLM
            context = "\n\n".join([
                f"[Source: {c['source']}, Page {c['page']}]\n{c['content'][:500]}..."
                for c in chunks
            ])
            
            # 3. Stream from LLM
            llm = LLMClient(provider=provider)
            
            # Build the special streaming prompt
            prompt = build_streaming_prompt(question, context)
            
            # Get streaming response from LLM
            if provider == "gemini":
                yield from stream_from_gemini(llm, prompt)
            elif provider == "groq":
                yield from stream_from_groq(llm, prompt)
            else:
                yield from stream_from_claude(llm, prompt)  # if you add Claude back
            
            # Send completion message
            yield f"data: {json.dumps({'done': True, 'total_slides': '?'})}\n\n"
            
        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'  # Disable nginx buffering
    return response

def build_streaming_prompt(question, context):
    return f"""You are generating an animated presentation with 5-7 slides.
For EACH slide, output a complete JSON object followed by the marker <<<SLIDE_END>>>

QUESTION: {question}

CONTEXT FROM DOCUMENTS:
{context}

Generate slides in this exact JSON format:
{{
  "title": "Slide Title",
  "bullets": ["First bullet point", "Second bullet point", "Third bullet point"],
  "chart": null,
  "sources": ["Document1.pdf p.3", "Document2.pdf p.7"]
}}<<<SLIDE_END>>>

RULES:
- Slide 1: Title/Introduction
- Slide 2-4: Key points from context
- Slide 5: Summary/Conclusion
- Slide 6: References slide listing all sources used

IMPORTANT: Output each slide as a complete JSON object with the <<<SLIDE_END>>> marker after each one.
"""

def stream_from_gemini(llm, prompt):
    """Stream from Google Gemini"""
    response = llm.client.models.generate_content_stream(
        model=llm.model,
        contents=prompt
    )
    
    buffer = ""
    for chunk in response:
        if chunk.text:
            buffer += chunk.text
            # Check for complete slides
            while "<<<SLIDE_END>>>" in buffer:
                slide_json, buffer = buffer.split("<<<SLIDE_END>>>", 1)
                try:
                    # Clean and validate JSON
                    slide_json = slide_json.strip()
                    if slide_json:
                        # Parse to ensure it's valid, then send
                        json.loads(slide_json)
                        yield f"data: {json.dumps({'slide': slide_json})}\n\n"
                except json.JSONDecodeError:
                    # If not valid JSON yet, continue buffering
                    buffer = slide_json + "<<<SLIDE_END>>>" + buffer
                    break

def stream_from_groq(llm, prompt):
    """Stream from Groq"""
    stream = llm.client.chat.completions.create(
        model=llm.model,
        messages=[{"role": "user", "content": prompt}],
        stream=True,
        temperature=0.7
    )
    
    buffer = ""
    for chunk in stream:
        if chunk.choices[0].delta.content:
            buffer += chunk.choices[0].delta.content
            while "<<<SLIDE_END>>>" in buffer:
                slide_json, buffer = buffer.split("<<<SLIDE_END>>>", 1)
                try:
                    slide_json = slide_json.strip()
                    if slide_json:
                        json.loads(slide_json)
                        yield f"data: {json.dumps({'slide': slide_json})}\n\n"
                except json.JSONDecodeError:
                    buffer = slide_json + "<<<SLIDE_END>>>" + buffer
                    break