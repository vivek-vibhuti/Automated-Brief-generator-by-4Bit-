from .vector_store import VectorStore
from typing import List, Dict, Optional
import traceback
import os  # Moved import to top

class RAGRetriever:
    # Class-level singleton to prevent multiple instances
    _instance = None
    _vector_store = None
    
    def __new__(cls):
        """Singleton pattern to ensure only one instance exists"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        """Initialize the retriever with error handling for ChromaDB conflicts"""
        if hasattr(self, '_initialized') and self._initialized:
            return
            
        self.vector_store = None
        self._initialize_vector_store()
        self._initialized = True
    
    def _initialize_vector_store(self):
        """Try to initialize vector store, handle conflicts gracefully"""
        # If we already have a vector store at class level, reuse it
        if RAGRetriever._vector_store is not None:
            self.vector_store = RAGRetriever._vector_store
            print("✅ RAGRetriever: Reusing existing VectorStore")
            return
        
        try:
            # First attempt
            self.vector_store = VectorStore()
            RAGRetriever._vector_store = self.vector_store
            print("✅ RAGRetriever: VectorStore initialized")
            
        except Exception as e:
            error_str = str(e)
            print(f"⚠️ RAGRetriever initialization error: {error_str[:100]}")
            
            # Check if it's the "already exists" error
            if "already exists" in error_str.lower() or "instance" in error_str.lower():
                print("⚠️ ChromaDB instance conflict detected, using fallback...")
                self.vector_store = FallbackVectorStore()
                RAGRetriever._vector_store = self.vector_store
            else:
                print(f"❌ RAGRetriever initialization failed: {e}")
                traceback.print_exc()
                # Use fallback for any error
                self.vector_store = FallbackVectorStore()
                RAGRetriever._vector_store = self.vector_store
    
    def retrieve_context(self, query: str, document_ids: Optional[List[int]] = None, 
                         top_k: int = 10) -> str:
        """Retrieve relevant context for query"""
        try:
            if not self.vector_store:
                return ""
            
            results = self.vector_store.search(query, n_results=top_k, document_ids=document_ids)
            
            if not results:
                return ""
            
            # Format context with source information
            context_parts = []
            for r in results:
                source = r['metadata'].get('document_title', 'Unknown')
                page = r['metadata'].get('page', '')
                
                context_parts.append(
                    f"[Source: {source}" + (f", Page {page}" if page else "") + "]\n"
                    f"{r['content']}\n"
                )
            
            return "\n---\n".join(context_parts)
        
        except Exception as e:
            print(f"❌ Error in retrieve_context: {e}")
            traceback.print_exc()
            return ""
    
    # FIXED: Properly indented method
    def get_chunks_for_streaming(self, query: str, document_ids: Optional[List[int]] = None, top_k: int = 15) -> List[Dict]:
        """Get chunks with full metadata for streaming"""
        try:
            if not self.vector_store:
                return []
                
            results = self.vector_store.search(query, n_results=top_k, document_ids=document_ids)
            
            chunks = []
            for r in results:
                chunks.append({
                    'content': r['content'],
                    'source': r['metadata'].get('document_title', 'Unknown'),
                    'page': r['metadata'].get('page', ''),
                    'relevance': r.get('relevance_score', 0.0)
                })
            
            return chunks
        except Exception as e:
            print(f"❌ Error getting chunks for streaming: {e}")
            traceback.print_exc()
            return []
    
    def get_references(self, query: str, document_ids: Optional[List[int]] = None,
                       top_k: int = 5) -> List[Dict]:
        """Get references for citations"""
        try:
            if not self.vector_store:
                return []
            
            results = self.vector_store.search(query, n_results=top_k, document_ids=document_ids)
            
            references = []
            for r in results:
                references.append({
                    'source': r['metadata'].get('document_title', 'Unknown'),
                    'page': r['metadata'].get('page', ''),
                    'snippet': r['content'][:200] + "..." if len(r['content']) > 200 else r['content'],
                    'relevance': round(r.get('relevance_score', 0.0), 2)
                })
            
            return references
        
        except Exception as e:
            print(f"❌ Error in get_references: {e}")
            traceback.print_exc()
            return []


class FallbackVectorStore:
    """A fallback vector store that returns empty results when ChromaDB fails"""
    
    def __init__(self):
        print("⚠️ Using FallbackVectorStore (no actual vector search)")
        # You could add a simple in-memory cache here if needed
    
    def search(self, query: str, n_results: int = 10, document_ids: Optional[List[int]] = None) -> List[Dict]:
        """Return empty results gracefully"""
        # For debugging, you could return mock data
        if os.getenv('DEBUG_MOCK_DATA', 'False').lower() == 'true':
            print("🔧 Returning mock data for testing")
            return [
                {
                    'content': 'Sample content from Mr. Clarke\'s documents about the Upside Down.',
                    'metadata': {'document_title': 'mock_doc.pdf', 'page': 1},
                    'relevance_score': 0.95,
                    'id': 'mock_1'
                }
            ]
        
        # Normal operation - return empty
        print(f"ℹ️ FallbackVectorStore.search called (returning empty)")
        return []