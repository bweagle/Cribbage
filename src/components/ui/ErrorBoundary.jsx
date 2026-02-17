import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      const errorStyle = {
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#fff3cd',
        borderRadius: '12px',
        margin: '20px',
        border: '2px solid #ffc107',
      };

      const headingStyle = {
        color: '#856404',
        fontSize: '24px',
        marginBottom: '16px',
      };

      const textStyle = {
        color: '#856404',
        fontSize: '16px',
        marginBottom: '24px',
      };

      const buttonStyle = {
        backgroundColor: '#ffc107',
        color: '#212529',
        border: 'none',
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
      };

      return (
        <div style={errorStyle}>
          <h1 style={headingStyle}>😕 Something went wrong</h1>
          <p style={textStyle}>
            The game encountered an unexpected error.
            Please try reloading the page.
          </p>
          {this.props.showDetails && this.state.error && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                Error details
              </summary>
              <pre style={{
                overflow: 'auto',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '14px',
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          <button
            style={buttonStyle}
            onClick={() => window.location.reload()}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e0a800';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffc107';
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
