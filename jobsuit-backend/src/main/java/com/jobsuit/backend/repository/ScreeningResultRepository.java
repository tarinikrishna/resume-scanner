package com.jobsuit.backend.repository;

import com.jobsuit.backend.model.ScreeningResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScreeningResultRepository extends MongoRepository<ScreeningResult, String> {
    List<ScreeningResult> findByShortlisted(Boolean shortlisted);
    List<ScreeningResult> findByJobId(String jobId);
    List<ScreeningResult> findByResumeIdAndJobId(String resumeId, String jobId);
}
