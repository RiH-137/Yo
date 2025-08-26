// Enhanced cursor interactions for better user experience
// Add this to your components that need special cursor behavior

export const addCursorInteractions = () => {
  // Add clickable class to interactive elements
  const interactiveElements = document.querySelectorAll(
    'button, a, [role="button"], input, textarea, select, .btn, .link'
  );
  
  interactiveElements.forEach(element => {
    element.classList.add('clickable');
    
    // Add hover effects
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'scale(1.05)';
      element.style.transition = 'transform 0.3s ease';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'scale(1)';
    });
  });
};

// Call this function when components mount
export const initCursorInteractions = () => {
  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCursorInteractions);
  } else {
    addCursorInteractions();
  }
  
  // Re-run when new content is added (for dynamic content)
  const observer = new MutationObserver(() => {
    addCursorInteractions();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return () => observer.disconnect();
};
