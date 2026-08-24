package com.jobsuit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScreeningAnalysisDto {
    private Double score;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String experienceRelevance;
    private String educationRelevance;
    private String justification;
}
