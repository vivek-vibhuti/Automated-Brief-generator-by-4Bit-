# 📋 **Complete README.md for Mr. Clarke's Automated Briefing Generator**

```markdown
# Mr. Clarke's Automated Briefing Generator

> *"The party needs to visually brief the town sheriff and other allies."*  
> — Stranger Things, Project Directive 3

![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![Python](https://img.shields.io/badge/python-3.13-blue)
![Django](https://img.shields.io/badge/django-6.0-success)
![Next.js](https://img.shields.io/badge/next.js-16.1-black)
![License](https://img.shields.io/badge/license-MIT-orange)

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

## 🎯 Overview

Mr. Clarke, Hawkins' beloved science teacher, has mysteriously disappeared, leaving behind a collection of dense physics books, radio manuals, and research notes about the Upside Down. The AV Club needs answers quickly, but reading through hundreds of pages manually would take too long.

This application solves the problem by providing an **AI-powered engine** that ingests documents and automatically generates **animated presentation decks** summarizing complex information. It's perfect for quickly briefing the town sheriff and other allies about the strange phenomena in Hawkins.

### **The Problem**
- 📚 Hundreds of pages of dense scientific documents
- ⏱️ No time to read manually
- 👥 Need to brief multiple people visually
- 🔍 Complex physics concepts need simplification

### **Our Solution**
- 🤖 AI-powered document ingestion and analysis
- 📊 Automatic generation of animated presentations
- ✨ Real-time streaming slides (WOW factor!)
- 📝 Source citations for every fact
- 🎨 Retro Hawkins Lab terminal aesthetic

## ✨ Features

### **Core Features**
| Feature | Description |
|---------|-------------|
| 📄 **Document Ingestion** | Upload PDF, TXT, DOCX files with intelligent chunking |
| 🔍 **Semantic Search** | RAG-based retrieval using ChromaDB and Sentence Transformers |
| 🤖 **Multi-LLM Support** | Google Gemini & Groq with automatic fallback |
| 📊 **Presentation Generation** | Create animated presentations from queries |
| ⚡ **Real-time Streaming** | Slides appear one by one as they're generated |
| 📝 **Source Citations** | Every fact includes document and page references |
| 📈 **Vector Graphics** | Auto-generated charts and graphs |
| 🎨 **Retro UI** | Hawkins Lab terminal aesthetic with CRT effects |

### **Export Options**
| Format | Features |
|--------|----------|
| 📄 **HTML (Reveal.js)** | Animated web presentations with slide transitions |
| 📊 **PowerPoint** | Professional .pptx with vector graphics |
| 📝 **Editable JSON** | Export slide data for later editing |

## 🛠️ Tech Stack

### **Backend**
```
┌─────────────────────────────────────┐
│         Django 6.0.3                │
│  (REST Framework, CORS, Auth)       │
├─────────────────────────────────────┤
│      Document Processing            │
│  └─ pdfplumber, PyPDF2, python-docx │
├─────────────────────────────────────┤
│      Vector Database                 │
│  └─ ChromaDB with PersistentClient   │
├─────────────────────────────────────┤
│      Embeddings                      │
│  └─ Sentence Transformers (384-dim)  │
├─────────────────────────────────────┤
│      LLM Integration                 │
│  ├─ Google Gemini (gemini-1.5-flash) │
│  └─ Groq (llama-3.3-70b-versatile)   │
├─────────────────────────────────────┤
│      Export Engine                   │
│  ├─ python-pptx for PowerPoint       │
│  ├─ matplotlib for vector graphics   │
│  └─ Reveal.js for HTML exports       │
└─────────────────────────────────────┘
```

### **Frontend**
```
┌─────────────────────────────────────┐
│        Next.js 16.1.6                │
│     (App Router, TypeScript)         │
├─────────────────────────────────────┤
│        Styling                        │
│  ├─ Tailwind CSS v4                   │
│  └─ Custom CRT/terminal effects       │
├─────────────────────────────────────┤
│        State Management               │
│  ├─ React Hooks                       │
│  ├─ Custom hooks (useSlideStream)     │
│  └─ SSE for real-time updates         │
├─────────────────────────────────────┤
│        Visualization                  │
│  ├─ Chart.js for graphs               │
│  ├─ Framer Motion for animations      │
│  └─ Reveal.js for slide display       │
└─────────────────────────────────────┘
```

## 📁 Project Structure

```
project/
├── backend/                           # Django Backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── db.sqlite3
│   ├── briefing_generator/            # Main Django project
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── api/                           # Main application
│       ├── models.py                   # Database models
│       ├── views.py                     # API endpoints
│       ├── views_stream.py              # SSE streaming
│       ├── urls.py                      # API routes
│       ├── serializers.py                # Data serializers
│       └── utils/                       # Utility modules
│           ├── document_processor.py     # PDF/text extraction
│           ├── chunking.py                # Semantic chunking
│           ├── vector_store.py            # ChromaDB operations
│           ├── rag_retriever.py           # RAG implementation
│           ├── llm_clients.py             # Gemini/Groq clients
│           ├── slide_generator.py         # Reveal.js generator
│           └── pptx_export/               # Enhanced PowerPoint export
│               ├── __init__.py
│               ├── enhanced_pptx.py        # Main exporter
│               ├── animations.py           # Slide animations
│               └── vector_graphics.py      # Chart generation
│
└── frontend/                           # Next.js Frontend
    ├── package.json
    ├── .env.local
    ├── next.config.js
    ├── tailwind.config.js
    └── src/
        ├── app/                          # Next.js App Router
        │   ├── layout.tsx
        │   ├── page.tsx                   # Home page
        │   ├── documents/
        │   │   └── page.tsx                # Document management
        │   └── generate/
        │       └── page.tsx                 # Presentation generation
        ├── components/                     # React components
        │   ├── layout/
        │   │   ├── Header.tsx
        │   │   └── Footer.tsx
        │   ├── documents/
        │   │   ├── DocumentUpload.tsx
        │   │   ├── DocumentList.tsx
        │   │   └── DocumentCard.tsx
        │   └── presentation/
        │       ├── QueryForm.tsx
        │       ├── SlideCard.tsx
        │       ├── PresentationViewer.tsx
        │       └── ReferencesList.tsx
        ├── hooks/                          # Custom React hooks
        │   ├── useDocuments.ts
        │   ├── useSlideStream.ts
        │   └── useFileUpload.ts
        ├── services/                       # API services
        │   ├── api.ts
        │   ├── documentService.ts
        │   └── presentationService.ts
        └── types/                           # TypeScript types
            └── index.ts
