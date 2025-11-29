package com.typer.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class WordService {
    
    private static final List<String> COMMON_WORDS = Arrays.asList(
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
        "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
        "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
        "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
        "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
        "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
        "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
        "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
        "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
        "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
        "is", "was", "are", "been", "has", "had", "were", "said", "each", "did",
        "should", "very", "being", "through", "where", "much", "before", "right", "still", "find",
        "long", "down", "life", "such", "here", "last", "world", "might", "while", "called",
        "name", "next", "under", "never", "little", "those", "why", "did", "made", "must",
        "call", "place", "part", "every", "found", "need", "many", "same", "again", "kind",
        "another", "seem", "help", "always", "line", "around", "went", "home", "keep", "set",
        "off", "away", "old", "point", "number", "live", "mean", "too", "hand", "high",
        "turn", "start", "show", "change", "play", "read", "city", "run", "close", "write",
        "begin", "three", "once", "own", "without", "move", "real", "left", "learn", "end",
        "different", "small", "large", "great", "put", "big", "important", "open", "between", "both",
        "word", "program", "computer", "system", "think", "create", "develop", "build", "design", "code",
        "type", "fast", "quick", "speed", "test", "practice", "improve", "better", "best", "score"
    );
    
    private final Random random = new Random();
    
    public List<String> generateWords(int count) {
        List<String> words = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            words.add(COMMON_WORDS.get(random.nextInt(COMMON_WORDS.size())));
        }
        return words;
    }
    
    public String generateText(int wordCount) {
        return String.join(" ", generateWords(wordCount));
    }
}

