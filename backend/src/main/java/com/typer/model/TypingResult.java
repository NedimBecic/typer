package com.typer.model;

import java.time.LocalDateTime;
import java.util.Map;

public class TypingResult {
    
    private Long id;
    private int wpm;
    private int rawWpm;
    private double accuracy;
    private int correctChars;
    private int incorrectChars;
    private int testDuration;
    private LocalDateTime completedAt;
    private Map<Character, Integer> missedChars;
    
    public TypingResult() {}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public int getWpm() { return wpm; }
    public void setWpm(int wpm) { this.wpm = wpm; }
    
    public int getRawWpm() { return rawWpm; }
    public void setRawWpm(int rawWpm) { this.rawWpm = rawWpm; }
    
    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }
    
    public int getCorrectChars() { return correctChars; }
    public void setCorrectChars(int correctChars) { this.correctChars = correctChars; }
    
    public int getIncorrectChars() { return incorrectChars; }
    public void setIncorrectChars(int incorrectChars) { this.incorrectChars = incorrectChars; }
    
    public int getTestDuration() { return testDuration; }
    public void setTestDuration(int testDuration) { this.testDuration = testDuration; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Map<Character, Integer> getMissedChars() { return missedChars; }
    public void setMissedChars(Map<Character, Integer> missedChars) { this.missedChars = missedChars; }
}
