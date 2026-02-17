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
      backgroundColor: '#2196F3',
      color: 'white',
      border: '2px solid #2196F3',
    },
    secondary: {
      backgroundColor: 'white',
      color: '#2196F3',
      border: '2px solid #2196F3',
    },
    danger: {
      backgroundColor: '#F44336',
      color: 'white',
      border: '2px solid #F44336',
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
          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }
      }}
    >
      {children}
    </button>
  );
}
