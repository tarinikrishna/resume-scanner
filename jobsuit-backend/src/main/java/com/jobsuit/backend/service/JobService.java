package com.jobsuit.backend.service;

import com.jobsuit.backend.model.Job;
import com.jobsuit.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public Job createJob(Job job) {
        job.setCreatedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(String id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + id));
    }

    public Job updateJob(String id, Job jobDetails) {
        Job existingJob = getJobById(id);
        existingJob.setJobTitle(jobDetails.getJobTitle());
        existingJob.setDescription(jobDetails.getDescription());
        existingJob.setRequiredSkills(jobDetails.getRequiredSkills());
        return jobRepository.save(existingJob);
    }

    public void deleteJob(String id) {
        if (!jobRepository.existsById(id)) {
            throw new IllegalArgumentException("Job not found with ID: " + id);
        }
        jobRepository.deleteById(id);
    }
}
