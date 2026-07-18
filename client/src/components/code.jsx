import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useParams, Link } from "react-router-dom"

const Code = () => {
  const { shortCode } = useParams()
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const getUrl = async () => {
      try {
        const resp = await api.get(`/${shortCode}`)
        if (resp.data && resp.data.success && resp.data.data && resp.data.data.originalUrl) {
          const targetUrl = resp.data.data.originalUrl
          // Perform clean client redirect
          window.location.replace(targetUrl)
        } else {
          setError(true)
          setErrorMessage("This shortcode does not exist or has expired.")
        }
      } catch (e) {
        console.error(e)
        setError(true)
        setErrorMessage("Unable to resolve the redirect. Please try again later.")
      }
    }

    getUrl()
  }, [shortCode])

  if (error) {
    return (
      <div className="redirect-wrapper">
        <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2 style={{ marginBottom: '8px' }}>Link Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '15px' }}>
            {errorMessage}
          </p>
          <Link 
            to="/" 
            className="submit-btn" 
            style={{ 
              textDecoration: 'none', 
              display: 'inline-flex', 
              padding: '12px 24px', 
              borderRadius: '10px', 
              margin: '0 auto' 
            }}
          >
            Go to SnapLink
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="redirect-wrapper">
      <div className="spinner"></div>
      <h1 className="redirect-title">Redirecting You</h1>
      <p className="redirect-subtitle">Please wait while we route you to your destination...</p>
    </div>
  )
}

export default Code;
