// Jobsuit.ai API and Service Layer

const API_BASE_URL = 'http://localhost:8080/api';

// Toggle to force mock API during frontend-only development
let forceMock = false;
let isOfflineMode = false;

export const setForceMock = (val: boolean) => {
  forceMock = val;
};

export const getApiStatus = () => {
  return {
    isMock: forceMock || isOfflineMode,
    mode: (forceMock || isOfflineMode) ? 'Demo (Local Database)' : 'Live Backend (Spring Boot + MongoDB)'
  };
};

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Resume {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: string;
  education: string;
  resumeText: string;
  fileName: string;
  createdAt: string;
}

export interface Job {
  id: string;
  jobTitle: string;
  description: string;
  requiredSkills: string[];
  createdAt: string;
}

export interface ScreeningResult {
  id: string;
  resumeId: string;
  jobId: string;
  candidateName: string;
  jobTitle: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceRelevance: string;
  educationRelevance: string;
  justification: string;
  shortlisted: boolean;
  createdAt: string;
}

// ==========================================
// LOCAL STORAGE MOCK DATABASE (Offline Mode)
// ==========================================

const INITIAL_JOBS = [
  {
    id: "job-1",
    jobTitle: "Java Backend Developer",
    description: "We are looking for a Java developer to join our backend team. You will build high-performance microservices, optimize MongoDB queries, and deploy cloud infrastructure.",
    requiredSkills: ["Java", "Spring Boot", "REST API", "MongoDB", "Git", "Docker", "AWS"],
    createdAt: new Date("2026-08-23T10:00:00").toISOString()
  },
  {
    id: "job-2",
    jobTitle: "Frontend React Engineer",
    description: "Looking for a React developer with strong styling skills and experience building SaaS dashboards. Experience with Tailwind CSS and TypeScript is required.",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML", "CSS", "Git"],
    createdAt: new Date("2026-08-22T09:00:00").toISOString()
  }
];

const INITIAL_RESUMES = [
  {
    id: "resume-1",
    candidateName: "John Doe",
    email: "john.doe@gmail.com",
    phone: "+91 98765 43210",
    location: "Hyderabad, India",
    skills: ["Java", "Spring Boot", "REST API", "Git", "MySQL", "JavaScript"],
    experience: "2 years of backend experience",
    education: "B.Tech Computer Science from VIT",
    resumeText: "John Doe. email: john.doe@gmail.com, phone: +91 98765 43210. 2 years of backend experience as a Java Developer. Skills: Java, Spring Boot, REST API, Git, MySQL, HTML, CSS, JavaScript. Education: B.Tech Computer Science from VIT.",
    fileName: "john_resume.pdf",
    createdAt: new Date("2026-08-23T10:00:00").toISOString()
  },
  {
    id: "resume-2",
    candidateName: "Jane Smith",
    email: "jane.smith@yahoo.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, USA",
    skills: ["React", "TypeScript", "Tailwind CSS", "Git", "HTML", "CSS", "Node.js"],
    experience: "4+ years of frontend experience",
    education: "Master of Science in Software Engineering, SFSU",
    resumeText: "Jane Smith. email: jane.smith@yahoo.com. 4+ years of frontend experience at tech startups. Skills: React, TypeScript, Tailwind CSS, Git, HTML, CSS, Node.js, Webpack, Figma. Education: Master of Science in Software Engineering, SFSU.",
    fileName: "jane_smith_cv.pdf",
    createdAt: new Date("2026-08-23T10:30:00").toISOString()
  },
  {
    id: "resume-3",
    candidateName: "Rajesh Kumar",
    email: "rajesh.k@outlook.com",
    phone: "+91 87654 32109",
    location: "Bengaluru, India",
    skills: ["Python", "Django", "SQL", "Git", "AWS", "Docker"],
    experience: "3 years of software development",
    education: "B.E. in Information Technology, Anna University",
    resumeText: "Rajesh Kumar. phone: +91 87654 32109, email: rajesh.k@outlook.com. 3 years of software development experience. Skills: Python, Django, SQL, Git, AWS, Docker, HTML, CSS. Education: B.E. in Information Technology, Anna University.",
    fileName: "rajesh_kumar_resume.pdf",
    createdAt: new Date("2026-08-23T11:00:00").toISOString()
  }
];

