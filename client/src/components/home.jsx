import { useState, useEffect } from 'react'
import { api } from '../api/api'

const Home = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [history, setHistory] = useState([])

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('snaplink_history')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Error parsing history', e)
      }
    }
  }, [])

  const saveToHistory = (original, shortCode) => {
    const shortUrl = `${window.location.origin}/${shortCode}`
    const newItem = {
      id: Date.now().toString(),
      original,
      short: shortUrl,
      shortCode,
    }
    const updatedHistory = [newItem, ...history].slice(0, 10) // Limit to 10 items
    setHistory(updatedHistory)
    localStorage.setItem('snaplink_history', JSON.stringify(updatedHistory))
  }

  const validateUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const submitUrl = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    let urlToSubmit = url.trim()
    
    // Auto-prepend http:// if no protocol exists
    if (!/^https?:\/\//i.test(urlToSubmit)) {
      urlToSubmit = 'http://' + urlToSubmit
    }

    if (!validateUrl(urlToSubmit)) {
      setError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    setLoading(true)
    try {
      const resp = await api.post('/shortenUrl', { url: urlToSubmit })
      if (resp.data && resp.data.success) {
        const data = resp.data.data
        const finalShortUrl = `${window.location.origin}/${data.shortCode}`
        setResult(finalShortUrl)
        saveToHistory(urlToSubmit, data.shortCode)
        setUrl('')
      } else {
        setError('Failed to shorten URL. Please try again.')
      }
    } catch (e) {
      console.error(e)
      setError('Server error occurred. Please check if backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('snaplink_history')
  }

  return (
    <div className="app-wrapper">
      <header>
        <a href="/" className="logo-container">
          <div className="logo-icon">S</div>
          <span className="logo-text">SnapLink</span>
        </a>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          v1.0
        </div>
      </header>

      <main>
        <section className="hero-section">
          <h1 className="hero-title">
            Shorten Your Links, <br />
            <span>Expand Your Reach</span>
          </h1>
          <p className="hero-subtitle">
            SnapLink makes your long, cluttered links clean, trackable, and shareable instantly.
          </p>
        </section>

        <div className="glass-card">
          <form onSubmit={submitUrl} className="input-group">
            <div className="input-container">
              <div className="input-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="Paste your long link here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>Shortening...</>
                ) : (
                  <>
                    Shorten
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="error-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}
          </form>

          {result && (
            <div className="result-container">
              <div className="result-label">Your shortened link is ready</div>
              <div className="result-box">
                <a href={result} target="_blank" rel="noopener noreferrer" className="short-url-link">
                  {result}
                </a>
                <div className="action-buttons">
                  <button
                    className={`icon-btn ${copiedId === 'result' ? 'success-copy' : ''}`}
                    onClick={() => handleCopy(result, 'result')}
                    title="Copy to clipboard"
                  >
                    {copiedId === 'result' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <section className="history-section">
          <div className="history-header">
            <h2 className="history-title">Recent Links ({history.length})</h2>
            {history.length > 0 && (
              <button onClick={clearHistory} className="clear-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Clear All
              </button>
            )}
          </div>

          <div className="history-list">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-urls">
                    <a href={item.short} target="_blank" rel="noopener noreferrer" className="history-short">
                      {item.short}
                    </a>
                    <span className="history-original" title={item.original}>
                      {item.original}
                    </span>
                  </div>
                  <button
                    className={`icon-btn ${copiedId === item.id ? 'success-copy' : ''}`}
                    onClick={() => handleCopy(item.short, item.id)}
                    title="Copy link"
                  >
                    {copiedId === item.id ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-history">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
                <p>No shortened links yet. Shorten your first link above!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} SnapLink. All rights reserved. Crafted for visual excellence.</p>
      </footer>
    </div>
  )
}

export default Home;