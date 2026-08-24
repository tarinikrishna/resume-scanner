# 🚀 Jobsuit.ai

### AI-Powered Resume Screening & Intelligent Candidate Matching Platform

<p>
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk" alt="Java 21"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=springboot" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/MySQL-8.x-blue?style=for-the-badge&logo=mysql" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Maven-3.x-red?style=for-the-badge&logo=apachemaven" alt="Maven"/>
  <img src="https://img.shields.io/badge/REST%20API-Backend-6f42c1?style=for-the-badge" alt="REST API"/>
  <img src="https://img.shields.io/badge/AI%2FLLM-Powered-black?style=for-the-badge" alt="AI/LLM"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Postman-API%20Testing-FF6C37?style=flat-square&logo=postman&logoColor=white" alt="Postman"/>
  <img src="https://img.shields.io/badge/GitHub-Version%20Control-181717?style=flat-square&logo=github" alt="GitHub"/>
  <img src="https://img.shields.io/badge/PDF-Resume%20Parsing-red?style=flat-square&logo=adobeacrobatreader" alt="PDF"/>
</p>

<p>
  <strong>Automate resume screening. Understand candidate fit. Make faster hiring decisions.</strong>
</p>

</div>

---

## 📌 Overview

**Jobsuit.ai** is an AI-powered recruitment platform that helps recruiters automate resume screening and candidate evaluation.

Recruiters can create job descriptions, upload candidate resumes, extract structured candidate information, compare resumes against job requirements using an LLM, generate an explainable match score, identify matched and missing skills, and shortlist suitable candidates.

The project combines a responsive frontend with a **Spring Boot REST backend**, **MySQL persistence**, **PDF resume parsing**, and **LLM-based semantic candidate matching**.

> **Database implementation:** This repository uses **MySQL + Spring Data JPA/Hibernate** for persistence.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📄 Resume Upload | Upload candidate resumes in PDF format |
| 🔎 Resume Parsing | Extract resume text and candidate information |
| 💼 Job Management | Create, view, update, and delete job openings |
| 🧠 AI Screening | Compare candidate resumes with job descriptions using an LLM |
| 📊 Match Scoring | Generate a candidate suitability score from 1–10 |
| 🧩 Skill Gap Analysis | Identify matched and missing skills |
| 💡 Explainable AI | Provide justification for the generated score |
| ⭐ Shortlisting | Automatically identify high-match candidates |
| 🔍 Candidate Filtering | Filter candidates by job, score, and shortlist status |
| 🗄️ MySQL Persistence | Store jobs, resumes, and screening results |
| 🔗 REST APIs | Clean backend APIs for frontend integration |
| 🧪 Postman Testing | Test backend endpoints independently |

---

# 🖼️ Screenshots

> Add your actual screenshots to the `docs/screenshots/` directory and update the filenames below.

## 🏠 Landing Page

![Jobsuit.ai Landing Page](docs/screenshots/landing-page.png)

## 📊 Recruiter Dashboard

![Recruiter Dashboard](docs/screenshots/dashboard.png)

## 💼 Job Creation

![Job Creation](docs/screenshots/job-creation.png)

## 📄 Resume Upload

![Resume Upload](docs/screenshots/resume-upload.png)

## 🤖 AI Screening Results

![AI Screening Results](docs/screenshots/screening-results.png)

## ⭐ Shortlisted Candidates

![Shortlisted Candidates](docs/screenshots/shortlisted-candidates.png)

### Recommended screenshot structure