const INITIAL_SCREENING = [
  {
    id: "screen-1",
    resumeId: "resume-1",
    jobId: "job-1",
    candidateName: "John Doe",
    jobTitle: "Java Backend Developer",
    matchScore: 8.5,
    matchedSkills: ["Java", "Spring Boot", "REST API", "Git"],
    missingSkills: ["MongoDB", "Docker", "AWS"],
    experienceRelevance: "Strong",
    educationRelevance: "Relevant",
    justification: "The candidate strongly matches the Java backend requirements. They possess core skills in Java, Spring Boot, and REST APIs with 2 years of relevant experience. However, they lack cloud and containerization skills (Docker, AWS) which are listed in the job requirements.",
    shortlisted: true,
    createdAt: new Date("2026-08-23T12:00:00").toISOString()
  }
];

interface MockDb {
  jobs: Job[];
  resumes: Resume[];
  screening: ScreeningResult[];
}

const loadMockDb = (): MockDb => {
  const jobs = localStorage.getItem('jobsuit_jobs');
  const resumes = localStorage.getItem('jobsuit_resumes');
  const screening = localStorage.getItem('jobsuit_screening');

  if (!jobs || !resumes || !screening) {
    localStorage.setItem('jobsuit_jobs', JSON.stringify(INITIAL_JOBS));
    localStorage.setItem('jobsuit_resumes', JSON.stringify(INITIAL_RESUMES));
    localStorage.setItem('jobsuit_screening', JSON.stringify(INITIAL_SCREENING));
    return { jobs: INITIAL_JOBS as Job[], resumes: INITIAL_RESUMES as Resume[], screening: INITIAL_SCREENING as ScreeningResult[] };
  }

  return {
    jobs: JSON.parse(jobs) as Job[],
    resumes: JSON.parse(resumes) as Resume[],
    screening: JSON.parse(screening) as ScreeningResult[]
  };
};

const saveMockDb = (db: { jobs: any[]; resumes: any[]; screening: any[] }) => {
  localStorage.setItem('jobsuit_jobs', JSON.stringify(db.jobs));
  localStorage.setItem('jobsuit_resumes', JSON.stringify(db.resumes));
  localStorage.setItem('jobsuit_screening', JSON.stringify(db.screening));
};

// ==========================================
// API HELPER METHOD WITH AUTO-FALLBACK
// ==========================================

async function apiRequest<T>(url: string, options?: RequestInit, fallbackAction?: () => T): Promise<T> {
  if (forceMock) {
    if (fallbackAction) return fallbackAction();
    throw new Error("Mock API is forced and no fallback action was provided.");
  }

  try {
    const response = await fetch(url, options);
    isOfflineMode = false;
    
    if (response.status === 204) {
      return null as unknown as T;
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API error with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    // If it's a network error (backend server offline), run fallback mock
    if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
      console.warn("REST API backend is offline. Falling back to local offline mock database.");
      isOfflineMode = true;
      if (fallbackAction) {
        return fallbackAction();
      }
    }
    throw error;
  }
}

// ==========================================
// RESUME API CALLS
// ==========================================

// ==========================================
// RESUME API CALLS
// ==========================================

