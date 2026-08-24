import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Trash2, X, Play } from 'lucide-react';
import { getJobs, createJob, deleteJob, getScreeningResults } from '../services/api';
import type { Job } from '../services/api';

interface JobsPageProps {
  onNavigateToScreen: (jobId: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ onNavigateToScreen }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [jobStats, setJobStats] = useState<Record<string, { count: number; avgScore: number }>>({});

  // Form State
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchJobsData = async () => {
    try {
      setLoading(true);
      const jobsList = await getJobs();
      const results = await getScreeningResults();

      // Calculate stats per job
      const stats: Record<string, { count: number; avgScore: number }> = {};
      
      jobsList.forEach(job => {
        const jobResults = results.filter(r => r.jobId === job.id);
        const count = jobResults.length;
        const totalScore = jobResults.reduce((acc, curr) => acc + curr.matchScore, 0);
        const avgScore = count ? Math.round((totalScore / count) * 10) / 10 : 0;
        
        stats[job.id] = { count, avgScore };
      });

      setJobs(jobsList);
      setJobStats(stats);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsData();
  }, []);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
    e.preventDefault();
    
    const trimmed = skillInput.trim();
    if (trimmed && !requiredSkills.includes(trimmed)) {
      setRequiredSkills([...requiredSkills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !description.trim() || requiredSkills.length === 0) {
      alert("Please fill in all fields and add at least one required skill.");
      return;
    }

    try {
      setSubmitting(true);
      await createJob({
        jobTitle: jobTitle.trim(),
        description: description.trim(),
        requiredSkills
      });

      // Reset Form
      setJobTitle('');
      setDescription('');
      setRequiredSkills([]);
      setIsCreating(false);
      
      // Refresh list
      fetchJobsData();
    } catch (err) {
      console.error("Failed to create job", err);
      alert("Error creating job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job? All associated screening results will be removed.")) return;
    
    try {
      await deleteJob(id);
      fetchJobsData();
    } catch (err) {
      console.error("Failed to delete job", err);
      alert("Error deleting job.");
    }
  };

  if (loading && !isCreating) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="h-10 w-32 bg-slate-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(n => (
            <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 h-56" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {isCreating ? "Create New Job Requirement" : "Job Postings"}
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {isCreating 
              ? "Define a new role and input required skills to parse candidates against" 
              : "Manage active recruitment roles and start candidate screening"
            }
          </p>
        </div>
        
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 hover:-translate-y-0.5 active:translate-y-0 transition text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-100 text-sm w-full sm:w-auto"
          >
            <Plus size={18} /> Create New Job
          </button>
        )}
      </div>

      {/* CREATE JOB FORM VIEW */}
      {isCreating ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-3xl mx-auto">
          <form onSubmit={handleCreateJob} className="space-y-6">
            
            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Java Backend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 font-semibold text-sm transition-all"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description</label>
              <textarea
                placeholder="Describe the job duties, requirements, and background..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 font-medium text-sm transition-all resize-y"
              />
            </div>

            {/* Required Skills (Tag Input) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Required Skills</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a skill and press Enter..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 font-semibold text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors border border-slate-200"
                >
                  Add
                </button>
              </div>

              {/* Skills Container */}
              {requiredSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-3">
                  {requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-700 px-3 py-1 rounded-xl text-xs font-bold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-purple-400 hover:text-purple-700 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 pt-2 font-medium italic">No skills added yet. Enter skills as tags to parse candidate fits.</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-purple-100 transition-colors text-sm flex items-center gap-2"
              >
                {submitting ? "Creating..." : "Create Job"}
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* JOBS LIST VIEW */
        <>
          {jobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
              <div className="bg-purple-50 text-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-100">
                <Briefcase size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">No Jobs Created Yet</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                Create your first job posting to start uploading candidate resumes and screening them using AI candidate matching.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-100 transition-colors text-sm"
              >
                <Plus size={16} /> Create Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => {
                const stats = jobStats[job.id] || { count: 0, avgScore: 0 };
                return (
                  <div 
                    key={job.id} 
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Title & Delete */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-900 leading-snug">{job.jobTitle}</h3>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                            Created: {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Job"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Description Snippet */}
                      <p className="text-slate-500 text-sm mt-3.5 line-clamp-3 font-medium leading-relaxed">
                        {job.description}
                      </p>

                      {/* Required Skills Tags */}
                      <div className="mt-4">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills</div>
                        <div className="flex flex-wrap gap-1">
                          {job.requiredSkills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Stats & Screening Trigger */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4">
                        <div className="text-center md:text-left">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Candidates</span>
                          <span className="text-sm font-black text-slate-800">{stats.count}</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200" />
                        <div className="text-center md:text-left">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Score</span>
                          <span className={`text-sm font-black ${stats.avgScore >= 7.0 ? 'text-purple-600' : 'text-slate-800'}`}>
                            {stats.avgScore > 0 ? `${stats.avgScore}/10` : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => onNavigateToScreen(job.id)}
                        className="flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-100 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm"
                      >
                        Screen Candidates <Play size={12} className="fill-purple-700" />
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

    </div>
  );
};
