import { useState, useEffect, useRef, useCallback } from 'react'
import './TypingTest.css'

const API_BASE = '/api'

function TypingTest({ settings, onTestStart, onTestComplete, testState }) {
  const [words, setWords] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [history, setHistory] = useState({})
  const [timer, setTimer] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  const inputRef = useRef(null)
  const textDisplayRef = useRef(null)
  const timerRef = useRef(null)
  
  const indexRef = useRef({ word: 0 })
  
  const isTimeMode = settings.mode === 'time'

  useEffect(() => {
    const focusInput = () => inputRef.current?.focus()
    focusInput()
    window.addEventListener('click', focusInput)
    return () => window.removeEventListener('click', focusInput)
  }, [])

  useEffect(() => {
    resetTest()
  }, [settings])

  useEffect(() => {
    if (testState !== 'running') {
      clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (isTimeMode) {
          if (prev <= 1) {
            finishTest()
            return 0
          }
          return prev - 1
        } else {
          return prev + 1
        }
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [testState, isTimeMode])

  const fetchWords = useCallback(async (count, append = false) => {
    if (!append) setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/words?count=${count}`)
      const data = await response.json()
      setWords(prev => append ? [...prev, ...data.words] : data.words)
    } catch (error) {
      const fallbackWords = generateFallbackWords(count)
      setWords(prev => append ? [...prev, ...fallbackWords] : fallbackWords)
    }
    if (!append) setIsLoading(false)
  }, [])

  const generateFallbackWords = (count) => {
    const commonWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me']
    return Array.from({ length: count }, () => commonWords[Math.floor(Math.random() * commonWords.length)])
  }

  const resetTest = () => {
    setCurrentWordIndex(0)
    indexRef.current = { word: 0 }
    setHistory({})
    setTimer(isTimeMode ? settings.duration : 0)
    
    fetchWords(isTimeMode ? 50 : settings.wordCount)
    
    if (inputRef.current) inputRef.current.value = ''
    inputRef.current?.focus()
  }

  const calculateStats = (currentHistory) => {
    let correctChars = 0
    let incorrectChars = 0
    let totalChars = 0
    let missedCharsMap = {}

    Object.keys(currentHistory).forEach(wordIdxStr => {
      const wordIdx = parseInt(wordIdxStr)
      const typedWord = currentHistory[wordIdx]
      const targetWord = words[wordIdx]
      
      if (!targetWord) return

      for (let i = 0; i < typedWord.length; i++) {
        const char = typedWord[i]
        totalChars++
        
        if (i < targetWord.length) {
          if (char === targetWord[i]) {
            correctChars++
          } else {
            incorrectChars++
            const expected = targetWord[i]
            missedCharsMap[expected] = (missedCharsMap[expected] || 0) + 1
          }
        } else {
          // Extra char
          incorrectChars++
        }
      }
      
      // Count characters that were skipped (if we moved past this word)
      if (wordIdx < indexRef.current.word) {
        const missedLen = Math.max(0, targetWord.length - typedWord.length)
        incorrectChars += missedLen
      }
    })

    const timeElapsed = isTimeMode ? settings.duration : timer
    const minutes = timeElapsed / 60 || 1/60
    
    const wpm = Math.round((correctChars / 5) / minutes)
    const rawWpm = Math.round((totalChars / 5) / minutes)
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0

    return {
      wpm,
      rawWpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
      timeElapsed,
      missedChars: missedCharsMap
    }
  }

  const finishTest = () => {
    clearInterval(timerRef.current)
    const results = calculateStats(history)
    
    fetch(`${API_BASE}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results)
    }).catch(err => console.log('Could not save results:', err))

    onTestComplete(results)
  }

  const handleKeyDown = (e) => {
    if (words.length === 0) return
    if (e.key === 'Tab') { e.preventDefault(); inputRef.current?.focus(); return; }

    if (testState === 'idle' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      onTestStart()
    }

    const { word: wordIdx } = indexRef.current
    
    if (e.key === 'Backspace') {
      setHistory(prev => {
        const currentTyped = prev[wordIdx] || ''
        if (currentTyped.length > 0) {
          return {
            ...prev,
            [wordIdx]: currentTyped.slice(0, -1)
          }
        } else if (wordIdx > 0) {
          // Move back to previous word
          indexRef.current.word--
          setCurrentWordIndex(indexRef.current.word)
          // We don't delete the char from prev word, just move cursor back
          return prev 
        }
        return prev
      })
      return
    }

    if (e.key === ' ') {
      e.preventDefault()
      const currentTyped = history[wordIdx] || ''
      
      // Only advance if we typed something or if we explicitly want to skip
      // Typically allow skipping even if empty
      if (currentTyped.length > 0) {
        indexRef.current.word++
        setCurrentWordIndex(indexRef.current.word)
        
        if (isTimeMode && indexRef.current.word > words.length - 20) {
          fetchWords(25, true)
        }
        
        if (!isTimeMode && indexRef.current.word >= words.length) {
          finishTest()
        }
      }
      return
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      
      setHistory(prev => {
        const currentTyped = prev[wordIdx] || ''
        return {
          ...prev,
          [wordIdx]: currentTyped + e.key
        }
      })
    }
  }

  const getCharClass = (wordIndex, charIndex, char, word) => {
    const typedWord = history[wordIndex] || ''
    const isCurrentWord = wordIndex === currentWordIndex
    
    // Character position logic
    if (charIndex < typedWord.length) {
      const typedChar = typedWord[charIndex]
      // Check if it's an extra character (beyond original word length)
      if (charIndex >= word.length) {
        return 'extra'
      }
      return typedChar === char ? 'correct' : 'incorrect'
    }
    
    // Cursor logic
    if (isCurrentWord && charIndex === typedWord.length) {
      return 'current'
    }
    
    return ''
  }

  useEffect(() => {
    if (textDisplayRef.current) {
      const activeWord = textDisplayRef.current.querySelector('.word.active')
      if (activeWord) {
        const containerTop = textDisplayRef.current.offsetTop
        const wordTop = activeWord.offsetTop
        const offset = wordTop - containerTop
        
        if (offset > 60) {
           textDisplayRef.current.scrollTop = offset - 10
        } else {
           textDisplayRef.current.scrollTop = 0
        }
      }
    }
  }, [currentWordIndex])

  if (isLoading && words.length === 0) return <div className="typing-test loading">Loading...</div>

  const liveStats = calculateStats(history)

  return (
    <div className="typing-test" onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        type="text"
        className="hidden-input"
        onKeyDown={handleKeyDown}
        autoFocus
        autoComplete="off"
      />

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-value" style={{ color: isTimeMode ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
             {isTimeMode ? timer : `${timer}s`}
          </span>
          <span className="stat-label">{isTimeMode ? 'time left' : 'elapsed'}</span>
        </div>
        <div className="stat">
            <span className="stat-value">
                {isTimeMode ? '∞' : `${currentWordIndex}/${settings.wordCount}`}
            </span>
            <span className="stat-label">words</span>
        </div>
      </div>

      <div className="text-display" ref={textDisplayRef}>
        <div className="words-container">
          {words.map((word, wordIndex) => {
             if (Math.abs(wordIndex - currentWordIndex) > 30) return null;
             
             const typedWord = history[wordIndex] || ''
             // We need to render up to max(word.length, typedWord.length)
             // If typedWord is longer, we show extras
             const displayLength = Math.max(word.length, typedWord.length)
             
             // Helper to generate array 0..n-1
             const charIndices = Array.from({ length: displayLength }, (_, i) => i)

             return (
                <span key={wordIndex} className={`word ${wordIndex === currentWordIndex ? 'active' : ''}`}>
                  {charIndices.map(charIndex => {
                    const char = word[charIndex] // might be undefined if extra
                    const typedChar = typedWord[charIndex] // might be undefined if not typed yet
                    
                    // If it's an extra char, we display what was typed
                    const displayChar = charIndex < word.length ? char : typedChar
                    
                    return (
                      <span 
                        key={charIndex} 
                        className={`char ${getCharClass(wordIndex, charIndex, displayChar, word)}`}
                      >
                        {displayChar}
                      </span>
                    )
                  })}
                  {wordIndex < words.length - 1 && <span className="space"> </span>}
                </span>
             )
          })}
        </div>
      </div>

      <button className="restart-btn" onClick={(e) => { e.stopPropagation(); resetTest(); }}>
        restart
      </button>
    </div>
  )
}

export default TypingTest
