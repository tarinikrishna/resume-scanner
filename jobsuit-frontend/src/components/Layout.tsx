import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  UserSquare2, 
  SearchCode, 
  UserCheck2, 
  Settings as SettingsIcon, 
  Sparkles, 
  Menu, 
  X,
  Server,
  Database
} from 'lucide-react';
import { getApiStatus } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState(getApiStatus());

  // Poll status occasionally to reflect updates
  useEffect(() => {
    const interval = setInterval(() => {
      setApiStatus(getApiStatus());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'jobs', label: 'Jobs', icon: <Briefcase size={20} /> },
    { id: 'candidates', label: 'Candidates', icon: <UserSquare2 size={20} /> },
    { id: 'screening', label: 'Screening', icon: <SearchCode size={20} /> },
    { id: 'shortlisted', label: 'Shortlisted', icon: <UserCheck2 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 p-1.5 rounded-lg text-white">
            <Sparkles size={16} />
          </div>
          <span className="font-bold text-lg text-slate-900">Jobsuit.ai</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-600 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR FOR DESKTOP */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col justify-between
        transform lg:transform-none lg:opacity-100 lg:relative transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100'}
      `}>
        
        {/* Sidebar Header */}
        <div>
          <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
            <div className="bg-purple-600 p-2 rounded-xl text-white shadow-md shadow-purple-200">
              <Sparkles size={20} />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Jobsuit.ai
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'jobs' && activeTab === 'create-job');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                    ${isActive 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-100' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (API Status) */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Server size={12} /> System Status
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${apiStatus.isMock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-xs font-bold text-slate-700 truncate">{apiStatus.mode}</span>
            </div>
            {apiStatus.isMock && (
              <p className="text-[10px] text-amber-600 mt-1.5 font-medium leading-relaxed">
                Running in local offline mode. Add a Gemini API key or start the Spring Boot server to go live.
              </p>
            )}
          </div>
        </div>

      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
        
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 hidden lg:flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-bold text-slate-900 capitalize">
              {activeTab === 'create-job' ? 'Create Job' : activeTab}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Recruiter Workspace</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">
              <Database size={14} /> MongoDB Database Connected
            </div>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 text-sm border border-purple-200">
              R
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
};
