package com.jobsuit.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "screening_results")
public class ScreeningResult {
    @Id
    private String id;
    private String resumeId;
    private String jobId;
    private String candidateName;
    private String jobTitle;
    private Double matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String experienceRelevance;
    private String educationRelevance;
    private String justification;
    private Boolean shortlisted;
    private LocalDateTime createdAt;
}
