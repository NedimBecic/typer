import './Header.css'

function Header({ currentTab, onTabChange }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => onTabChange('test')}>
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 10H36" stroke="#00ffff" strokeWidth="3"/>
              <rect x="8" y="16" width="6" height="6" fill="#00ffff"/>
              <rect x="17" y="16" width="6" height="6" fill="#00ffff" opacity="0.7"/>
              <rect x="26" y="16" width="6" height="6" fill="#00ffff" opacity="0.4"/>
              <rect x="12" y="26" width="16" height="4" fill="#00ffff"/>
            </svg>
          </div>
          <span className="logo-text">typer</span>
        </div>
        
        <nav className="nav">
          <button 
            className={`nav-link ${currentTab === 'test' ? 'active' : ''}`}
            onClick={() => onTabChange('test')}
          >
            test
          </button>
          <button 
            className={`nav-link ${currentTab === 'stats' ? 'active' : ''}`}
            onClick={() => onTabChange('stats')}
          >
            statistics
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
