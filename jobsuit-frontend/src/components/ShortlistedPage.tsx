import React, { useState, useEffect } from 'react';
import { UserCheck, Trash2, Eye, X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getShortlistedCandidates, updateShortlistStatus, getResumes } from '../services/api';
import type { Resume, ScreeningResult } from '../services/api';

export const ShortlistedPage: React.FC = () => {
  const [shortlist, setShortlist] = useState<ScreeningResult[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Result Modal State
  const [selectedResult, setSelectedResult] = useState<ScreeningResult | null>(null);
  const [selectedResultResume, setSelectedResultResume] = useState<Resume | null>(null);

  const fetchShortlistData = async () => {
    try {
      setLoading(true);
      const [list, resumesList] = await Promise.all([
        getShortlistedCandidates(),
        getResumes()
      ]);
      setShortlist(list);
      setResumes(resumesList);
    } catch (err) {
      console.error("Failed to load shortlisted candidates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlistData();
  }, []);

  const handleRemoveFromShortlist = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this candidate from the shortlist?")) return;
    try {
      await updateShortlistStatus(id, false);
      setShortlist(prev => prev.filter(item => item.id !== id));
      
      // Close modal if open
      if (selectedResult && selectedResult.id === id) {
        setSelectedResult(null);
        setSelectedResultResume(null);
      }
    } catch (err) {
      console.error("Failed to remove from shortlist", err);
    }
  };

  const openDetailsModal = (result: ScreeningResult) => {
    setSelectedResult(result);
    const resumeDetails = resumes.find(r => r.id === result.resumeId);
    setSelectedResultResume(resumeDetails || null);
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.0) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (score >= 7.0) return 'bg-purple-50 text-purple-700 border-purple-100';
    return 'bg-amber-50 text-amber-700 border-amber-100';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        {[1, 2].map(n => (
          <div key={n} className="h-16 bg-slate-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Shortlisted Candidates</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          Top-tier matches automatically and manually shortlisted for job postings.
        </p>
      </div>

      {/* SHORTLIST TABLE */}
      {shortlist.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="bg-purple-50 text-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-100">
            <UserCheck size={26} />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">No Candidates Shortlisted Yet</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4 font-medium">
            Candidates with an AI match score of 7.0 or higher are automatically shortlisted. Run screening matches to find top talent.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Candidate</th>
                  <th className="py-3 px-6">Job Role</th>
                  <th className="py-3 px-6">Match Score</th>
                  <th className="py-3 px-6">Top Skills Matched</th>
                  <th className="py-3 px-6">Experience Relevance</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {shortlist.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* Candidate */}
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                      {item.candidateName}
                    </td>

                    {/* Job Title */}
                    <td className="py-4 px-6 text-slate-700 font-medium">{item.jobTitle}</td>

                    {/* Score */}
                    <td className="py-4 px-6">
                      <div className={`w-fit px-2.5 py-1.5 rounded-lg border font-extrabold text-sm ${getScoreBadgeColor(item.matchScore)}`}>
                        {item.matchScore} / 10
                      </div>
                    </td>

                    {/* Matched skills */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {item.matchedSkills.slice(0, 4).map((s, idx) => (
                          <span key={idx} className="bg-purple-50 text-purple-700 border border-purple-100 text-[9px] font-bold px-2 py-0.5 rounded">
                            {s} ✓
                          </span>
                        ))}
                        {item.matchedSkills.length > 4 && (
                          <span className="text-[9px] text-slate-400 font-bold px-1.5 py-0.5">
                            +{item.matchedSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Experience relevance */}
                    <td className="py-4 px-6 text-slate-700 font-medium">
                      <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase tracking-wider ${
                        item.experienceRelevance === 'Strong' ? 'bg-emerald-50 text-emerald-700' :
                        item.experienceRelevance === 'Medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {item.experienceRelevance} Relevance
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 flex items-center justify-center gap-2">
                      <button
                        onClick={() => openDetailsModal(item)}
                        className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors border border-purple-100 bg-white"
                        title="View Profile Dossier"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleRemoveFromShortlist(item.id)}
                        className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors border border-rose-100 bg-white"
                        title="Remove from Shortlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL PROFILE MODAL (REUSED FROM SCREENING) */}
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
                  onClick={() => handleRemoveFromShortlist(selectedResult.id)}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-rose-100"
                >
                  <Trash2 size={15} /> Remove Shortlist
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              
              {/* Profile details */}
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

                {/* Resume details */}
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

              {/* AI MATCH ANALYSIS */}
              <div className="border-t border-slate-100 pt-6 space-y-5">
                <div className="flex items-center gap-1 text-purple-800 font-black">
                  <Sparkles size={16} /> <span>AI Match Analysis & Skill Gap Report</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matched skills */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={12} /> Matched Skills ({selectedResult.matchedSkills.length})
                    </h5>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedResult.matchedSkills.map((s, i) => (
                        <span key={i} className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing skills */}
                  <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 space-y-2">
                    <h5 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle size={12} /> Missing Skills ({selectedResult.missingSkills.length})
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

                {/* Justification */}
                <div className="bg-purple-50/40 border border-purple-100 rounded-xl p-5 space-y-2">
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
