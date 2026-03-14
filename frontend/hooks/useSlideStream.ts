import { useState, useCallback, useRef } from 'react';

export interface Slide {
 
  title: string
  bullets?: string[]
  sources?: string[]
  chart?: {
    type?: string
    labels?: string[]
    data?: number[]
  }
}


export function useSlideStream() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const generate = useCallback((sessionId: string, question: string, docIds: number[] = [], provider: string = 'gemini') => {
    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setLoading(true);
    setError(null);
    setSlides([]);
    setDone(false);

    // Build URL with query params
    const params = new URLSearchParams({
      session_id: sessionId,
      question: question,
      provider: provider
    });
    
    docIds.forEach(id => params.append('doc_ids[]', id.toString()));

    const url = `${process.env.NEXT_PUBLIC_API_URL}/presentations/stream/?${params.toString()}`;
    const es = new EventSource(url);
    
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        
        if (data.error) {
          setError(data.error);
          es.close();
          setLoading(false);
          return;
        }
        
        if (data.done) {
          setDone(true);
          es.close();
          setLoading(false);
          return;
        }
        
        if (data.slide) {
          // Parse the slide JSON
          const slideData = JSON.parse(data.slide);
          setSlides(prev => [...prev, slideData]);
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    es.onerror = (err) => {
      console.error('EventSource error:', err);
      setError('Connection lost. Please try again.');
      es.close();
      setLoading(false);
    };

    // Cleanup function
    return () => {
      es.close();
    };
  }, []);

  const stop = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      setLoading(false);
    }
  }, []);

  return {
    slides,
    done,
    loading,
    error,
    generate,
    stop
  };
}