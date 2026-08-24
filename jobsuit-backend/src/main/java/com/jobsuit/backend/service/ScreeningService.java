package com.jobsuit.backend.service;

import com.jobsuit.backend.dto.ScreeningAnalysisDto;
import com.jobsuit.backend.model.Job;
import com.jobsuit.backend.model.Resume;
import com.jobsuit.backend.model.ScreeningResult;
import com.jobsuit.backend.repository.JobRepository;
import com.jobsuit.backend.repository.ResumeRepository;
import com.jobsuit.backend.repository.ScreeningResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScreeningService {

    private final ScreeningResultRepository screeningResultRepository;
    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;
    private final GeminiService geminiService;

    public ScreeningResult screenCandidate(String resumeId, String jobId) {
        log.info("Screening resume ID: {} against job ID: {}", resumeId, jobId);

        // 1. Fetch Resume and Job
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with ID: " + resumeId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));

        // 2. Check if a result already exists to avoid redundant LLM calls
        List<ScreeningResult> existingResults = screeningResultRepository.findByResumeIdAndJobId(resumeId, jobId);
        if (!existingResults.isEmpty()) {
            log.info("Found existing screening result for resume {} and job {}. Returning it.", resumeId, jobId);
            return existingResults.get(0);
        }

        // 3. Call AI Screening via Gemini
        ScreeningAnalysisDto analysis = geminiService.screenCandidate(
                resume.getResumeText(),
                job.getJobTitle(),
                job.getDescription(),
                job.getRequiredSkills()
        );

        // 4. Store ScreeningResult in MongoDB (Shortlisted automatically if score >= 7)
        boolean shortlisted = analysis.getScore() != null && analysis.getScore() >= 7.0;

        ScreeningResult result = ScreeningResult.builder()
                .resumeId(resumeId)
                .jobId(jobId)
                .candidateName(resume.getCandidateName())
                .jobTitle(job.getJobTitle())
                .matchScore(analysis.getScore())
                .matchedSkills(analysis.getMatchedSkills())
                .missingSkills(analysis.getMissingSkills())
                .experienceRelevance(analysis.getExperienceRelevance())
                .educationRelevance(analysis.getEducationRelevance())
                .justification(analysis.getJustification())
                .shortlisted(shortlisted)
                .createdAt(LocalDateTime.now())
                .build();

        return screeningResultRepository.save(result);
    }

    public List<ScreeningResult> getAllScreeningResults() {
        return screeningResultRepository.findAll();
    }

    public ScreeningResult getScreeningResultById(String id) {
        return screeningResultRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Screening result not found with ID: " + id));
    }

    public List<ScreeningResult> getShortlistedCandidates() {
        return screeningResultRepository.findByShortlisted(true);
    }

    public List<ScreeningResult> getResultsByJob(String jobId) {
        return screeningResultRepository.findByJobId(jobId);
    }

    public ScreeningResult updateShortlistStatus(String id, Boolean shortlisted) {
        ScreeningResult result = getScreeningResultById(id);
        result.setShortlisted(shortlisted);
        return screeningResultRepository.save(result);
    }
}
