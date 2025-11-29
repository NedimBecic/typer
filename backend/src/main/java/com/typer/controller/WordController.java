package com.typer.controller;

import com.typer.service.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/words")
public class WordController {
    
    @Autowired
    private WordService wordService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getWords(
            @RequestParam(defaultValue = "50") int count) {
        List<String> words = wordService.generateWords(count);
        String text = String.join(" ", words);
        
        Map<String, Object> response = new HashMap<>();
        response.put("words", words);
        response.put("text", text);
        response.put("count", words.size());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/text")
    public ResponseEntity<Map<String, String>> getText(
            @RequestParam(defaultValue = "50") int count) {
        String text = wordService.generateText(count);
        
        Map<String, String> response = new HashMap<>();
        response.put("text", text);
        
        return ResponseEntity.ok(response);
    }
}

