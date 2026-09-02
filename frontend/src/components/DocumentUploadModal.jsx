import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Check, 
  Layers,
  Cpu
} from 'lucide-react';
import { generateQuizAPI } from '../services/api';

export default function DocumentUploadModal({ employeeId, onQuizGenerated, onClose }) {
  const [docText, setDocText] = useState('');
  const [domain, setDomain] = useState('National Accounts');
  const [numQuestions, setNumQuestions] = useState(5);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);

  const sampleTexts = {
    sna: 'UN System of National Accounts 2008 manual: Gross Value Added (GVA) is calculated at basic prices. FISIM (Financial Intermediation Services Indirectly Measured) must be allocated across intermediate consumption and final consumption. Gross Fixed Capital Formation (GFCF) includes cultivated biological resources and intellectual property products.',
    plfs: 'Periodic Labour Force Survey (PLFS) sampling strategy: In urban areas, a rotational panel scheme with 25% replacement per quarter is used. Key labour force metrics include Usual Principal Status (UPS), Current Weekly Status (CWS), and Labour Force Participation Rate (LFPR).',
    cpi: 'Consumer Price Index (CPI) revision guidelines: At the elementary aggregate level, geometric mean of price relatives (Jevons formula) is standard. Laspeyres weighting index is used for higher-level commodity baskets.'
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // Read text content
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerate = async () => {
    if (!docText.trim() && !domain) return;
    setLoading(true);
    try {
      const quiz = await generateQuizAPI({
        employee_id: employeeId || 1,
        domain,
        document_text: docText,
        num_questions: Number(numQuestions)
      });
      if (onQuizGenerated) {
        onQuizGenerated(quiz);
      }
    } catch (e) {
      console.error('Document quiz generation error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-card rounded-3xl border border-slate-200 shadow-2xl p-6 relative overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">AI Document-to-Quiz Generator</h3>
              <p className="text-xs text-slate-400">
                Upload guidelines, survey manuals, or statistical text to generate instant MCQs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 py-4 text-xs">
          
          {/* File Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-secondary/40 transition-colors bg-slate-50">
            <input
              type="file"
              id="file-upload"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
              <FileText className="w-7 h-7 mx-auto text-secondary" />
              <p className="text-slate-600 font-semibold">
                {fileName ? fileName : 'Click to select Statistical Manual / Text file'}
              </p>
              <p className="text-[11px] text-slate-500">Supports .TXT, .PDF guidelines or copy-paste below</p>
            </label>
          </div>

          {/* Text Area */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-slate-600">Statistical Guideline / Excerpt Text:</span>
              <div className="flex items-center space-x-2">
                <span className="text-[10px]">Load Sample:</span>
                <button 
                  onClick={() => { setDocText(sampleTexts.sna); setDomain('National Accounts'); }}
                  className="text-secondary hover:underline"
                >
                  SNA 2008
                </button>
                <span>·</span>
                <button 
                  onClick={() => { setDocText(sampleTexts.plfs); setDomain('Survey Methodology'); }}
                  className="text-secondary hover:underline"
                >
                  PLFS Survey
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Paste statistical policy extract, formula, or SOP rules here..."
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-slate-700 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-600 font-semibold text-[11px]">Primary Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/40"
              >
                <option value="National Accounts">National Accounts</option>
                <option value="Price Statistics">Price Statistics</option>
                <option value="Survey Methodology">Survey Methodology</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Governance & Quality">Governance & Quality</option>
                <option value="SDGs & Indicators">SDGs & Indicators</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-semibold text-[11px]">Questions Count</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/40"
              >
                <option value="3">3 Quick Questions (3 mins)</option>
                <option value="5">5 Questions Standard (5 mins)</option>
                <option value="10">10 Questions In-Depth (10 mins)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-emerald-600 font-mono flex items-center gap-1">
            <Cpu className="w-3 h-3" /> LLM Parser Ready
          </span>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 rounded-xl btn-primary text-white text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-secondary/20"
            >
              {loading ? 'Generating MCQs...' : 'Generate & Start Quiz'}
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
