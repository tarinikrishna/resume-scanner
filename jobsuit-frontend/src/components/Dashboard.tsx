import React, { useState, useEffect } from 'react';
import { Briefcase, UserSquare2, SearchCode, UserCheck2, TrendingUp, Sparkles } from 'lucide-react';
import { getJobs, getResumes, getScreeningResults, getShortlistedCandidates } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    jobsCount: 0,
    resumesCount: 0,
    screenedCount: 0,
    shortlistedCount: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobs, resumes, results, shortlisted] = await Promise.all([
          getJobs(),
          getResumes(),
          getScreeningResults(),
          getShortlistedCandidates()
        ]);

        const jobsCount = jobs.length;
        const resumesCount = resumes.length;
        const screenedCount = results.length;
        const shortlistedCount = shortlisted.length;

        setStats({
          jobsCount,
          resumesCount,
          screenedCount,
          shortlistedCount
        });

        // Calculate Match Distribution
        let highMatch = 0;
        let mediumMatch = 0;
        let lowMatch = 0;

        results.forEach(res => {
          if (res.matchScore >= 8.0) {
            highMatch++;
          } else if (res.matchScore >= 5.0) {
            mediumMatch++;
          } else {
            lowMatch++;
          }
        });

        setChartData([
          { name: 'Total Screened', value: screenedCount, color: '#6366f1' },
          { name: 'High Match (8-10)', value: highMatch, color: '#10b981' },
          { name: 'Medium Match (5-7.9)', value: mediumMatch, color: '#f59e0b' },
          { name: 'Low Match (1-4.9)', value: lowMatch, color: '#ef4444' },
          { name: 'Shortlisted (≥7)', value: shortlistedCount, color: '#8b5cf6' }
        ]);

      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Jobs', value: stats.jobsCount, icon: <Briefcase size={22} />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { label: 'Total Resumes', value: stats.resumesCount, icon: <UserSquare2 size={22} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Candidates Screened', value: stats.screenedCount, icon: <SearchCode size={22} />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Shortlisted Candidates', value: stats.shortlistedCount, icon: <UserCheck2 size={22} />, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* KPI Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 h-28" />
          ))}
        </div>
        {/* Chart Skeleton */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.3),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 bg-white/10 text-purple-200 w-fit px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles size={12} className="fill-purple-200" /> AI Resume Screener Ready
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome back, Recruiter</h1>
            <p className="text-sm text-purple-100/80 mt-1 max-w-xl">
              Create a job, upload resumes, and let the AI analyze qualifications, map required skills, and shortlist candidates instantly.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 px-4 py-3 rounded-xl">
            <TrendingUp size={20} className="text-emerald-400" />
            <div className="text-left">
              <div className="text-xs text-purple-200 font-bold uppercase tracking-wider">Shortlist Ratio</div>
              <div className="text-lg font-black">
                {stats.screenedCount ? Math.round((stats.shortlistedCount / stats.screenedCount) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <div className="text-3xl font-black text-slate-900 group-hover:scale-105 transition-transform origin-left">
                {card.value}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Screening Performance Overview</h3>
        <p className="text-xs text-slate-400 font-medium mb-6">Distribution and categorization of candidate screening metrics</p>
        
        {stats.screenedCount === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <SearchCode size={40} className="text-slate-300 mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No Screening Data Available</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Create a job, upload PDF resumes, and trigger the AI candidate matcher to see analytics charts.
            </p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
};
