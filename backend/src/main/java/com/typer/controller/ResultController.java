package com.typer.controller;

import com.typer.model.TypingResult;
import com.typer.service.TypingResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/results")
public class ResultController {
    
    @Autowired
    private TypingResultService resultService;
    
    @PostMapping
    public ResponseEntity<TypingResult> saveResult(@RequestBody TypingResult result) {
        TypingResult saved = resultService.saveResult(result);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(resultService.getSessionStatistics());
    }
    
    @PostMapping("/clear")
    public ResponseEntity<Void> clearSession() {
        resultService.clearSession();
        return ResponseEntity.ok().build();
    }
}
