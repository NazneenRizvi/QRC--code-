import React from 'react';
import { HistoryItem } from '../types';
import { 
  History, 
  Trash2, 
  RotateCcw, 
  Globe, 
  AlignLeft, 
  Wifi, 
  Contact, 
  Phone, 
  Mail, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const TYPE_ICONS = {
  url: Globe,
  text: AlignLeft,
  wifi: Wifi,
  contact: Contact,
  phone: Phone,
  email: Mail,
  sms: MessageSquare,
};

export default function HistoryList({
  history,
  onRestore,
  onDelete,
  onClearAll
}: HistoryListProps) {
  
  if (history.length === 0) {
    return (
      <div id="history-empty" className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-2">
        <div className="flex justify-center">
          <History className="w-8 h-8 text-white/50 stroke-[1.5]" />
        </div>
        <div className="text-xs font-semibold text-indigo-100">No Generation History</div>
        <p className="text-[10px] text-white/60 max-w-[200px] mx-auto leading-normal">
          Any successful QR codes you generate will be saved here in your browser cache.
        </p>
      </div>
    );
  }

  return (
    <div id="history-container" className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <h3 className="text-sm font-semibold text-indigo-100 flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-200" />
          Recent Generations
        </h3>
        <button
          id="btn-clear-history-all"
          onClick={onClearAll}
          className="text-[11px] font-semibold text-rose-300 hover:text-rose-200 hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div id="history-items-list" className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {history.map((item) => {
          const IconComponent = TYPE_ICONS[item.type] || AlignLeft;
          const formattedTime = new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });

          return (
            <div
              key={item.id}
              id={`history-item-${item.id}`}
              className="group flex items-center justify-between p-2.5 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Icon with colored background */}
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                  style={{ 
                    backgroundColor: item.options.fgColor + '25', // Higher opacity for glass readability
                    color: item.options.fgColor 
                  }}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate max-w-[150px] sm:max-w-[180px]">
                    {item.label}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/60 font-medium">
                    <span className="capitalize">{item.type === 'url' ? 'Link' : item.type}</span>
                    <span>•</span>
                    <span>{formattedTime}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                <button
                  id={`btn-restore-${item.id}`}
                  onClick={() => onRestore(item)}
                  title="Restore configuration"
                  className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`btn-delete-${item.id}`}
                  onClick={() => onDelete(item.id)}
                  title="Remove"
                  className="p-1.5 rounded-lg text-rose-300 hover:text-rose-200 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-indigo-100 bg-white/5 border border-white/10 rounded-lg p-2.5 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse shrink-0" />
        <span>Saving {history.length} item{history.length > 1 ? 's' : ''} directly to your local device.</span>
      </div>
    </div>
  );
}
