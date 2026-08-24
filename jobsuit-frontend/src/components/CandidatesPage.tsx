import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2, Search } from 'lucide-react';
import { getResumes, uploadResume, deleteResume } from '../services/api';
import type { Resume } from '../services/api';

interface UploadItem {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'processing' | 'processed' | 'error';
  progressStep: number; // 0 to 4
  errorMsg?: string;
  candidateName?: string;
}

export const CandidatesPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUploads, setActiveUploads] = useState<UploadItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const list = await getResumes();
      setResumes(list);
    } catch (err) {
      console.error("Failed to load resumes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = async (files: File[]) => {
    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      alert("Only PDF files are supported.");
      return;
    }

    // Process each PDF
    for (const file of pdfFiles) {
      const uploadId = "upload-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
      
      const newUpload: UploadItem = {
        id: uploadId,
        name: file.name,
        size: formatFileSize(file.size),
        status: 'uploading',
        progressStep: 0
      };

      setActiveUploads(prev => [newUpload, ...prev]);

      // Animate progress steps (to keep UI looking alive during LLM wait)
      const stepInterval = setInterval(() => {
        setActiveUploads(prev => 
          prev.map(item => {
            if (item.id === uploadId && item.status === 'uploading' && item.progressStep < 3) {
              return { ...item, progressStep: item.progressStep + 1 };
            }
            return item;
          })
        );
      }, 1000);

      try {
        const result = await uploadResume(file);
        
        clearInterval(stepInterval);
        setActiveUploads(prev => 
          prev.map(item => {
            if (item.id === uploadId) {
              return { 
                ...item, 
                status: 'processed', 
                progressStep: 4,
                candidateName: result.candidateName
              };
            }
            return item;
          })
        );

        // Fetch fresh list from DB
        fetchResumes();

      } catch (error: any) {
        clearInterval(stepInterval);
        setActiveUploads(prev => 
          prev.map(item => {
            if (item.id === uploadId) {
              return { 
                ...item, 
                status: 'error', 
                errorMsg: error.message || "Failed to process PDF."
              };
            }
            return item;
          })
        );
      }
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this resume? Associated screening matches will also be deleted.")) return;
    try {
      await deleteResume(id);
      fetchResumes();
    } catch (err) {
      console.error("Failed to delete resume", err);
      alert("Error deleting resume.");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const filteredResumes = resumes.filter(r => 
    r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-sans">Manage Candidates & Resumes</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          Upload multiple candidate profiles in PDF format, parse details using AI, and view the talent database.
        </p>
      </div>

      {/* DRAG AND DROP UPLOAD CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload widget */}
        <div className="lg:col-span-2 space-y-4">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`
              border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] bg-white
              ${isDragActive 
                ? 'border-purple-600 bg-purple-50/50 shadow-inner' 
                : 'border-slate-300 hover:border-purple-600 hover:shadow-sm'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              multiple 
              accept=".pdf" 
              className="hidden" 
            />
            
            <div className="bg-purple-50 text-purple-600 p-4 rounded-full mb-4 border border-purple-100 group-hover:scale-110 transition-transform">
              <Upload size={28} className={isDragActive ? 'animate-bounce' : ''} />
            </div>
            
            <h3 className="font-bold text-slate-900 text-base">Drag & Drop resumes here</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">or <span className="text-purple-600 hover:underline">browse files</span> from your computer</p>
            <span className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-4">PDF Files Only</span>
          </div>
        </div>

        {/* Upload Logs / Progress status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col max-h-[220px] lg:max-h-none overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-3">Processing Monitor</h3>
          
          {activeUploads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center py-6">
              <FileText size={28} className="text-slate-300 mb-2" />
              <p className="text-xs font-semibold">No active uploads</p>
              <p className="text-[10px] mt-0.5">Upload a PDF resume to watch real-time AI parsing</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeUploads.map((item) => (
                <div key={item.id} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="truncate font-bold text-slate-800" title={item.name}>{item.name}</div>
                    <span className="text-[10px] text-slate-400 font-bold shrink-0">{item.size}</span>
                  </div>

                  {/* Processing Status Display */}
                  <div className="mt-2 space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {item.status === 'error' ? (
                      <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                        <AlertCircle size={14} />
                        <span>Error: {item.errorMsg}</span>
                      </div>
                    ) : item.status === 'processed' ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                        <CheckCircle2 size={14} />
                        <span>Processed: {item.candidateName}</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-purple-600 font-bold animate-pulse">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                          </span>
                          <span>Analyzing Resume...</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px] font-semibold text-slate-400 pl-3.5">
                          <div className={item.progressStep >= 0 ? 'text-slate-700' : ''}>✓ Uploaded</div>
                          <div className={item.progressStep >= 1 ? 'text-slate-700' : ''}>{item.progressStep >= 1 ? '✓' : '○'} PDF Extracted</div>
                          <div className={item.progressStep >= 2 ? 'text-slate-700' : ''}>{item.progressStep >= 2 ? '✓' : '○'} Info Detected</div>
                          <div className={item.progressStep >= 3 ? 'text-slate-700' : ''}>{item.progressStep >= 3 ? '✓' : '○'} Skills Indexed</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* CANDIDATES DATABASE TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        
        {/* Table Header / Search */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Extracted Talent Pool</h3>
            <p className="text-xs text-slate-400 font-medium">Search and manage parsed candidate resumes in MongoDB</p>
          </div>
          
          <div className="relative max-w-sm w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by name, skill, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>

        {/* Resumes List Table */}
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-12 bg-slate-100 rounded-lg" />
            ))}
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText size={40} className="text-slate-200 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No Candidate Resumes Found</h4>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? "No candidates match your search query." : "Upload candidate resumes in PDF format above to index them in MongoDB."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Candidate</th>
                  <th className="py-3 px-6">Location</th>
                  <th className="py-3 px-6">Education</th>
                  <th className="py-3 px-6">Experience</th>
                  <th className="py-3 px-6">Parsed Skills</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {filteredResumes.map((resume) => (
                  <tr key={resume.id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* Candidate */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm">{resume.candidateName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{resume.email}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{resume.phone}</div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-slate-700 font-medium">{resume.location}</td>

                    {/* Education */}
                    <td className="py-4 px-6 max-w-[180px] truncate font-medium" title={resume.education}>
                      {resume.education}
                    </td>

                    {/* Experience */}
                    <td className="py-4 px-6 text-slate-700 font-medium">{resume.experience}</td>

                    {/* Skills Tags */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {resume.skills.slice(0, 5).map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="bg-purple-50 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded border border-purple-100"
                          >
                            {skill}
                          </span>
                        ))}
                        {resume.skills.length > 5 && (
                          <span className="text-[9px] text-slate-400 font-bold px-1.5 py-0.5">
                            +{resume.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Candidate"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
