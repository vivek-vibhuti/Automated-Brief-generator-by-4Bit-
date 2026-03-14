from typing import List, Dict
import tiktoken

class SemanticChunker:
    def __init__(self, chunk_size=1000, chunk_overlap=200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
    
    def chunk_text(self, text: str, metadata: Dict) -> List[Dict]:
        """Split text into overlapping chunks"""
        sentences = text.replace('\n', ' ').split('. ')
        chunks = []
        current_chunk = []
        current_size = 0
        
        for sentence in sentences:
            if not sentence.strip():
                continue
                
            sentence_tokens = len(self.tokenizer.encode(sentence))
            
            if current_size + sentence_tokens > self.chunk_size and current_chunk:
                # Save current chunk
                chunk_text = '. '.join(current_chunk)
                if not chunk_text.endswith('.'):
                    chunk_text += '.'
                    
                chunks.append({
                    'content': chunk_text,
                    'metadata': {**metadata, 'chunk_id': f"chunk_{len(chunks)}"}
                })
                
                # Keep overlap
                overlap_tokens = 0
                overlap_sentences = []
                for s in reversed(current_chunk):
                    s_tokens = len(self.tokenizer.encode(s))
                    if overlap_tokens + s_tokens <= self.chunk_overlap:
                        overlap_sentences.insert(0, s)
                        overlap_tokens += s_tokens
                    else:
                        break
                current_chunk = overlap_sentences
                current_size = overlap_tokens
            
            current_chunk.append(sentence)
            current_size += sentence_tokens
        
        # Add final chunk
        if current_chunk:
            chunk_text = '. '.join(current_chunk)
            if not chunk_text.endswith('.'):
                chunk_text += '.'
            chunks.append({
                'content': chunk_text,
                'metadata': {**metadata, 'chunk_id': f"chunk_{len(chunks)}"}
            })
        
        return chunks