```text
docs/
└── screenshots/
    ├── landing-page.png
    ├── dashboard.png
    ├── job-creation.png
    ├── resume-upload.png
    ├── screening-results.png
    └── shortlisted-candidates.png
```

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────────┐
                         │     Jobsuit.ai Frontend  │
                         │  React / TypeScript / UI │
                         └────────────┬─────────────┘
                                      │
                                REST / JSON
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │     Spring Boot API      │
                         │        Port: 8080        │
                         └────────────┬─────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
                ▼                     ▼                     ▼
       ┌────────────────┐    ┌────────────────┐    ┌─────────────────┐
       │  Resume APIs   │    │    Job APIs    │    │ Screening APIs  │
       └───────┬────────┘    └───────┬────────┘    └────────┬────────┘
               │                     │                       │
               ▼                     ▼                       ▼
       ┌────────────────┐    ┌────────────────┐    ┌─────────────────┐
       │  PDF Parser    │    │  Job Service   │    │  LLM Service    │
       └───────┬────────┘    └───────┬────────┘    └────────┬────────┘
               │                     │                       │
               └─────────────────────┼───────────────────────┘
                                     ▼
                          ┌─────────────────────┐
                          │   Spring Data JPA   │
                          │      / Hibernate    │
                          └──────────┬──────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │        MySQL        │
                          │      Database       │
                          └─────────────────────┘
```

---

# 🧰 Technology Stack

## Backend

- **Java 21**
- **Spring Boot**
- **Spring Web**
- **Spring Data JPA**
- **Hibernate**
- **Maven**
- **Bean Validation**
- **Lombok**

## Database

- **MySQL**
- **MySQL Workbench**

## AI

- **LLM API**
- Semantic resume-to-job matching
- Structured AI response
- Candidate scoring
- Skill-gap analysis
- Explainable screening

## Resume Processing

- PDF parsing
- PDF text extraction

## Testing & Development

- **Postman**
- **Git**
- **GitHub**
- **Visual Studio Code**

## Frontend

- React
- TypeScript
- HTML
- CSS
- REST API integration

---

# 📂 Project Structure

```text
jobsuit-ai/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/jobsuit/backend/
│   │   │   │       ├── controller/
│   │   │   │       │   ├── JobController.java
│   │   │   │       │   ├── ResumeController.java
│   │   │   │       │   └── ScreeningController.java
│   │   │   │       │
│   │   │   │       ├── service/
│   │   │   │       │   ├── JobService.java
│   │   │   │       │   ├── JobServiceImpl.java
│   │   │   │       │   ├── ResumeService.java
│   │   │   │       │   ├── ResumeServiceImpl.java
│   │   │   │       │   ├── ScreeningService.java
│   │   │   │       │   ├── ScreeningServiceImpl.java
│   │   │   │       │   ├── ResumeParserService.java
│   │   │   │       │   └── LLMService.java
│   │   │   │       │
│   │   │   │       ├── repository/
│   │   │   │       │   ├── JobRepository.java
│   │   │   │       │   ├── ResumeRepository.java
│   │   │   │       │   └── ScreeningResultRepository.java
│   │   │   │       │
│   │   │   │       ├── entity/
│   │   │   │       │   ├── Job.java
│   │   │   │       │   ├── Resume.java
│   │   │   │       │   └── ScreeningResult.java
│   │   │   │       │
│   │   │   │       ├── dto/
│   │   │   │       │   ├── JobRequest.java
│   │   │   │       │   ├── JobResponse.java
│   │   │   │       │   ├── ResumeResponse.java
│   │   │   │       │   ├── ScreeningRequest.java
│   │   │   │       │   └── ScreeningResponse.java
│   │   │   │       │
│   │   │   │       ├── exception/
│   │   │   │       │   └── GlobalExceptionHandler.java
│   │   │   │       │
│   │   │   │       └── config/
│   │   │   │           └── CorsConfig.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   ├── test/
│   │   └── pom.xml
│   │
│   ├── frontend/
│   │
│   ├── docs/
│   │   └── screenshots/
│   │
│   ├── .gitignore
│   └── README.md
```

---

# 🔄 Application Workflow

```text
┌─────────────────────┐
│ Recruiter Creates   │
│ Job Description     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Upload Candidate    │
│ Resume PDF          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ PDF Text Extraction │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Extract Candidate   │
│ Information         │
│ Skills/Experience   │
│ Education           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Store Data in       │
│ MySQL               │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Select Resume + Job │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ LLM Semantic        │
│ Matching            │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────┐
│ Generate                    │
│ • Match Score               │
│ • Matched Skills            │
│ • Missing Skills            │
│ • Experience Relevance      │
│ • Education Relevance       │
│ • AI Justification          │
└──────────┬───────────────────┘
           │
           ▼
