package com.jobsuit.backend.controller;

import com.jobsuit.backend.model.ScreeningResult;
import com.jobsuit.backend.service.ScreeningService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/screen")
@RequiredArgsConstructor
public class ScreeningController {

    private final ScreeningService screeningService;

    @Data
    public static class ScreeningRequest {
        private String resumeId;
        private String jobId;
    }

    @PostMapping
    public ResponseEntity<?> screenCandidate(@RequestBody ScreeningRequest request) {
        if (request.getResumeId() == null || request.getJobId() == null) {
            return ResponseEntity.badRequest().body("Both resumeId and jobId are required.");
        }
        try {
            ScreeningResult result = screeningService.screenCandidate(request.getResumeId(), request.getJobId());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/results")
    public ResponseEntity<List<ScreeningResult>> getAllScreeningResults(@RequestParam(value = "jobId", required = false) String jobId) {
        if (jobId != null && !jobId.trim().isEmpty()) {
            return ResponseEntity.ok(screeningService.getResultsByJob(jobId));
        }
        return ResponseEntity.ok(screeningService.getAllScreeningResults());
    }

    @GetMapping("/results/{id}")
    public ResponseEntity<ScreeningResult> getScreeningResultById(@PathVariable String id) {
        try {
            ScreeningResult result = screeningService.getScreeningResultById(id);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/shortlisted")
    public ResponseEntity<List<ScreeningResult>> getShortlistedCandidates() {
        List<ScreeningResult> shortlisted = screeningService.getShortlistedCandidates();
        return ResponseEntity.ok(shortlisted);
    }

    @PutMapping("/results/{id}/shortlist")
    public ResponseEntity<ScreeningResult> updateShortlistStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> payload) {
        Boolean shortlisted = payload.get("shortlisted");
        if (shortlisted == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            ScreeningResult updated = screeningService.updateShortlistStatus(id, shortlisted);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
