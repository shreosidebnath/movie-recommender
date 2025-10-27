import { useState, useEffect } from 'react';
import { Sparkles, Film, Loader } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieSelection({ movies, onComplete }) {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [showNavbar, setShowNavbar] = useState(false);
  const [displayCount, setDisplayCount] = useState(50);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const displayedMovies = movies.slice(0, Math.min(displayCount, 300));

  const handleMovieSelect = (movie) => {
    if (selectedMovies.find(m => m.id === movie.id)) {
      setSelectedMovies(selectedMovies.filter(m => m.id !== movie.id));
    } else if (selectedMovies.length < 10) {
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  const progressPercent = (selectedMovies.length / 10) * 100;

  // Show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }

      // Infinite scroll - load more when near bottom
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight - 500;

      if (scrollPosition >= bottomPosition && !isLoadingMore && displayCount < 300) {
        setIsLoadingMore(true);
        
        // Simulate loading delay for better UX
        setTimeout(() => {
          setDisplayCount(prev => Math.min(prev + 50, 300));
          setIsLoadingMore(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, displayCount]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
      padding: '2rem 1rem',
      overflowX: 'hidden'
    }}>
      
      {/* Sticky Navbar - Shows on scroll */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.98)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #334155',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease',
        padding: '1rem 2rem'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Logo/Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Film size={28} color="#a855f7" />
            <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
              Movie Picker
            </span>
          </div>

          {/* Progress Bar in Navbar */}
          <div style={{ flex: '1', maxWidth: '400px', minWidth: '200px' }}>
            <div style={{ 
              background: '#1e293b', 
              borderRadius: '9999px', 
              height: '10px', 
              overflow: 'hidden',
              border: '1px solid #334155'
            }}>
              <div style={{ 
                width: `${progressPercent}%`, 
                background: 'linear-gradient(to right, #a855f7, #ec4899)',
                height: '100%',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ 
              color: 'white', 
              marginTop: '0.25rem', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {selectedMovies.length} / 10 selected
            </p>
          </div>

          {/* Get Recommendations Button in Navbar */}
          {selectedMovies.length === 10 && (
            <button
              onClick={() => onComplete(selectedMovies)}
              style={{
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                animation: 'pulse 2s infinite'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Sparkles size={20} />
              Get Recommendations
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            Pick Your Favorite Movies
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#d1d5db' }}>
            Select <span style={{ color: '#a855f7', fontWeight: 'bold' }}>10 movies</span> you love
          </p>
        </div>

        {/* Progress Bar - Initial */}
<div style={{ marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '1.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }}>
    {/* Progress Bar */}
    <div style={{ flex: '1', minWidth: '300px' }}>
      <div style={{ 
        background: '#1e293b', 
        borderRadius: '9999px', 
        height: '12px', 
        overflow: 'hidden',
        border: '1px solid #334155'
      }}>
        <div style={{ 
          width: `${progressPercent}%`, 
          background: 'linear-gradient(to right, #a855f7, #ec4899)',
          height: '100%',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <p style={{ textAlign: 'center', color: 'white', marginTop: '0.75rem', fontSize: '1.1rem', fontWeight: '600' }}>
        {selectedMovies.length} / 10 movies selected
      </p>
    </div>

      {/* Button next to progress bar */}
      {selectedMovies.length === 10 && (
        <button
          onClick={() => onComplete(selectedMovies)}
          style={{
            background: 'linear-gradient(to right, #9333ea, #ec4899)',
            color: 'white',
            fontWeight: 'bold',
            padding: '0.875rem 1.75rem',
            borderRadius: '0.75rem',
            fontSize: '1.1rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Sparkles size={20} />
          Get Recommendations
        </button>
      )}
    </div>
  </div>

        {/* Movie Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '2rem',
          padding: '0 1rem'
        }}>
          {displayedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isSelected={selectedMovies.some(m => m.id === movie.id)}
              onSelect={() => handleMovieSelect(movie)}
            />
          ))}
        </div>

        {/* Loading Indicator */}
        {isLoadingMore && displayCount < 300 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Loader size={40} color="#a855f7" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#d1d5db', fontSize: '1.1rem' }}>Loading more movies...</p>
          </div>
        )}

        {/* End Message */}
        {displayCount >= 300 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 0',
            color: '#d1d5db',
            fontSize: '1.1rem'
          }}>
            <p>🎬 You've reached the end! 300 movies loaded.</p>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 4px 25px rgba(168, 85, 247, 0.7);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}