export function Button({ children, onClick, size = 'medium', variant = 'primary', disabled = false, style = {} }) {
  const sizeStyles = {
    small: {
      padding: '8px 16px',
      fontSize: '14px',
    },
    medium: {
      padding: '12px 24px',
      fontSize: '16px',
    },
    large: {
      padding: '16px 32px',
      fontSize: '18px',
    },
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
      color: '#1a0f0a',
      border: '2px solid #b8860b',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)',
    },
    secondary: {
      background: 'linear-gradient(135deg, #5d4037 0%, #3e2723 100%)',
      color: '#e8d4b0',
      border: '2px solid #8b7355',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
    },
    danger: {
      background: 'linear-gradient(135deg, #8b0000 0%, #600000 100%)',
      color: '#e8d4b0',
      border: '2px solid #600000',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
    },
  };

  const buttonStyle = {
    ...sizeStyles[size],
    ...variantStyles[variant],
    borderRadius: '8px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    minWidth: '44px',
    minHeight: '44px',
    ...style,
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={buttonStyle}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.filter = 'brightness(1.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.filter = 'brightness(1)';
        }
      }}
    >
      {children}
    </button>
  );
}
