import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Catch render errors so we don't get a blank page
class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('App error:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 24,
          fontFamily: "'DM Sans', sans-serif",
          backgroundColor: '#070D09',
          color: '#DFF0E8',
          minHeight: '100vh',
        }}>
          <h1 style={{ color: '#FF6E7A', fontSize: 18 }}>Something went wrong</h1>
          <pre style={{ marginTop: 12, padding: 12, background: '#111B14', borderRadius: 8, overflow: 'auto', fontSize: 12 }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <p style={{ marginTop: 12, color: '#6B9478', fontSize: 13 }}>Check the browser console (F12) for details.</p>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
