import './Settings.css'

function Settings({ settings, onSettingsChange, disabled }) {
  return (
    <div className={`settings ${disabled ? 'disabled' : ''}`}>
      <div className="settings-group">
        <div className="settings-options mode-toggle">
          <button
            className={`settings-btn ${settings.mode === 'time' ? 'active' : ''}`}
            onClick={() => onSettingsChange({ mode: 'time' })}
            disabled={disabled}
          >
            time
          </button>
          <button
            className={`settings-btn ${settings.mode === 'words' ? 'active' : ''}`}
            onClick={() => onSettingsChange({ mode: 'words' })}
            disabled={disabled}
          >
            words
          </button>
        </div>
      </div>

      <div className="settings-divider"></div>
      
      {settings.mode === 'time' ? (
        <div className="settings-group fade-in">
          <div className="settings-options">
            {[15, 30, 60, 120].map(duration => (
              <button
                key={duration}
                className={`settings-btn ${settings.duration === duration ? 'active' : ''}`}
                onClick={() => onSettingsChange({ duration })}
                disabled={disabled}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="settings-group fade-in">
          <div className="settings-options">
            {[10, 25, 50, 100].map(count => (
              <button
                key={count}
                className={`settings-btn ${settings.wordCount === count ? 'active' : ''}`}
                onClick={() => onSettingsChange({ wordCount: count })}
                disabled={disabled}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
