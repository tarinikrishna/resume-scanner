import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Eye,
  ArrowRight,
  FileCheck,
  X
} from 'lucide-react';
import { 
  getJobs, 
  getResumes, 
  getScreeningResults, 
  screenCandidate, 
  updateShortlistStatus
} from '../services/api';
import type { Job, Resume, ScreeningResult } from '../services/api';

interface ScreeningPageProps {
  preselectedJobId?: string;
  onClearPreselectedJob?: () => void;
}

export const ScreeningPage: React.FC<ScreeningPageProps> = ({ preselectedJobId, onClearPreselectedJob }) => {
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  // Selector Form State
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [screeningActive, setScreeningActive] = useState(false);
  const [screeningStep, setScreeningStep] = useState(0);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [shortlistFilter, setShortlistFilter] = useState('all');

  // Selected Result Modal State
  const [selectedResult, setSelectedResult] = useState<ScreeningResult | null>(null);
  const [selectedResultResume, setSelectedResultResume] = useState<Resume | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsList, resumesList, resultsList] = await Promise.all([
        getJobs(),
        getResumes(),
        getScreeningResults()
      ]);

      setJobs(jobsList);
      setResumes(resumesList);
      setResults(resultsList);

      // Handle preselection from Jobs page link
      if (preselectedJobId) {
        setSelectedJobId(preselectedJobId);
        setJobFilter(preselectedJobId);
      }
    } catch (err) {
      console.error("Failed to load screening data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Clean up preselected jobId when component unmounts
    return () => {
      if (onClearPreselectedJob) onClearPreselectedJob();
    };
  }, [preselectedJobId]);

  const handleScreenCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId || !selectedResumeId) {
      alert("Please select both a job requirement and a candidate resume.");
      return;
    }

    try {
      setScreeningActive(true);
      setScreeningStep(0);

      // Animate steps through screening progress

      const stepInterval = setInterval(() => {
        setScreeningStep(prev => {
          if (prev < 3) return prev + 1;
          return prev;
        });
      }, 900);

      const result = await screenCandidate(selectedResumeId, selectedJobId);
      
      clearInterval(stepInterval);
      setScreeningStep(4);
      
      // Delay slightly so the user sees "Complete" before modal shuts
      setTimeout(() => {
        setScreeningActive(false);
        setSelectedResumeId('');
        loadData(); // Reload results
        
        // Auto open the detailed results modal for immediate feedback
        setSelectedResult(result);
        const matchedResume = resumes.find(r => r.id === result.resumeId);
        if (matchedResume) setSelectedResultResume(matchedResume);
      }, 600);

    } catch (err: any) {
      setScreeningActive(false);
      alert("Screening failed: " + err.message);
    }
  };

  const handleToggleShortlist = async (id: string, currentStatus: boolean) => {
    try {
      const updated = await updateShortlistStatus(id, !currentStatus);
      setResults(prev => prev.map(r => r.id === id ? updated : r));
      
      // If modal is open, update its state too
      if (selectedResult && selectedResult.id === id) {
        setSelectedResult(updated);
      }
    } catch (err) {
      console.error("Failed to update shortlist status", err);
    }
  };

  const openDetailsModal = (result: ScreeningResult) => {
    setSelectedResult(result);
    const resumeDetails = resumes.find(r => r.id === result.resumeId);
    setSelectedResultResume(resumeDetails || null);
  };

  // Filter Logic
  const filteredResults = results.filter(res => {
    // 1. Search filter
    const matchesSearch = 
      res.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.matchedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      res.missingSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Job filter
    const matchesJob = jobFilter === 'all' || res.jobId === jobFilter;

    // 3. Score filter
    let matchesScore = true;
    if (scoreFilter === 'high') matchesScore = res.matchScore >= 8.0;
    else if (scoreFilter === 'medium') matchesScore = res.matchScore >= 5.0 && res.matchScore < 8.0;
    else if (scoreFilter === 'low') matchesScore = res.matchScore < 5.0;

    // 4. Shortlisted filter
    let matchesShortlist = true;
    if (shortlistFilter === 'shortlisted') matchesShortlist = res.shortlisted === true;
    else if (shortlistFilter === 'reviewed') matchesShortlist = res.shortlisted === false;

    return matchesSearch && matchesJob && matchesScore && matchesShortlist;
  });

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.0) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (score >= 5.0) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-rose-50 text-rose-700 border-rose-100';
  };

  const getScoreCategory = (score: number) => {
    if (score >= 8.0) return 'High Match';
    if (score >= 5.0) return 'Medium Match';
    return 'Low Match';
  };

  return (
    <div className="space-y-8 relative">

      {/* SCREENING WIDGET PANEL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
          <div className="bg-purple-100 text-purple-700 p-1.5 rounded-lg">
            <Sparkles size={16} />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">Run New Candidate Screening Match</h3>
        </div>

        <form onSubmit={handleScreenCandidate} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Job Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Job Requirement</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 font-semibold text-xs bg-white text-slate-700"
            >
              <option value="">-- Choose Job Posting --</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.jobTitle}</option>
              ))}
            </select>
          </div>

          {/* Candidate Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Candidate Resume</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 font-semibold text-xs bg-white text-slate-700"
            >
              <option value="">-- Choose Candidate PDF --</option>
              {resumes.map(res => (
                <option key={res.id} value={res.id}>{res.candidateName} ({res.fileName})</option>
              ))}
            </select>
          </div>

          {/* Trigger Button */}
          <button
            type="submit"
            disabled={!selectedJobId || !selectedResumeId}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-100 disabled:shadow-none text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-purple-100 transition-colors text-xs flex items-center justify-center gap-1.5"
          >
            Analyze & Match Candidate <ArrowRight size={14} />
          </button>
        </form>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        
        {/* Filter Toolbar */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Screening Dashboard</h3>
              <p className="text-xs text-slate-400 font-medium">Verify AI scores, skills match analysis, and shortlists</p>
            </div>
            
            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search candidates, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-50">
            {/* Job Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Posting</label>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-semibold text-xs bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="all">All Jobs</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.jobTitle}</option>
                ))}
              </select>
            </div>

            {/* Match Score Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Match Score</label>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-semibold text-xs bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="all">All Matches</option>
                <option value="high">High Match (8.0 - 10.0)</option>
                <option value="medium">Medium Match (5.0 - 7.9)</option>
                <option value="low">Low Match (1.0 - 4.9)</option>
              </select>
            </div>

            {/* Shortlisted Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shortlist Status</label>
              <select
                value={shortlistFilter}
                onChange={(e) => setShortlistFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-semibold text-xs bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="all">All Candidates</option>
                <option value="shortlisted">Shortlisted Only (Score &ge; 7)</option>
                <option value="reviewed">Reviewed (Not Shortlisted)</option>
              </select>
            </div>
          </div>
        </div>

        {/* RESULTS TABLE */}
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-12 bg-slate-100 rounded-lg" />
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-50/20">
            <FileCheck size={40} className="text-slate-200 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No Screening Results Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              {searchQuery || jobFilter !== 'all' || scoreFilter !== 'all' || shortlistFilter !== 'all'
                ? "No candidates match your active filtering parameters." 
                : "No candidates have been screened against job requirements yet. Run a screening analysis above."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Candidate</th>
                  <th className="py-3 px-6">Job Applied</th>
                  <th className="py-3 px-6">Match Score</th>
                  <th className="py-3 px-6">Skills Analysis</th>
                  <th className="py-3 px-6">Exp Relevance</th>
                  <th className="py-3 px-6">Edu Relevance</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {filteredResults.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* Candidate */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm">{res.candidateName}</div>
                    </td>

                    {/* Job */}
                    <td className="py-4 px-6 text-slate-700 font-medium">{res.jobTitle}</td>

                    {/* Score */}
                    <td className="py-4 px-6">
                      <div className={`w-fit px-2.5 py-1.5 rounded-lg border font-extrabold text-sm ${getScoreBadgeColor(res.matchScore)}`}>
                        {res.matchScore} / 10
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">{getScoreCategory(res.matchScore)}</span>
                    </td>

                    {/* Skills Gap Summary */}
                    <td className="py-4 px-6 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {res.matchedSkills.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {s} ✓
                          </span>
                        ))}
                        {res.missingSkills.slice(0, 2).map((s, idx) => (
                          <span key={idx} className="bg-rose-50 border border-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {s} ✕
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Exp Relevance */}
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase tracking-wider ${
                        res.experienceRelevance === 'Strong' ? 'bg-emerald-50 text-emerald-700' :
                        res.experienceRelevance === 'Medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {res.experienceRelevance}
                      </span>
                    </td>

                    {/* Edu Relevance */}
                    <td className="py-4 px-6 text-slate-700 font-medium">{res.educationRelevance}</td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {res.shortlisted ? (
                        <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Shortlisted
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Reviewed
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 flex items-center justify-center gap-2">
                      <button
                        onClick={() => openDetailsModal(res)}
                        className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors border border-purple-100 bg-white"
                        title="View Profile Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleShortlist(res.id, res.shortlisted)}
                        className={`p-2 rounded-lg border transition-colors ${
                          res.shortlisted
                            ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                        }`}
                        title={res.shortlisted ? "Remove from Shortlist" : "Add to Shortlist"}
                      >
                        <UserCheck size={14} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SCREENING RUN LOADER OVERLAY */}
      {screeningActive && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 max-w-sm w-full text-center">
            
            {/* Spinning Loader */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-purple-600 animate-spin" />
              <div className="absolute text-purple-600">
                <Sparkles size={24} className="animate-pulse" />
              </div>
            </div>

            <h3 className="font-extrabold text-slate-900 text-lg">AI Candidate Screening</h3>
            <p className="text-slate-400 text-xs mt-1 font-medium leading-relaxed">Analyzing profile against role requirements using Gemini AI models.</p>

            {/* Checklist progress */}
            <div className="mt-6 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 text-left text-xs font-semibold text-slate-400 pl-6">
              <div className={screeningStep >= 0 ? 'text-slate-800' : ''}>
                {screeningStep >= 0 ? '✓' : '○'} Fetching Candidate PDF
              </div>
              <div className={screeningStep >= 1 ? 'text-slate-800' : ''}>
                {screeningStep >= 1 ? '✓' : '○'} Extracting Resume Text
              </div>
              <div className={screeningStep >= 2 ? 'text-slate-800' : ''}>
                {screeningStep >= 2 ? '✓' : '○'} Mapping Core Skill Gaps
              </div>
              <div className={screeningStep >= 3 ? 'text-slate-800' : ''}>
                {screeningStep >= 3 ? '✓' : '○'} Running Semantic AI Matcher
              </div>
              {screeningStep === 4 && (
                <div className="text-emerald-600 font-bold animate-pulse">
                  ✓ Match Analysis Complete!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE PROFILE DETAILS MODAL */}
      {selectedResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative my-8">
            
            {/* Close Button */}
            <button 
              onClick={() => { setSelectedResult(null); setSelectedResultResume(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Candidate Match Dossier</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{selectedResult.candidateName}</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">Screened for: <span className="text-slate-700">{selectedResult.jobTitle}</span></p>
              </div>

              {/* Score Badge */}
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-xl border text-center ${getScoreBadgeColor(selectedResult.matchScore)}`}>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Score</div>
                  <div className="text-2xl font-black">{selectedResult.matchScore} <span className="text-xs font-bold">/10</span></div>
                </div>
                <button
                  onClick={() => handleToggleShortlist(selectedResult.id, selectedResult.shortlisted)}
                  className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    selectedResult.shortlisted 
                      ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck size={15} /> 
                  {selectedResult.shortlisted ? "Shortlisted" : "Shortlist Candidate"}
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              
              {/* Profile grids (Information) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contact info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1">Contact Information</h4>
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between"><span className="text-slate-400">Email:</span> <span className="text-slate-800">{selectedResultResume?.email || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Phone:</span> <span className="text-slate-800">{selectedResultResume?.phone || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Location:</span> <span className="text-slate-800">{selectedResultResume?.location || 'N/A'}</span></div>
                  </div>
                </div>

                {/* Original Document details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1">Resume Details</h4>
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between"><span className="text-slate-400">Original File:</span> <span className="text-slate-800 max-w-[180px] truncate" title={selectedResultResume?.fileName}>{selectedResultResume?.fileName || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Uploaded:</span> <span className="text-slate-800">{selectedResultResume?.createdAt ? new Date(selectedResultResume.createdAt).toLocaleString() : 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Database ID:</span> <span className="text-slate-800 font-mono text-[10px]">{selectedResult.id}</span></div>
                  </div>
                </div>

              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                  <h4 className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Candidate Education</h4>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">{selectedResultResume?.education || 'N/A'}</p>
                  <div className="text-[10px] text-slate-400 font-semibold">Education Match Relevance: <span className="text-slate-600 font-bold">{selectedResult.educationRelevance}</span></div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                  <h4 className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Candidate Experience</h4>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">{selectedResultResume?.experience || 'N/A'}</p>
                  <div className="text-[10px] text-slate-400 font-semibold">Experience Match Relevance: <span className="text-slate-600 font-bold">{selectedResult.experienceRelevance}</span></div>
                </div>

              </div>

              {/* Extracted Skills List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1">Extracted Candidate Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedResultResume?.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI MATCH ANALYSIS BLOCK */}
              <div className="border-t border-slate-100 pt-6 space-y-5">
                <div className="flex items-center gap-1 text-purple-800 font-black">
                  <Sparkles size={16} /> <span>AI Match Analysis & Skill Gap Report</span>
                </div>

                {/* Skills mapping grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matched skills */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={12} /> Matched Skills ({selectedResult.matchedSkills.length})
                    </h5>
                    {selectedResult.matchedSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {selectedResult.matchedSkills.map((s, i) => (
                          <span key={i} className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-emerald-600 font-medium italic">No matched skills detected.</p>
                    )}
                  </div>

                  {/* Missing skills */}
                  <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 space-y-2">
                    <h5 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                      <XCircle size={12} /> Missing Skills ({selectedResult.missingSkills.length})
                    </h5>
                    {selectedResult.missingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {selectedResult.missingSkills.map((s, i) => (
                          <span key={i} className="bg-rose-100 border border-rose-200 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-rose-600 font-medium italic">No missing skills detected. Perfect skills match!</p>
                    )}
                  </div>
                </div>

                {/* Justification Text */}
                <div className="bg-purple-50/40 border border-purple-100 rounded-xl p-5 space-y-2 leading-relaxed">
                  <h5 className="text-xs font-bold text-purple-800 uppercase tracking-wider">AI Justification</h5>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    {selectedResult.justification}
                  </p>
                </div>

              </div>

            </div>

            {/* Modal footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Processed via Gemini LLM models</span>
              <button 
                onClick={() => { setSelectedResult(null); setSelectedResultResume(null); }}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-bold transition-colors"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
