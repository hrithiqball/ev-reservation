package edu.uitm.ev_reservation.controller;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        try {
            Map<String, Object> health = new HashMap<>();
            health.put("status", "OK");
            health.put("timestamp", Instant.now().toString());
            health.put("service", "ev-reservation");

            return ResponseEntity.ok(health);
        } catch (Exception e) {
            Map<String, Object> health = new HashMap<>();
            health.put("status", "ERROR");
            health.put("timestamp", Instant.now().toString());
            health.put("error", e.getMessage());

            return ResponseEntity.status(500).body(health);
        }
    }
}
