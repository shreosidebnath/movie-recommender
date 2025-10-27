import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieSelection from './MovieSelection';
import RecommendationResults from './RecommendationResults';
import LoadingScreen from './LoadingScreen';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState('selection'); // 'selection', 'loading', 'results'

  // Fetch movies on mount
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/movies`);
      setMovies(response.data.movies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
      alert('Failed to load movies. Make sure the backend is running!');
    }
  };

  const handleSelectionComplete = async (selectedMovies) => {
    setStage('loading');
    
    try {
      const movieIds = selectedMovies.map(m => m.id);
      const response = await axios.post(`${API_URL}/recommend`, {
        movie_ids: movieIds,
        n_recommendations: 10
      });
      
      setRecommendations(response.data.recommendations);
      setStage('results');
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to get recommendations. Please try again!');
      setStage('selection');
    }
  };

  const handleRestart = () => {
    setStage('selection');
    setRecommendations([]);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (stage === 'loading') {
    return <LoadingScreen />;
  }

  if (stage === 'results') {
    return (
      <RecommendationResults 
        recommendations={recommendations}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <MovieSelection 
      movies={movies}
      onComplete={handleSelectionComplete}
    />
  );
}

export default App;