```

## 📋 Prerequisites

### **System Requirements**
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 2GB free space
- **Python**: 3.13 or higher
- **Node.js**: 20.x or higher
- **npm**: 10.x or higher

### **API Keys** (Free Tier)
| Service | Sign Up Link | Free Tier Limits |
|---------|--------------|------------------|
| **Google Gemini** | [Google AI Studio](https://aistudio.google.com/app/apikey) | 60 requests/minute |
| **Groq** | [Groq Console](https://console.groq.com/keys) | 30 requests/minute |

## 🚀 Installation Guide

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/mr-clarke-briefing-generator.git
cd mr-clarke-briefing-generator
```

### **Step 2: Backend Setup**

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your API keys

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### **Step 3: Frontend Setup**

```bash
# Navigate to frontend folder
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

## ⚙️ Configuration

### **Backend Environment Variables (`.env`)**
```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-this

# API Keys
GEMINI_API_KEY=AIzaSy...  # Your Gemini API key
GROQ_API_KEY=gsk_...       # Your Groq API key

# Default LLM (gemini or groq)
DEFAULT_LLM=gemini
```

### **Frontend Environment Variables (`.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🏃 Running the Application

### **Start Backend Server**
```bash
cd backend
source venv/Scripts/activate  # On Windows
# or source venv/bin/activate  # On Mac/Linux
python manage.py runserver
```
Backend runs at: http://localhost:8000

### **Start Frontend Server**
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:3000

## 📖 Usage Guide

### **1. Upload Documents**
- Navigate to **FILES** page
- Drag & drop PDF/TXT/DOCX files
- Click "UPLOAD TO HAWKINS LAB"
- Wait for processing confirmation

### **2. Generate Presentation**
- Go to **GENERATE** page
- Select uploaded documents
- Enter your query (e.g., "Explain the Upside Down physics")
- Choose AI Provider (Gemini or Groq)
- Click "GENERATE PRESENTATION"

### **3. Watch Real-time Generation**
- Slides appear one by one as they're generated
- Each slide fades in with animations
- Charts are rendered automatically
- Sources are tracked for citations

### **4. Export Options**
| Button | Description |
|--------|-------------|
| 📄 DOWNLOAD HTML | Animated Reveal.js presentation |
| 📊 DOWNLOAD POWERPOINT | Professional .pptx with vector graphics |
| 📝 DOWNLOAD EDITABLE JSON | Raw slide data for later editing |

