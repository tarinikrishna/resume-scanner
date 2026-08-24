import React, { useState, useEffect } from 'react';
import { Server, Database, Key, CheckCircle } from 'lucide-react';
import { getApiStatus, setForceMock } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [status, setStatus] = useState(getApiStatus());
  const [mockToggle, setMockToggle] = useState(status.isMock);

  const handleToggleMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setMockToggle(val);
    setForceMock(val);
    setStatus(getApiStatus());
  };

  // Poll status
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getApiStatus());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">System Settings & Connection</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          Monitor your Spring Boot REST API integration, database configuration, and LLM setup.
        </p>
      </div>

      {/* SYSTEM STATUS CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Server size={18} className="text-purple-600" /> Integration Status Monitor
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Mode Info */}
          <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Mode</span>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-3 h-3 rounded-full ${status.isMock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-sm font-black text-slate-800">{status.mode}</span>
            </div>
          </div>

          {/* Database Info */}
          <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">MongoDB Database</span>
            <div className="flex items-center gap-2 mt-1 text-slate-700 font-bold text-sm">
              <Database size={16} className="text-purple-600" />
              <span>jobsuit (localhost:27017)</span>
            </div>
          </div>
        </div>

        {/* MOCK TOGGLE */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Force Local Demo Mode</h4>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-0.5 max-w-md">
              Bypasses REST API network requests and forces the application to run entirely inside the browser's localStorage. Useful for testing UI workflows when the backend server is stopped.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              checked={mockToggle}
              onChange={handleToggleMock}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* SETUP GUIDE CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Key size={18} className="text-purple-600" /> Live Environment Configuration
        </h3>

        <div className="space-y-4 text-xs font-medium leading-relaxed text-slate-600">
          <p>
            To connect the frontend to your Spring Boot REST API and enable real AI screening, make sure the following settings are configured:
          </p>

          <ol className="list-decimal pl-4 space-y-3.5 text-slate-700">
            <li>
              <strong>Start MongoDB Server</strong>: Ensure MongoDB is running locally on your computer at <code className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-rose-600 font-mono text-[10px]">localhost:27017</code>.
            </li>
            <li>
              <strong>Set the Gemini API Key</strong>: 
              Set the <code className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-purple-700 font-mono text-[10px]">GEMINI_API_KEY</code> environment variable, or configure it directly in your backend:
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg font-mono text-[10px] text-slate-600 mt-1 border-l-4 border-l-purple-500">
                # In jobsuit-backend/src/main/resources/application.properties<br />
                gemini.api.key=YOUR_ACTUAL_GEMINI_API_KEY
              </div>
            </li>
            <li>
              <strong>Run the Backend Server</strong>:
              Run the Spring Boot application on port <code className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-rose-600 font-mono text-[10px]">8080</code> using Maven:
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg font-mono text-[10px] text-slate-600 mt-1 border-l-4 border-l-purple-500">
                cd jobsuit-backend<br />
                ./mvnw spring-boot:run
              </div>
            </li>
            <li>
              <strong>CORS Authorization</strong>:
              The backend configuration is already optimized to allow CORS requests from <code className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-rose-600 font-mono text-[10px]">http://localhost:5173</code> (the default React dev server).
            </li>
          </ol>

          <div className="bg-purple-50 border border-purple-100 text-purple-700 p-4 rounded-xl flex items-start gap-2.5">
            <CheckCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-purple-900 block text-xs mb-0.5">High-Fidelity AI Fallback Activated</span>
              <p className="text-[10px] text-purple-800 leading-normal">
                If the Gemini API key is missing, the backend will automatically activate a high-fidelity local keyword and regex parsing engine. This allows you to test the complete candidate screening and skill gap analysis workflows immediately without incurring API charges.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
