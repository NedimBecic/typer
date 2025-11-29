import "./Results.css";

function Results({ results, onRestart }) {
  return (
    <div className="results slide-up">
      <div className="main-stats">
        <div className="wpm-display">
          <div className="wpm-value">
            <span className="wpm-number">{results.wpm}</span>
            <span className="wpm-label">wpm</span>
          </div>
        </div>

        <div className="accuracy-ring">
          <svg viewBox="0 0 120 120">
            <circle
              className="ring-bg"
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="8"
            />
            <circle
              className="ring-fill"
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="8"
              strokeDasharray={`${(results.accuracy / 100) * 339.3} 339.3`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="accuracy-text">
            <span className="accuracy-value">{results.accuracy}%</span>
            <span className="accuracy-label">accuracy</span>
          </div>
        </div>
      </div>

      <div className="detailed-stats">
        <div className="stat-card">
          <span className="stat-card-value">{results.rawWpm}</span>
          <span className="stat-card-label">raw wpm</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value">{results.timeElapsed}s</span>
          <span className="stat-card-label">time</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value correct">
            {results.correctChars}
          </span>
          <span className="stat-card-label">correct chars</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value incorrect">
            {results.incorrectChars}
          </span>
          <span className="stat-card-label">missed chars</span>
        </div>
      </div>

      <div className="results-actions">
        <button className="action-btn primary" onClick={onRestart}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Next Test
        </button>
      </div>
    </div>
  );
}

export default Results;
