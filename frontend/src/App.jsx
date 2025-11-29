import { useState } from 'react'
import Header from './components/Header'
import TypingTest from './components/TypingTest'
import Results from './components/Results'
import Settings from './components/Settings'
import Statistics from './components/Statistics'
import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState('test') 
  const [testState, setTestState] = useState('idle') 
  const [results, setResults] = useState(null)
  
  const [settings, setSettings] = useState({
    mode: 'time', 
    duration: 30,
    wordCount: 50
  })

  const handleTestComplete = (testResults) => {
    setResults(testResults)
    setTestState('finished')
  }

  const handleRestart = () => {
    setResults(null)
    setTestState('idle')
  }

  const handleSettingsChange = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    handleRestart()
  }

  const handleTabChange = (tab) => {
    if (testState === 'running') return 
    setCurrentTab(tab)
  }

  return (
    <div className="app">
      <Header currentTab={currentTab} onTabChange={handleTabChange} />
      
      <main className="main-content">
        <div className="container">
          {currentTab === 'test' ? (
            <>
              {testState !== 'finished' && (
                <Settings 
                  settings={settings} 
                  onSettingsChange={handleSettingsChange}
                  disabled={testState === 'running'}
                />
              )}
              
              {testState !== 'finished' ? (
                <TypingTest 
                  settings={settings}
                  onTestStart={() => setTestState('running')}
                  onTestComplete={handleTestComplete}
                  testState={testState}
                />
              ) : (
                <Results 
                  results={results} 
                  onRestart={handleRestart}
                />
              )}
            </>
          ) : (
            <Statistics />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
