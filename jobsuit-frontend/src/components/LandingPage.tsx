import React from 'react';
import { Shield, Sparkles, Cpu, Award, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 p-2 rounded-xl text-white shadow-md shadow-purple-200">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Jobsuit.ai
            </span>
          </div>
          <button
            onClick={onStart}
            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 transition-colors text-white font-medium px-4 py-2 rounded-xl shadow-lg shadow-purple-100 text-sm"
          >
            Go to App <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <Zap size={12} className="fill-purple-700" /> Next-Gen AI Recruitment
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 mb-6 leading-tight">
            AI-Powered <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Resume Screening</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-normal">
            Find the right talent faster with intelligent resume analysis and AI-powered candidate matching.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 hover:-translate-y-0.5 active:translate-y-0 transition text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-purple-200/80 text-base"
            >
              Start Screening <ArrowRight size={18} />
            </button>
            <button
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 transition border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl text-base"
            >
              View Demo
            </button>
          </div>
        </div>

        {/* Interactive Dashboard Mockup */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 md:p-8 max-w-5xl mx-auto mb-24 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 pointer-events-none" />
          
          {/* Header Row Mock */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs text-purple-600 font-bold uppercase tracking-wider">Candidate Match Overview</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Screening: Java Backend Developer</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={14} /> AI Engine Online
            </div>
          </div>

          {/* Table Mockup */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Match Score</th>
                  <th className="py-3 px-4">Skills Match</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                <tr>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">John Doe</div>
                    <div className="text-xs text-slate-400">john.doe@gmail.com</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="font-extrabold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg text-sm border border-purple-100">8.5 / 10</div>
                      <span className="text-xs text-purple-500 font-semibold">High Match</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Java ✓</span>
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Spring Boot ✓</span>
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">REST API ✓</span>
                      <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Docker ✕</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">2 years</td>
                  <td className="py-4 px-4">
                    <span className="bg-purple-100 text-purple-800 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Shortlisted</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">Jane Smith</div>
                    <div className="text-xs text-slate-400">jane.smith@yahoo.com</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="font-extrabold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg text-sm border border-amber-100">5.8 / 10</div>
                      <span className="text-xs text-amber-500 font-semibold">Medium Match</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Java ✓</span>
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Git ✓</span>
                      <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Spring Boot ✕</span>
                      <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Docker ✕</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">4 years</td>
                  <td className="py-4 px-4">
                    <span className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Reviewed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Section */}
        <section className="border-t border-slate-200 pt-20">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 text-center mb-16">
            Everything you need to hire the best
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Cpu size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Intelligent Resume Parsing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automatically extract candidate name, email, phone, location, education, experience, and key skills directly from PDF resumes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Candidate Matching</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Compare candidate resumes against job descriptions using advanced semantic AI matching that understands context, not just keywords.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Scoring</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Receive an objective, normalized AI match score from 1 to 10 for every candidate, highlighting the strongest fits instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Skill Gap Analysis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Instantly map candidate capabilities against required skills to see exactly what competencies are matched and which ones are missing.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Explainable AI</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Get full transparency on screening decisions with a clear, concise AI-generated text justification summarizing each candidate's fit.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Shortlisting</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automatically shortlist candidate matches that meet a configured score threshold (e.g., score &ge; 7), saving recruiters hours of manual review.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="mb-2 font-bold text-slate-300">Jobsuit.ai — AI Recruitment Platform</p>
          <p>© {new Date().getFullYear()} Jobsuit.ai. All rights reserved. Securely powered by Spring Boot, MongoDB & Gemini LLM.</p>
        </div>
      </footer>
    </div>
  );
};