┌─────────────────────┐
│ Save Screening      │
│ Result in MySQL     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Shortlist Candidate │
│ if Score >= 7       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Recruiter Dashboard │
└─────────────────────┘
```

---

# 🗄️ Database Schema

The backend uses a relational MySQL database named:

```text
jobsuit
```

## Entity Relationship Diagram

```text
┌──────────────────────────────┐
│            jobs              │
├──────────────────────────────┤
│ PK id                        │
│    job_title                 │
│    description               │
│    required_skills           │
│    created_at                │
└──────────────┬───────────────┘
               │
               │ 1
               │
               │ *
┌──────────────▼────────────────────┐
│        screening_results          │
├───────────────────────────────────┤
│ PK id                             │
│ FK resume_id                      │
│ FK job_id                         │
│    match_score                    │
│    matched_skills                 │
│    missing_skills                 │
│    experience_relevance           │
│    education_relevance            │
│    justification                  │
│    shortlisted                    │
│    created_at                     │
└──────────────▲────────────────────┘
               │
               │ *
               │
               │ 1
┌──────────────┴───────────────┐
│           resumes            │
├──────────────────────────────┤
│ PK id                        │
│    candidate_name            │
│    email                     │
│    phone                     │
│    location                  │
│    skills                    │
│    experience                │
│    education                 │
│    resume_text               │
│    file_name                 │
│    created_at                │
└──────────────────────────────┘
```

### Relationships

```text
Job 1 ──────── * ScreeningResult
Resume 1 ───── * ScreeningResult
```

A job can have multiple candidate screening results, and a resume can be evaluated against multiple jobs.

---

# 🔌 REST API Reference

## Job APIs

| Method | Endpoint | Description | Request |
|---|---|---|---|
| `POST` | `/api/jobs` | Create a job | JSON |
| `GET` | `/api/jobs` | Get all jobs | — |
| `GET` | `/api/jobs/{id}` | Get job by ID | — |
| `PUT` | `/api/jobs/{id}` | Update job | JSON |
| `DELETE` | `/api/jobs/{id}` | Delete job | — |

### Create Job

```http
POST /api/jobs
Content-Type: application/json
```

```json
{
  "jobTitle": "Java Backend Developer",
  "description": "Looking for a Java backend developer with Spring Boot experience.",
  "requiredSkills": "Java, Spring Boot, REST API, MySQL, Git"
}
```

---

## Resume APIs

| Method | Endpoint | Description | Request |
|---|---|---|---|
| `POST` | `/api/resumes/upload` | Upload PDF resume | Multipart |
| `GET` | `/api/resumes` | Get all resumes | — |
| `GET` | `/api/resumes/{id}` | Get resume by ID | — |
| `DELETE` | `/api/resumes/{id}` | Delete resume | — |

### Upload Resume

```http
POST /api/resumes/upload
Content-Type: multipart/form-data
```

Form-data:

| Key | Type | Value |
|---|---|---|
| `file` | File | `resume.pdf` |

---

## Screening APIs

| Method | Endpoint | Description | Request |
|---|---|---|---|
| `POST` | `/api/screen` | Screen candidate | JSON |
| `GET` | `/api/screen/results` | Get screening results | — |
| `GET` | `/api/screen/results/{id}` | Get result by ID | — |
| `GET` | `/api/screen/shortlisted` | Get shortlisted candidates | — |
| `PUT` | `/api/screen/results/{id}/shortlist` | Update shortlist status | JSON |

### Screen Candidate

```http
POST /api/screen
Content-Type: application/json
```

```json
{
  "resumeId": 1,
  "jobId": 1
}
```

### Example Screening Response

```json
{
  "id": 1,
  "candidateName": "John Doe",
  "jobTitle": "Java Backend Developer",
  "matchScore": 8.5,
  "matchedSkills": [
    "Java",
    "Spring Boot",
    "MySQL",
    "REST API"
  ],
  "missingSkills": [
    "Docker"
  ],
  "experienceRelevance": "Strong",
  "educationRelevance": "Relevant",
  "justification": "The candidate has strong backend development experience and matches most of the required technical skills.",
  "shortlisted": true
}
```

---

# 🧠 AI Screening Logic

Jobsuit.ai sends the following information to the LLM:

```text
Candidate Resume
        +
