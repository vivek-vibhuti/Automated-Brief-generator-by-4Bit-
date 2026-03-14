from rest_framework import serializers
from .models import Document, DocumentChunk, Presentation

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'uploaded_at', 'processed']
        read_only_fields = ['id', 'uploaded_at', 'processed']

class DocumentUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    title = serializers.CharField(required=False, max_length=255)

class QuerySerializer(serializers.Serializer):
    query = serializers.CharField(required=True, min_length=3)
    document_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="Optional: Limit search to specific documents"
    )
    slide_count = serializers.IntegerField(default=5, min_value=3, max_value=15)
    llm_provider = serializers.ChoiceField(
        choices=['gemini', 'groq', 'anthropic'],
        default='gemini',
        required=False
    )

class PresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presentation
        fields = ['id', 'query', 'created_at', 'slides_html', 'slide_count']