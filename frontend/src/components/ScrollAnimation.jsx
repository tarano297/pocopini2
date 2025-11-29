import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ScrollAnimation = ({ 
  children, 
  animation = 'fade-up',
  delay = 0,
  duration = 0.6,
  once = true,
  className = ''
}) => {
  const [ref, isVisible] = useScrollAnimation({ once, threshold: 0.1 });

  const animations = {
    'fade-up': 'translate-y-10 opacity-0',
    'fade-down': '-translate-y-10 opacity-0',
    'fade-left': 'translate-x-10 opacity-0',
    'fade-right': '-translate-x-10 opacity-0',
    'fade-in': 'opacity-0',
    'scale-up': 'scale-95 opacity-0',
    'scale-down': 'scale-105 opacity-0',
    'rotate-in': 'rotate-12 opacity-0',
  };

  const initialState = animations[animation] || animations['fade-up'];

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transform: isVisible ? 'none' : undefined,
        opacity: isVisible ? 1 : undefined,
      }}
    >
      <div className={isVisible ? '' : initialState}>
        {children}
      </div>
    </div>
  );
};

export default ScrollAnimation;
