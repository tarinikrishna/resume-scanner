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
public class ResumeExtractionDto {
    private String candidateName;
    private String email;
    private String phone;
    private String location;
    private List<String> skills;
    private String experience;
    private String education;
}