Job Description
        +
Required Skills
```

The model evaluates:

- Skills
- Experience
- Education
- Overall relevance

Expected structured output:

```json
{
  "score": 8,
  "matchedSkills": [],
  "missingSkills": [],
  "experienceRelevance": "",
  "educationRelevance": "",
  "justification": ""
}
```

The backend validates the response and persists the screening result in MySQL.

---

# 📊 Candidate Scoring

| Score | Category | Interpretation |
|---:|---|---|
| `8–10` | 🟢 High Match | Strong candidate fit |
| `5–7.9` | 🟡 Medium Match | Partial candidate fit |
| `1–4.9` | 🔴 Low Match | Weak candidate fit |

### Default Shortlisting Rule

```text
matchScore >= 7 → shortlisted = true
matchScore < 7  → shortlisted = false
```

---

# 🧪 Postman Testing

Recommended API testing sequence:

```text
1. POST /api/jobs
        ↓
2. GET /api/jobs
        ↓
3. POST /api/resumes/upload
        ↓
4. GET /api/resumes
        ↓
5. POST /api/screen
        ↓
6. GET /api/screen/results
        ↓
7. GET /api/screen/shortlisted
        ↓
8. PUT /api/screen/results/{id}/shortlist
```

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure the following are installed:

- Java 21
- Maven 3.x
- MySQL 8.x
- MySQL Workbench
- Git
- Postman
- Node.js / npm for frontend

---

## 1. Clone the Repository

```bash
git clone https://github.com/<YOUR_USERNAME>/jobsuit-ai.git
cd jobsuit-ai
```

---

## 2. Create MySQL Database

Open MySQL Workbench:

```sql
CREATE DATABASE jobsuit;
```

---

## 3. Configure Backend

Example `application.properties`:

```properties
spring.application.name=jobsuit-backend

spring.datasource.url=jdbc:mysql://localhost:3306/jobsuit
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080

llm.api.key=${LLM_API_KEY}
```

---

## 4. Configure Environment Variables

Set:

```text
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
LLM_API_KEY=your_llm_api_key
```

### ⚠️ Security

Never commit:

```text
DB_PASSWORD
LLM_API_KEY
```

to GitHub.

Add sensitive local configuration to `.gitignore`.

---

## 5. Build Backend

```bash
cd backend
mvn clean install
```

---

## 6. Run Backend

```bash
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

## 7. Run Frontend

From the frontend directory:

```bash
npm install
npm run dev
```

Update the frontend API base URL to:

```text
http://localhost:8080
```

---

# 🔐 Security

The application is designed to protect sensitive configuration and data.

Security practices include:

- Environment variables for credentials
- Validation of incoming requests
- Global exception handling
- CORS configuration
- DTO-based API responses
- No hardcoded API keys
- No database passwords committed to Git

### Future Security Enhancements

- JWT authentication
- Role-based authorization
- Recruiter accounts
- Password hashing
- Refresh tokens
- API rate limiting

---

# 🧱 Backend Architecture

The backend follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Controller Layer

Handles:

- HTTP requests
- API routes
- Request validation
- HTTP responses

### Service Layer

Handles:

- Business logic
- Resume processing
- Job management
- AI screening
- Shortlisting

### Repository Layer

Handles:

- Database operations
- CRUD
- Query execution

### Entity Layer

Represents:

- Jobs
- Resumes
- Screening results

### DTO Layer

Controls:

- API request structure
- API response structure
- Data exposure

---

# 🧩 Git Commit Development Plan

The backend is developed incrementally through 25 commits:

