import { motion } from 'framer-motion';
import { Film } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ display: 'inline-block', marginBottom: '2rem' }}
        >
          <Film size={80} style={{ color: '#a855f7' }} />
        </motion.div>
        
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}
        >
          Analyzing Your Taste...
        </motion.h2>
        
        <motion.p
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            color: '#9ca3af',
            fontSize: '1.1rem'
          }}
        >
          Finding your perfect movie matches
        </motion.p>
      </div>
    </div>
  );
}