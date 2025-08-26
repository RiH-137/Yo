import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { initCursorInteractions } from '../utils/cursorUtils';

// Cursor animations
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const morphAnimation = keyframes`
  0% {
    border-radius: 50%;
    transform: scale(1);
  }
  25% {
    border-radius: 0%;
    transform: scale(1.1);
  }
  50% {
    border-radius: 50%;
    transform: scale(0.9);
  }
  75% {
    border-radius: 25%;
    transform: scale(1.05);
  }
  100% {
    border-radius: 50%;
    transform: scale(1);
  }
`;

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px ${({ theme }) => theme.primary};
  }
  50% {
    box-shadow: 0 0 20px ${({ theme }) => theme.primary}, 0 0 30px ${({ theme }) => theme.primary};
  }
  100% {
    box-shadow: 0 0 5px ${({ theme }) => theme.primary};
  }
`;

const trailAnimation = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(0) rotate(180deg);
    opacity: 0;
  }
`;

// Main cursor component
const CursorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
`;

const MainCursor = styled.div`
  position: absolute;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background: ${({ theme, section }) => {
    switch(section) {
      case 'hero': return theme.primary;
      case 'skills': return '#00ff88';
      case 'experience': return '#ff6b6b';
      case 'projects': return '#4ecdc4';
      case 'education': return '#45b7d1';
      case 'contact': return '#96ceb4';
      default: return theme.primary;
    }
  }};
  transition: all 0.3s ease;
  transform: translate(-50%, -50%);
  
  ${({ section }) => {
    switch(section) {
      case 'hero':
        return css`
          animation: ${pulseAnimation} 2s ease-in-out infinite;
        `;
      case 'skills':
        return css`
          animation: ${rotateAnimation} 3s linear infinite, ${glowAnimation} 2s ease-in-out infinite;
          border: 2px solid #00ff88;
          background: transparent;
        `;
      case 'experience':
        return css`
          animation: ${morphAnimation} 4s ease-in-out infinite;
        `;
      case 'projects':
        return css`
          animation: ${pulseAnimation} 1.5s ease-in-out infinite, ${rotateAnimation} 6s linear infinite;
          background: linear-gradient(45deg, #4ecdc4, #44a08d);
        `;
      case 'education':
        return css`
          animation: ${glowAnimation} 3s ease-in-out infinite;
          background: radial-gradient(circle, #45b7d1, #2196f3);
        `;
      case 'contact':
        return css`
          animation: ${morphAnimation} 2s ease-in-out infinite, ${glowAnimation} 3s ease-in-out infinite;
          background: linear-gradient(135deg, #96ceb4, #ffeaa7);
        `;
      default:
        return css`
          animation: ${pulseAnimation} 2s ease-in-out infinite;
        `;
    }
  }}
`;

const TrailDot = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${({ theme, section }) => {
    switch(section) {
      case 'hero': return theme.primary;
      case 'skills': return '#00ff88';
      case 'experience': return '#ff6b6b';
      case 'projects': return '#4ecdc4';
      case 'education': return '#45b7d1';
      case 'contact': return '#96ceb4';
      default: return theme.primary;
    }
  }};
  border-radius: 50%;
  pointer-events: none;
  animation: ${trailAnimation} 1s ease-out forwards;
`;

const CustomCursor = ({ onSectionChange }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState('hero');
  const [cursorSize, setCursorSize] = useState(20);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState([]);

  // Notify parent component of section changes
  useEffect(() => {
    if (onSectionChange) {
      onSectionChange(currentSection);
    }
  }, [currentSection, onSectionChange]);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add trail effect
      setTrail(prev => [
        ...prev.slice(-15), // Keep only last 15 trail dots
        { 
          x: e.clientX, 
          y: e.clientY, 
          id: Date.now() + Math.random() 
        }
      ]);
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'A' || 
          e.target.role === 'button' ||
          e.target.classList.contains('clickable')) {
        setIsHovering(true);
        setCursorSize(35);
      } else {
        setIsHovering(false);
        setCursorSize(20);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Detect current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { name: 'hero', element: document.getElementById('hero') || document.getElementById('Hero') },
        { name: 'skills', element: document.getElementById('Skills') || document.getElementById('skills') },
        { name: 'experience', element: document.getElementById('Experience') || document.getElementById('experience') },
        { name: 'projects', element: document.getElementById('Projects') || document.getElementById('projects') },
        { name: 'education', element: document.getElementById('Education') || document.getElementById('education') },
        { name: 'contact', element: document.getElementById('Contact') || document.getElementById('contact') }
      ].filter(section => section.element);

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setCurrentSection(section.name);
          break;
        }
      }
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener with throttling
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  // Clean up trail dots
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.slice(1));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Hide default cursor and initialize interactions
  useEffect(() => {
    document.body.style.cursor = 'none';
    const cleanup = initCursorInteractions();

    return () => {
      document.body.style.cursor = 'auto';
      cleanup && cleanup();
    };
  }, []);

  return (
    <CursorContainer>
      {/* Trail effect */}
      {trail.map((dot, index) => (
        <TrailDot
          key={dot.id}
          section={currentSection}
          style={{
            left: dot.x,
            top: dot.y,
            transform: `translate(-50%, -50%) scale(${(index + 1) / trail.length})`,
            opacity: (index + 1) / trail.length * 0.5
          }}
        />
      ))}
      
      {/* Main cursor */}
      <MainCursor
        section={currentSection}
        size={isHovering ? cursorSize + 10 : cursorSize}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />
    </CursorContainer>
  );
};

export default CustomCursor;
