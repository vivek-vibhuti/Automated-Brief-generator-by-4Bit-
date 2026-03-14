import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import os
import atexit

# Global singleton instances
_chroma_client = None
_embedding_model = None


class VectorStore:
    def __init__(self, persist_directory="./chroma_db"):
        global _chroma_client, _embedding_model

        self.persist_directory = persist_directory
        os.makedirs(persist_directory, exist_ok=True)

        # ---------- CHROMADB CLIENT ----------
        if _chroma_client is None:
            try:
                print(f"📦 Initializing ChromaDB PersistentClient in {persist_directory}")

                _chroma_client = chromadb.PersistentClient(
                    path=persist_directory,
                    settings=Settings(
                        anonymized_telemetry=False
                    )
                )

                print("✅ ChromaDB PersistentClient created successfully")

                atexit.register(self._cleanup)

            except Exception as e:
                print(f"❌ Error creating ChromaDB client: {e}")
                raise

        self.client = _chroma_client

        # ---------- LOAD EMBEDDING MODEL ----------
        if _embedding_model is None:
            try:
                print("📦 Loading SentenceTransformer model...")

                _embedding_model = SentenceTransformer(
                    "all-MiniLM-L6-v2",
                    device="cpu"
                )

                print("✅ Model loaded successfully")

            except Exception as e:
                print(f"❌ Error loading model: {e}")
                raise

        self.embedding_model = _embedding_model

        # ---------- COLLECTION ----------
        try:
            self.collection = self.client.get_collection("document_chunks")
            print("✅ Using existing ChromaDB collection")

        except Exception:
            print("📦 Creating new ChromaDB collection")

            self.collection = self.client.create_collection(
                name="document_chunks",
                metadata={"hnsw:space": "cosine"}
            )

            print("✅ Collection created")

    def _cleanup(self):
        global _chroma_client
        if _chroma_client:
            print("💾 ChromaDB cleanup triggered")

    # ---------- ADD CHUNKS ----------
    def add_chunks(self, chunks: List[Dict], document_id: int):

        texts = [chunk["content"] for chunk in chunks]

        print(f"📝 Encoding {len(texts)} chunks")

        embeddings = self.embedding_model.encode(
            texts,
            batch_size=32,
            show_progress_bar=True,
            convert_to_numpy=True
        ).tolist()

        ids = [f"doc_{document_id}_{i}" for i in range(len(chunks))]

        metadatas = []

        for i, chunk in enumerate(chunks):

            meta = chunk["metadata"].copy()
            meta["document_id"] = document_id
            meta["chunk_index"] = i

            metadatas.append(meta)

        batch_size = 50

        for i in range(0, len(texts), batch_size):

            batch_end = min(i + batch_size, len(texts))

            self.collection.add(
                embeddings=embeddings[i:batch_end],
                documents=texts[i:batch_end],
                metadatas=metadatas[i:batch_end],
                ids=ids[i:batch_end],
            )

        print(f"✅ Added {len(texts)} chunks")

        return ids

    # ---------- SEARCH ----------
    def search(
        self,
        query: str,
        n_results: int = 10,
        document_ids: Optional[List[int]] = None,
    ) -> List[Dict]:

        print(f"🔍 Searching: {query[:50]}")

        query_embedding = self.embedding_model.encode(
            [query],
            convert_to_numpy=True
        ).tolist()

        where_filter = None

        if document_ids:
            where_filter = {"document_id": {"$in": document_ids}}

        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=n_results,
            where=where_filter,
            include=["documents", "metadatas", "distances"],
        )

        retrieved = []

        if results["ids"] and results["ids"][0]:

            for i in range(len(results["ids"][0])):

                retrieved.append(
                    {
                        "content": results["documents"][0][i],
                        "metadata": results["metadatas"][0][i],
                        "relevance_score": 1 - results["distances"][0][i],
                        "id": results["ids"][0][i],
                    }
                )

        print(f"✅ Retrieved {len(retrieved)} chunks")

        return retrieved

    # ---------- DELETE DOCUMENT ----------
    def delete_document_chunks(self, document_id: int):

        try:

            results = self.collection.get(where={"document_id": document_id})

            if results["ids"]:
                self.collection.delete(ids=results["ids"])

                print(
                    f"✅ Deleted {len(results['ids'])} chunks for document {document_id}"
                )

        except Exception as e:
            print(f"❌ Delete error: {e}")


print("✅ VectorStore module loaded")