| # | Commit | Result |
|---:|---|---|
| 01 | Initialize Spring Boot backend | Project setup |
| 02 | Configure MySQL | Database connection |
| 03 | Create Resume entity | Resume model |
| 04 | Add Resume repository | Resume persistence |
| 05 | Create Job entity | Job model |
| 06 | Add Job repository | Job persistence |
| 07 | Add Job DTOs | API models |
| 08 | Implement Job service | Job business logic |
| 09 | Implement Job APIs | Job REST endpoints |
| 10 | Add PDFBox | PDF processing |
| 11 | Implement PDF parser | Resume text extraction |
| 12 | Implement Resume service | Resume logic |
| 13 | Implement Resume APIs | Resume endpoints |
| 14 | Extract resume information | Skills/education/experience |
| 15 | Add Resume response DTO | Clean API responses |
| 16 | Create Screening entity | AI result model |
| 17 | Add Screening repository | Screening persistence |
| 18 | Add Screening DTOs | Screening API models |
| 19 | Implement LLM service | AI integration |
| 20 | Implement Screening service | Candidate evaluation |
| 21 | Implement Screening APIs | Screening endpoints |
| 22 | Add shortlisting/filtering | Candidate management |
| 23 | Add exception handling | Backend robustness |
| 24 | Configure CORS/frontend integration | Full-stack connection |
| 25 | Testing/documentation | Final release |

---

# 🛡️ Error Handling

The backend provides centralized exception handling for:

- Invalid requests
- Missing resources
- Invalid PDF files
- Validation failures
- Database errors
- LLM/API failures
- Unexpected server errors

Example error response:

```json
{
  "status": 404,
  "message": "Resume not found",
  "timestamp": "2026-08-23T12:00:00"
}
```

---

# 📈 Future Enhancements

Planned improvements include:

- 🔐 JWT authentication
- 👥 Recruiter accounts and roles
- 📧 Email notifications
- 📅 Interview scheduling
- 📊 Recruitment analytics
- 🔎 Advanced semantic candidate search
- 🤖 Batch resume screening
- ⚡ Asynchronous AI processing
- 🚀 Docker deployment
- ☁️ Cloud deployment
- 🔄 CI/CD pipeline
- 🗃️ Cloud file storage
- ⚡ Redis caching
- 📱 Enhanced mobile responsiveness

---

# 🎯 Project Objective

Traditional resume screening is time-consuming, repetitive, and difficult to scale.

Jobsuit.ai aims to reduce this manual effort by combining:

```text
Resume Parsing
      +
AI Semantic Matching
      +
Explainable Scoring
      +
Skill Gap Analysis
      +
Automatic Shortlisting
```

This allows recruiters to focus on the most relevant candidates instead of manually reviewing every resume.

---

# 🌟 Why Jobsuit.ai?

### Traditional Recruitment

```text
Resume
   ↓
Manual Review
   ↓
Keyword Matching
   ↓
Manual Comparison
   ↓
Decision
```

### Jobsuit.ai

```text
Resume
   ↓
Automated Parsing
   ↓
Structured Candidate Data
   ↓
AI Semantic Matching
   ↓
Score + Skills + Explanation
   ↓
Automatic Shortlisting
```

---

# 🚀 Production Deployment

A production-ready deployment can follow:

```text
                    ┌─────────────────┐
                    │    Internet     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Frontend     │
                    │    Hosting      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Spring Boot API │
                    └───────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  MySQL   │  │ LLM API  │  │ Storage  │
        └──────────┘  └──────────┘  └──────────┘
```

---

# 👨‍💻 Contributors

- **SINDULURI TEJASREE** — Project Developer

---

# 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Test the application.
5. Commit your changes.

```bash
git commit -m "Add your feature"
```

6. Push the branch.

```bash
git push origin feature/your-feature
```

7. Create a Pull Request.

---

# 📜 License

Copyright (c) 2026 SINDULURI TEJASREE

This project is developed for educational, portfolio, and demonstration purposes.

## MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---

# 👨‍💻 Project

<div align="center">

### Jobsuit.ai

**AI-Powered Resume Screening & Intelligent Candidate Matching**

Built with ❤️ by **SINDULURI TEJASREE** using Java, Spring Boot, MySQL and AI.

⭐ If you find this project useful, consider giving the repository a star!

