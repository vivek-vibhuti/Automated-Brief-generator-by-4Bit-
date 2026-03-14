from django.db import models
import json

class Document(models.Model):
    """Uploaded documents"""
    file = models.FileField(upload_to='documents/')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title

class DocumentChunk(models.Model):
    """Chunks extracted from documents"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    content = models.TextField()
    page_number = models.IntegerField(null=True, blank=True)
    chunk_index = models.IntegerField()
    embedding_id = models.CharField(max_length=100, blank=True)  # ID in vector store
    metadata = models.JSONField(default=dict)
    
    class Meta:
        ordering = ['document', 'page_number', 'chunk_index']
    
    def __str__(self):
        return f"{self.document.title} - Chunk {self.chunk_index}"

class Presentation(models.Model):
    """Generated presentations"""
    query = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    slides_html = models.TextField()  # Full Reveal.js HTML
    slide_count = models.IntegerField(default=0)
    
    # References to documents used
    source_documents = models.ManyToManyField(Document, through='PresentationSource')
    
    def __str__(self):
        return f"Presentation for: {self.query[:50]}..."

class PresentationSource(models.Model):
    """Track which chunks were used for each slide"""
    presentation = models.ForeignKey(Presentation, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    chunk = models.ForeignKey(DocumentChunk, on_delete=models.CASCADE, null=True)
    slide_index = models.IntegerField()
    relevance_score = models.FloatField(default=0.0)
    
    class Meta:
        ordering = ['presentation', 'slide_index']