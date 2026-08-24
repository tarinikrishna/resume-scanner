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
@Document(collection = "resumes")
public class Resume {
    @Id
    private String id;
    private String candidateName;
    private String email;
    private String phone;
    private String location;
    private List<String> skills;
    private String experience;
    private String education;
    private String resumeText;
    private String fileName;
    private LocalDateTime createdAt;
}
