export const buttonStyles = {
  // Primary button with enhanced interactions
  primary: {
    base: {
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      border: 'none',
      outline: 'none',
      position: 'relative' as const,
      overflow: 'hidden',
      transform: 'translateY(0) scale(1)',
    },
    hover: {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    },
    active: {
      transform: 'translateY(0) scale(0.98)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
    }
  },
  
  // Secondary button
  secondary: {
    base: {
      padding: '10px 20px',
      borderRadius: '10px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: 'rgba(55, 65, 81, 0.6)',
      border: '1px solid rgba(75, 85, 99, 0.3)',
      color: '#d1d5db',
      transform: 'scale(1)',
    },
    hover: {
      backgroundColor: 'rgba(75, 85, 99, 0.6)',
      borderColor: 'rgba(163, 230, 53, 0.3)',
      transform: 'scale(1.02)',
    },
    active: {
      transform: 'scale(0.98)',
    }
  },
  
  // Icon button
  icon: {
    base: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      transform: 'scale(1)',
    },
    hover: {
      transform: 'scale(1.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    active: {
      transform: 'scale(0.95)',
    }
  },
  
  // Add ripple effect
  addRippleEffect: (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// CSS for ripple effect (add to global styles)
export const rippleStyles = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`