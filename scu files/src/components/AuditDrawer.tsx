import React, { useState } from 'react';
import { ScoutStructuredData, StrategistOutput } from '../types/fintech';
import { Copy, Check, Code, FileText, X, ShieldCheck } from 'lucide-react';

interface AuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scoutData: ScoutStructuredData;
  strategistData: StrategistOutput;
}

export const AuditDrawer: React.FC<AuditDrawerProps> = ({
  isOpen,
  onClose,
  scoutData,
  strategistData,
}) => {
  const [activeTab, setActiveTab] = useState<'scout_json' | 'strategist_json' | 'ascii_table'>('scout_json');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getContentToCopy = () => {
    if (activeTab === 'scout_json') return JSON.stringify(scoutData, null, 2);
    if (activeTab === 'strategist_json') return JSON.stringify(strategistData, null, 2);
    return strategistData.ascii_comparison_table;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#002D72]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#D5E3EC] rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#002D72] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Code className="w-4 h-4 text-[#48C2E8]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif">
                System Audit & Regulatory Data Payloads
              </h3>
              <p className="text-xs text-blue-200">
                Tokenized member records, optimization schemas, and compliance outputs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls & Copy Action */}
        <div className="p-3 bg-[#F4F8FA] border-b border-[#D5E3EC] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('scout_json')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'scout_json'
                  ? 'bg-[#002D72] text-white shadow-xs'
                  : 'text-[#002D72] hover:bg-[#EAF2F7]'
              }`}
            >
              Step 1: [SCOUT] JSON
            </button>
            <button
              onClick={() => setActiveTab('strategist_json')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'strategist_json'
                  ? 'bg-[#002D72] text-white shadow-xs'
                  : 'text-[#002D72] hover:bg-[#EAF2F7]'
              }`}
            >
              Step 2: [STRATEGIST] JSON
            </button>
            <button
              onClick={() => setActiveTab('ascii_table')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'ascii_table'
                  ? 'bg-[#002D72] text-white shadow-xs'
                  : 'text-[#002D72] hover:bg-[#EAF2F7]'
              }`}
            >
              Step 3: ASCII Table
            </button>
          </div>

          <button
            onClick={() => handleCopy(getContentToCopy())}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#002D72] bg-white border border-[#B6CDDD] rounded-lg hover:bg-[#F4F8FA] transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#0082CA]" />}
            <span>{copied ? 'Copied' : 'Copy Payload'}</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#061524]">
          {activeTab === 'scout_json' && (
            <pre className="text-xs font-mono text-[#48C2E8] leading-relaxed select-all">
              {JSON.stringify(scoutData, null, 2)}
            </pre>
          )}

          {activeTab === 'strategist_json' && (
            <pre className="text-xs font-mono text-[#94D2BD] leading-relaxed select-all">
              {JSON.stringify(strategistData, null, 2)}
            </pre>
          )}

          {activeTab === 'ascii_table' && (
            <pre className="text-xs font-mono text-amber-300 leading-relaxed select-all">
              {strategistData.ascii_comparison_table}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F4F8FA] border-t border-[#D5E3EC] text-[11px] text-[#6A7E8F] flex items-center justify-between">
          <span>PII Masking & Tokenization Enforced · NCUA Safe Harbor Compliant</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#002D72] bg-white border border-[#B6CDDD] rounded-lg hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
