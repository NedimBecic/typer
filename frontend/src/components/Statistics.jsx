import { useState, useEffect } from 'react'
import './Statistics.css'

function Statistics() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/results/statistics')
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error("Failed to fetch stats:", err)
      setError(err.message)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const clearSession = async () => {
    try {
      await fetch('/api/results/clear', { method: 'POST' })
      fetchStats()
    } catch (err) {
      setError("Failed to clear session")
    }
  }

  if (isLoading) return <div className="loading">Loading stats...</div>
  
  if (error) return (
    <div className="error-state">
      <h3>Unable to load statistics</h3>
      <p>{error}</p>
      <button onClick={fetchStats} className="retry-btn">Retry</button>
    </div>
  )

  if (!stats) return null

  return (
    <div className="statistics fade-in">
      <div className="stats-header">
        <h2>Session Statistics</h2>
        <button className="clear-btn" onClick={clearSession}>Clear Session</button>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <span className="label">Tests Taken</span>
          <span className="value">{stats.totalTests}</span>
        </div>
        <div className="stat-box">
          <span className="label">Avg WPM</span>
          <span className="value">{stats.averageWpm}</span>
        </div>
        <div className="stat-box">
          <span className="label">Best WPM</span>
          <span className="value">{stats.bestWpm}</span>
        </div>
        <div className="stat-box">
          <span className="label">Avg Accuracy</span>
          <span className="value">{stats.averageAccuracy}%</span>
        </div>
      </div>

      <div className="missed-chars-section">
        <h3>Missed Characters</h3>
        <p className="subtitle">Characters you struggle with most this session</p>
        
        {stats.missedChars && Object.keys(stats.missedChars).length > 0 ? (
          <div className="missed-chars-list">
            {Object.entries(stats.missedChars).map(([char, count]) => (
              <div key={char} className="missed-char-item">
                <span className="char-display">{char === ' ' ? 'Space' : char}</span>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ width: `${Math.min((count / Math.max(...Object.values(stats.missedChars))) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="count">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No missed characters yet! Keep it up.</div>
        )}
      </div>
    </div>
  )
}

export default Statistics
