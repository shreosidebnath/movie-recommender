import { Sparkles, RotateCcw } from 'lucide-react';
import MovieCard from './MovieCard';

export default function RecommendationResults({ recommendations, onRestart }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
      padding: '2rem 1rem',
      overflowX: 'hidden'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <Sparkles size={36} style={{ color: '#fbbf24' }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Your Perfect Matches
            </h1>
            <Sparkles size={36} style={{ color: '#fbbf24' }} />
          </div>
          <p style={{ fontSize: '1.2rem', color: '#d1d5db' }}>
            Based on your selections, we found these movies for you!
          </p>
        </div>

        {/* Restart Button */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button
            onClick={onRestart}
            style={{
              background: '#1e293b',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.875rem 1.5rem',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #334155',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#334155';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1e293b';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <RotateCcw size={20} />
            Start Over
          </button>
        </div>

        {/* Recommendations Grid - Same style as selection page */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '2rem',
          padding: '0 1rem'
        }}>
          {recommendations.map((movie) => (
            <div
              key={movie.id}
              style={{
                animation: 'fadeIn 0.5s ease-in'
              }}
            >
              <MovieCard
                movie={movie}
                isSelected={false}
                showScore={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Add fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}