export const uploadResume = async (file: File): Promise<Resume> => {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<Resume>(
    `${API_BASE_URL}/resumes/upload`,
    {
      method: "POST",
      body: formData,
    },
    () => {
      // Local Mock upload
      const db = loadMockDb();
      
      // Simple mock parser based on file name
      const name = file.name
        .replace(".pdf", "")
        .replace(/[_-]/g, " ")
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const mockResume: Resume = {
        id: "resume-" + Date.now(),
        candidateName: name,
        email: `${name.toLowerCase().replace(/\s/g, "")}@example.com`,
        phone: "+91 98765 " + Math.floor(10000 + Math.random() * 90000),
        location: "Hyderabad, India",
        skills: ["Java", "Spring Boot", "REST API", "Git", "Docker", "AWS"].filter(() => Math.random() > 0.3),
        experience: "2-3 years of professional experience",
        education: "Bachelor's Degree",
        resumeText: `Mock parsed resume text for ${name}. Technical skills and experience listed.`,
        fileName: file.name,
        createdAt: new Date().toISOString()
      };

      db.resumes.unshift(mockResume);
      saveMockDb(db);
      return mockResume;
    }
  );
};

export const getResumes = async (): Promise<Resume[]> => {
  return apiRequest<Resume[]>(
    `${API_BASE_URL}/resumes`,
    { method: "GET" },
    () => {
      const db = loadMockDb();
      return db.resumes;
    }
  );
};

export const getResumeById = async (id: string): Promise<Resume> => {
  return apiRequest<Resume>(
    `${API_BASE_URL}/resumes/${id}`,
    { method: "GET" },
    () => {
      const db = loadMockDb();
      const res = db.resumes.find(r => r.id === id);
      if (!res) throw new Error("Resume not found");
      return res;
    }
  );
};

export const deleteResume = async (id: string): Promise<void> => {
  return apiRequest<void>(
    `${API_BASE_URL}/resumes/${id}`,
    { method: "DELETE" },
    () => {
      const db = loadMockDb();
      db.resumes = db.resumes.filter(r => r.id !== id);
      db.screening = db.screening.filter(s => s.resumeId !== id);
      saveMockDb(db);
    }
  );
};

// ==========================================
// JOB API CALLS
// ==========================================

// ==========================================
// JOB API CALLS
// ==========================================
export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> => {
  return apiRequest<Job>(
    `${API_BASE_URL}/jobs`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    },
    () => {
      const db = loadMockDb();
      const mockJob: Job = {
        id: "job-" + Date.now(),
        ...jobData,
        createdAt: new Date().toISOString()
      };
      db.jobs.unshift(mockJob);
      saveMockDb(db);
      return mockJob;
    }
  );
};

export const getJobs = async (): Promise<Job[]> => {
  return apiRequest<Job[]>(
    `${API_BASE_URL}/jobs`,
    { method: "GET" },
    () => {
      const db = loadMockDb();
      return db.jobs;
    }
  );
};

export const getJobById = async (id: string): Promise<Job> => {
  return apiRequest<Job>(
    `${API_BASE_URL}/jobs/${id}`,
    { method: "GET" },
    () => {
      const db = loadMockDb();
      const job = db.jobs.find(j => j.id === id);
      if (!job) throw new Error("Job not found");
      return job;
    }
  );
};

