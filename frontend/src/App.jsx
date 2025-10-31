import { useState, useEffect } from 'react';
import MovieSelection from './MovieSelection';
import RecommendationResults from './RecommendationResults';
import LoadingScreen from './LoadingScreen';

const API_URL = 'https://movie-recommender-fo26.onrender.com';
//const API_URL = 'http://127.0.0.1:8000';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('selection');
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/movies`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMovies(data.movies || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load movies. Make sure the backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSelection = async (selectedMovies) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movie_ids: selectedMovies.map(m => m.id),
          n_recommendations: 10
        })
      });
      
      if (!response.ok) throw new Error('Failed to get recommendations');
      const data = await response.json();
      setRecommendations(data.recommendations);
      setCurrentView('results');
      window.history.pushState({ view: 'results' }, '', '#results');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get recommendations. Please try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    setRecommendations([]);
    setCurrentView('selection');
    window.history.pushState({ view: 'selection' }, '', '#');
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.view === 'results') {
        setCurrentView('results');
      } else {
        setCurrentView('selection');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (isGenerating) {
    return <LoadingScreen />;
  }

  if (currentView === 'results') {
    return <RecommendationResults recommendations={recommendations} onRestart={handleRestart} />;
  }

  return <MovieSelection movies={movies} onComplete={handleMovieSelection} />;
}