## 📡 API Documentation

### **Endpoints**

#### **Documents**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload/` | Upload a document |
| GET | `/api/documents/` | List all documents |
| DELETE | `/api/documents/{id}/` | Delete a document |

#### **Presentations**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/presentations/generate/` | Generate presentation |
| GET | `/api/presentations/stream/` | SSE streaming endpoint |
| POST | `/api/presentations/export/` | Export to PowerPoint |

### **Example API Call**
```python
import requests

# Upload document
url = "http://localhost:8000/api/documents/upload/"
files = {'file': open('physics_book.pdf', 'rb')}
response = requests.post(url, files=files)
print(response.json())
```

## 🔧 Troubleshooting

### **Common Issues**

| Issue | Solution |
|-------|----------|
| **Django not found** | Activate virtual environment: `source venv/Scripts/activate` |
| **Module not found** | Run `pip install -r requirements.txt` |
| **CORS error** | Ensure `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000` |
| **500 Internal Error** | Check Django logs with `--verbosity 3` |
| **No module 'pdfplumber'** | `pip install pdfplumber` |
| **Charts not showing** | Ensure slide data includes `chart` object |
| **Streaming not working** | Check `views_stream.py` exists and is imported |

### **Debug Mode**
```bash
# Run Django with verbose logging
python manage.py runserver --verbosity 3

# Check database
python manage.py dbshell

# Test in Django shell
python manage.py shell
>>> from api.utils.rag_retriever import RAGRetriever
>>> r = RAGRetriever()
>>> print(r.retrieve_context("test", top_k=2))
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Stranger Things HackFest** for the inspiring project directive
- **Mr. Clarke** for leaving behind his research notes
- **The AV Club** for their dedication to uncovering the truth
- **Hawkins Lab** for the retro terminal aesthetic inspiration
- **Google Gemini & Groq** for providing free AI APIs
- **All contributors** who helped make this project possible

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| ⏱️ Development Time | 24 hours |
| 📝 Lines of Code | ~10,000 |
| 🐍 Python Files | 25+ |
| ⚛️ React Components | 15+ |
| 🔌 API Endpoints | 8 |
| 📚 Document Formats | 3 (PDF, TXT, DOCX) |
| 🤖 AI Models | 2 (Gemini, Groq) |

## 🎯 Future Enhancements

- [ ] **Voice Input**: Ask questions using speech
- [ ] **Multi-user Collaboration**: Edit presentations together
- [ ] **More Chart Types**: Add scatter plots, heatmaps
- [ ] **Custom Templates**: User-defined slide themes
- [ ] **Export to Google Slides**: Direct integration
- [ ] **Image Generation**: DALL-E integration for visuals
- [ ] **Mobile App**: React Native version

---

## 📞 Support

For issues or questions:
- 📧 Email: vivekvibhutiofficial@gmail.com
- 🐛 GitHub Issues: [Create an issue](https://github.com/vivek-vibhuti/Automated-Brief-generator-by-4Bit-.git)


---

<div align="center">
  <h3>⭐ Star us on GitHub — it motivates us! ⭐</h3>
  <p>Made with ❤️ for Stranger Things fans and hackathon enthusiasts</p>
  <p><i>"The truth is in there. We just help find it faster."</i></p>
</div>
```

## 📦 **Bonus: Quick Start Script**

Create a `start.sh` (Mac/Linux) or `start.bat` (Windows) file:

### **start.sh** (Mac/Linux)
```bash
#!/bin/bash

echo "🚀 Starting Mr. Clarke's Briefing Generator..."

# Start backend
cd backend
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!
echo "✅ Backend started on http://localhost:8000"

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started on http://localhost:3000"

echo "🎉 Both servers running! Press Ctrl+C to stop"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
```

### **start.bat** (Windows)
```batch
@echo off
echo 🚀 Starting Mr. Clarke's Briefing Generator...

REM Start backend
start cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"
echo ✅ Backend started on http://localhost:8000

REM Start frontend
start cmd /k "cd frontend && npm run dev"
echo ✅ Frontend started on http://localhost:3000

echo 🎉 Both servers running! Close windows to stop.
```

---

This README provides a comprehensive guide for anyone to set up, run, and understand your project. It's perfect for hackathon submissions, GitHub repositories, and team documentation! 🚀
