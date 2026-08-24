package com.jobsuit.backend.service;

import com.jobsuit.backend.dto.ResumeExtractionDto;
import com.jobsuit.backend.model.Resume;
import com.jobsuit.backend.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final GeminiService geminiService;

    public Resume uploadAndProcessResume(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        log.info("Processing resume upload: {}", fileName);

        // 1. Extract raw text from PDF using PDFBox
        String extractedText;
        try {
            extractedText = extractTextFromPdf(file.getBytes());
        } catch (Exception e) {
            log.error("Failed to parse PDF content for {}", fileName, e);
            throw new IOException("Failed to parse PDF file. Ensure it is a valid, unencrypted PDF.", e);
        }

        // 2. Extract structured candidate information via Gemini (or local fallback)
        ResumeExtractionDto extractedInfo = geminiService.extractResumeInfo(extractedText, fileName);

        // 3. Save Resume document in MongoDB
        Resume resume = Resume.builder()
                .candidateName(extractedInfo.getCandidateName())
                .email(extractedInfo.getEmail())
                .phone(extractedInfo.getPhone())
                .location(extractedInfo.getLocation())
                .skills(extractedInfo.getSkills())
                .experience(extractedInfo.getExperience())
                .education(extractedInfo.getEducation())
                .resumeText(extractedText)
                .fileName(fileName)
                .createdAt(LocalDateTime.now())
                .build();

        return resumeRepository.save(resume);
    }

    public List<Resume> getAllResumes() {
        return resumeRepository.findAll();
    }

    public Resume getResumeById(String id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with ID: " + id));
    }

    public void deleteResume(String id) {
        if (!resumeRepository.existsById(id)) {
            throw new IllegalArgumentException("Resume not found with ID: " + id);
        }
        resumeRepository.deleteById(id);
    }

    private String extractTextFromPdf(byte[] pdfBytes) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            if (document.isEncrypted()) {
                throw new IOException("Cannot extract text from an encrypted PDF document.");
            }
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            if (text == null || text.trim().isEmpty()) {
                return "[No readable text found in PDF]";
            }
            return text;
        }
    }
}
