package com.typer.service;

import com.typer.model.TypingResult;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class TypingResultService {
    
    private final List<TypingResult> results = Collections.synchronizedList(new ArrayList<>());
    private final AtomicLong idCounter = new AtomicLong(1);
    private final Map<Character, Integer> globalMissedChars = new ConcurrentHashMap<>();

    public TypingResult saveResult(TypingResult result) {
        result.setId(idCounter.getAndIncrement());
        result.setCompletedAt(LocalDateTime.now());
        results.add(result);
        
        if (result.getMissedChars() != null) {
            result.getMissedChars().forEach((character, count) -> 
                globalMissedChars.merge(character, count, Integer::sum)
            );
        }
        
        return result;
    }
    
    public Map<String, Object> getSessionStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        if (results.isEmpty()) {
            stats.put("averageWpm", 0);
            stats.put("averageAccuracy", 0);
            stats.put("bestWpm", 0);
            stats.put("totalTests", 0);
            stats.put("missedChars", Collections.emptyMap());
            return stats;
        }

        double avgWpm = results.stream().mapToInt(TypingResult::getWpm).average().orElse(0.0);
        double avgAccuracy = results.stream().mapToDouble(TypingResult::getAccuracy).average().orElse(0.0);
        int bestWpm = results.stream().mapToInt(TypingResult::getWpm).max().orElse(0);
        
        Map<Character, Integer> topMissed = globalMissedChars.entrySet().stream()
            .sorted(Map.Entry.<Character, Integer>comparingByValue().reversed())
            .limit(10)
            .collect(Collectors.toMap(
                Map.Entry::getKey, 
                Map.Entry::getValue, 
                (e1, e2) -> e1, 
                LinkedHashMap::new
            ));

        stats.put("averageWpm", Math.round(avgWpm));
        stats.put("averageAccuracy", Math.round(avgAccuracy * 100) / 100.0);
        stats.put("bestWpm", bestWpm);
        stats.put("totalTests", results.size());
        stats.put("missedChars", topMissed);
        
        return stats;
    }

    public void clearSession() {
        results.clear();
        globalMissedChars.clear();
        idCounter.set(1);
    }
}
