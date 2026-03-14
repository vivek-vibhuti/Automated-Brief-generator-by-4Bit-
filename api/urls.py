from django.urls import path
from . import views
from . import views_stream
urlpatterns = [
    # Document endpoints
    path('documents/upload/', views.upload_document, name='upload-document'),
    path('documents/', views.list_documents, name='list-documents'),
    path('documents/<int:document_id>/', views.delete_document, name='delete-document'),
    
    # Presentation endpoints
    path('presentations/generate/', views.generate_presentation, name='generate-presentation'),
    path('presentations/<int:presentation_id>/', views.get_presentation, name='get-presentation'),
     # NEW: Streaming and export endpoints
    path('presentations/stream/', views_stream.generate_slides_stream, name='generate-stream'),
    path('presentations/export/', views.export_pptx, name='export-pptx'),
]