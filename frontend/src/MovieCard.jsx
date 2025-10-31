import { Star, Check } from 'lucide-react';
import { useState } from 'react';

export default function MovieCard({ movie, isSelected, onSelect, showScore = false }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '0.5rem',
        overflow: 'visible',
        boxShadow: isSelected ? '0 0 0 4px #a855f7' : '0 4px 6px rgba(0,0,0,0.3)',
        transition: 'all 0.2s',
        background: '#1e293b',
        transform: isSelected ? 'translateY(-4px)' : 'translateY(0)'
      }}
    >
      <img
        src={posterUrl}
        alt={movie.title}
        style={{
          width: '100%',
          height: '300px',
          objectFit: 'cover',
          display: 'block'
        }}
      />
      
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        color: 'white'
      }}>
        <h3 style={{
          fontWeight: 'bold',
          fontSize: '0.95rem',
          marginBottom: '0.5rem',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {movie.title}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
            <Star size={14} fill="currentColor" />
            <span style={{ fontWeight: '600' }}>{movie.vote_average?.toFixed(1)}</span>
          </div>
          
          {movie.release_date && (
            <span style={{ color: '#d1d5db' }}>
              {new Date(movie.release_date).getFullYear()}
            </span>
          )}
        </div>
        
        {showScore && movie.similarity_score && (
          <div style={{
            marginTop: '0.5rem',
            background: 'linear-gradient(to right, #9333ea, #4850ecff)',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            display: 'inline-block'
          }}>
            <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {movie.similarity_score.toFixed(0)}% Match
            </span>
          </div>
        )}
      </div>
      
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: '#a855f7',
          borderRadius: '50%',
          padding: '0.5rem',
          boxShadow: '0 4px 12px rgba(168, 85, 247, 0.5)'
        }}>
          <Check size={20} color="white" strokeWidth={3} />
        </div>
      )}
      
      {isSelected && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(168, 85, 247, 0.15)',
          border: '3px solid #a855f7',
          pointerEvents: 'none'
        }} />
      )}

      {showTooltip && showScore && movie.similarity_score && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '0.5rem',
          background: 'rgba(15, 23, 42, 0.98)',
          backdropFilter: 'blur(10px)',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          border: '1px solid #334155',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          minWidth: '200px',
          maxWidth: '300px',
          zIndex: 1000,
          pointerEvents: 'none',
          animation: 'tooltipFade 0.2s ease'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#e5e7eb', lineHeight: '1.4' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#a855f7', fontSize: '0.85rem' }}>
              Why we recommended this:
            </p>
            <p style={{ margin: '0 0 0.25rem 0' }}>
              <strong style={{ color: '#fbbf24' }}>{movie.similarity_score?.toFixed(0)}%</strong> match based on your selections
            </p>
            {movie.genres && (
              <p style={{ margin: '0.25rem 0 0 0' }}>
                <strong>Genres:</strong> {movie.genres}
              </p>
            )}
            {movie.vote_average && (
              <p style={{ margin: '0.25rem 0 0 0' }}>
                <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
              </p>
            )}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(15, 23, 42, 0.98)'
          }} />
        </div>
      )}

      <style>{`
        @keyframes tooltipFade {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}