export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job> => {
  return apiRequest<Job>(
    `${API_BASE_URL}/jobs/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    },
    () => {
      const db = loadMockDb();
      const idx = db.jobs.findIndex(j => j.id === id);
      if (idx === -1) throw new Error("Job not found");
      db.jobs[idx] = { ...db.jobs[idx], ...jobData };
      saveMockDb(db);
      return db.jobs[idx];
    }
  );
};

export const deleteJob = async (id: string): Promise<void> => {
  return apiRequest<void>(
    `${API_BASE_URL}/jobs/${id}`,
    { method: "DELETE" },
    () => {
      const db = loadMockDb();
      db.jobs = db.jobs.filter(j => j.id !== id);
      db.screening = db.screening.filter(s => s.jobId !== id);
      saveMockDb(db);
    }
  );
};

// ==========================================
// SCREENING API CALLS
// ==========================================

// ==========================================
// SCREENING API CALLS
// ==========================================
export const screenCandidate = async (resumeId: string, jobId: string): Promise<ScreeningResult> => {
  return apiRequest<ScreeningResult>(
    `${API_BASE_URL}/screen`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, jobId }),
    },
    () => {
      const db = loadMockDb();
      
      // Look up items
      const resume = db.resumes.find(r => r.id === resumeId);
      const job = db.jobs.find(j => j.id === jobId);
      if (!resume || !job) throw new Error("Resume or Job not found");

      // Check if already screened
      const existing = db.screening.find(s => s.resumeId === resumeId && s.jobId === jobId);
      if (existing) return existing;

      // Mock match analysis
      const matchedSkills = job.requiredSkills.filter((s: string) => 
        resume.skills.map((rs: string) => rs.toLowerCase()).includes(s.toLowerCase())
      );
      const missingSkills = job.requiredSkills.filter((s: string) => 
        !resume.skills.map((rs: string) => rs.toLowerCase()).includes(s.toLowerCase())
      );

      const skillRatio = job.requiredSkills.length ? matchedSkills.length / job.requiredSkills.length : 0;
      let score = Math.round((1.0 + (skillRatio * 8.0) + Math.random() * 0.5) * 10) / 10;
      score = Math.max(1.0, Math.min(10.0, score));

      const shortlisted = score >= 7.0;

      const justification = score >= 7.0
        ? `The candidate represents a solid match for the ${job.jobTitle} position. They matched ${matchedSkills.length} out of ${job.requiredSkills.length} required skills, demonstrating core competencies in key technical areas. Their experience and background align well.`
        : `The candidate is a partial match for the ${job.jobTitle} position. They have core skills in ${matchedSkills.slice(0,2).join(', ') || 'basic skills'} but lack important required technologies such as ${missingSkills.slice(0, 2).join(', ') || 'advanced tools'}. Upskilling would be required.`;

      const mockResult: ScreeningResult = {
        id: "screen-" + Date.now(),
        resumeId,
        jobId,
        candidateName: resume.candidateName,
        jobTitle: job.jobTitle,
        matchScore: score,
        matchedSkills,
        missingSkills,
        experienceRelevance: score >= 8.0 ? "Strong" : score >= 5.0 ? "Medium" : "Weak",
        educationRelevance: "Relevant",
        justification,
        shortlisted,
        createdAt: new Date().toISOString()
      };

      db.screening.unshift(mockResult);
      saveMockDb(db);
      return mockResult;
    }
  );
};

export const getScreeningResults = async (jobId?: string): Promise<ScreeningResult[]> => {
  const url = jobId ? `${API_BASE_URL}/screen/results?jobId=${jobId}` : `${API_BASE_URL}/screen/results`;
  return apiRequest<ScreeningResult[]>(
    url,
    { method: "GET" },
    () => {
      const db = loadMockDb();
      if (jobId) {
        return db.screening.filter(s => s.jobId === jobId);
      }
      return db.screening;
    }
  );
};

export const getScreeningResultById = async (id: string): Promise<ScreeningResult> => {
  return apiRequest<ScreeningResult>(
    `${API_BASE_URL}/screen/results/${id}`,
    { method: "GET" },
    () => {
      const db = loadMockDb();
      const res = db.screening.find(s => s.id === id);
      if (!res) throw new Error("Screening result not found");
      return res;
    }
  );
};

export const getShortlistedCandidates = async (): Promise<ScreeningResult[]> => {
  return apiRequest<ScreeningResult[]>(
    `${API_BASE_URL}/screen/shortlisted`,
    { method: "GET" },
    () => {
      const db = loadMockDb();
      return db.screening.filter(s => s.shortlisted === true);
    }
  );
};

export const updateShortlistStatus = async (id: string, shortlisted: boolean): Promise<ScreeningResult> => {
  return apiRequest<ScreeningResult>(
    `${API_BASE_URL}/screen/results/${id}/shortlist`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortlisted }),
    },
    () => {
      const db = loadMockDb();
      const idx = db.screening.findIndex(s => s.id === id);
      if (idx === -1) throw new Error("Screening result not found");
      db.screening[idx].shortlisted = shortlisted;
      saveMockDb(db);
      return db.screening[idx];
    }
  );
};
