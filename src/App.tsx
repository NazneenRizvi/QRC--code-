import React, { useState, useEffect } from 'react';
import { QRType, QRStyleOptions, HistoryItem } from './types';
import TabInputs from './components/TabInputs';
import StyleCustomizer from './components/StyleCustomizer';
import QRPreview from './components/QRPreview';
import HistoryList from './components/HistoryList';
import { 
  formatQRContent, 
  validateUrl, 
  validateEmail, 
  validatePhone 
} from './utils/qrHelper';
import { 
  QrCode, 
  Sparkles, 
  Wand2, 
  Info, 
  Trash2, 
  Palette 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_FORM_DATA = {
  url: { url: '' },
  text: { text: '' },
  wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
  contact: { firstName: '', lastName: '', phone: '', email: '', organization: '', website: '', address: '' },
  phone: { phone: '' },
  email: { email: '', subject: '', body: '' },
  sms: { phone: '', message: '' }
};

const DEFAULT_STYLE_OPTIONS: QRStyleOptions = {
  size: 320,
  fgColor: '#1F2937', // Charcoal gray
  bgColor: '#FFFFFF', // Clean white
  errorCorrectionLevel: 'M',
  margin: 3,
  logo: 'none',
  logoScale: 0.18,
  roundedPoints: false
};

export default function App() {
  const [activeTab, setActiveTab] = useState<QRType>('url');
  const [formData, setFormData] = useState<Record<QRType, any>>(INITIAL_FORM_DATA);
  const [styleOptions, setStyleOptions] = useState<QRStyleOptions>(DEFAULT_STYLE_OPTIONS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // This state holds the generated parameters for the preview canvas
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [generatedOptions, setGeneratedOptions] = useState<QRStyleOptions>(DEFAULT_STYLE_OPTIONS);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('qr_generator_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
  }, []);

  // Sync tab change or style updates
  const handleFormChange = (tab: QRType, data: any) => {
    setFormData(prev => ({
      ...prev,
      [tab]: data
    }));
    // Clear field-specific validation errors on change
    setErrors(prev => {
      const copy = { ...prev };
      if (tab === 'url') delete copy.url;
      if (tab === 'text') delete copy.text;
      if (tab === 'wifi') {
        delete copy.ssid;
        delete copy.password;
      }
      if (tab === 'contact') {
        delete copy.contactName;
        delete copy.contactPhone;
        delete copy.contactEmail;
        delete copy.contactWebsite;
      }
      if (tab === 'phone') delete copy.phone;
      if (tab === 'email') delete copy.email;
      if (tab === 'sms') delete copy.smsPhone;
      return copy;
    });
  };

  const validateForm = (): boolean => {
    const currentData = formData[activeTab];
    const newErrors: Record<string, string> = {};

    if (activeTab === 'url') {
      if (!currentData.url || !currentData.url.trim()) {
        newErrors.url = 'Website URL is required';
      } else if (!validateUrl(currentData.url)) {
        newErrors.url = 'Please enter a valid domain or URL (e.g. google.com or https://example.com)';
      }
    } else if (activeTab === 'text') {
      if (!currentData.text || !currentData.text.trim()) {
        newErrors.text = 'Please enter some text content to encode';
      }
    } else if (activeTab === 'wifi') {
      if (!currentData.ssid || !currentData.ssid.trim()) {
        newErrors.ssid = 'WiFi SSID / Network Name is required';
      }
      if (currentData.encryption !== 'nopass' && (!currentData.password || !currentData.password.trim())) {
        newErrors.password = 'WiFi Password is required for encrypted networks';
      }
    } else if (activeTab === 'contact') {
      if (!currentData.firstName?.trim() && !currentData.lastName?.trim()) {
        newErrors.contactName = 'At least First Name or Last Name is required';
      }
      if (currentData.phone && !validatePhone(currentData.phone)) {
        newErrors.contactPhone = 'Please enter a valid phone number';
      }
      if (currentData.email && !validateEmail(currentData.email)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }
      if (currentData.website && !validateUrl(currentData.website)) {
        newErrors.contactWebsite = 'Please enter a valid website link';
      }
    } else if (activeTab === 'phone') {
      if (!currentData.phone || !currentData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(currentData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    } else if (activeTab === 'email') {
      if (!currentData.email || !currentData.email.trim()) {
        newErrors.email = 'Recipient email address is required';
      } else if (!validateEmail(currentData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else if (activeTab === 'sms') {
      if (!currentData.phone || !currentData.phone.trim()) {
        newErrors.smsPhone = 'Receiver phone number is required';
      } else if (!validatePhone(currentData.phone)) {
        newErrors.smsPhone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validateForm()) {
      triggerToast('Please resolve the form errors before generating');
      return;
    }

    setIsLoading(true);
    
    // Simulate minor visual rendering delay for professional feedback
    setTimeout(() => {
      const activeData = formData[activeTab];
      const rawString = formatQRContent(activeTab, activeData);

      setGeneratedContent(rawString);
      setGeneratedOptions({ ...styleOptions });

      // Determine label for recent history
      let label = '';
      switch (activeTab) {
        case 'url':
          label = activeData.url.trim();
          break;
        case 'text':
          label = activeData.text.trim().substring(0, 30) + (activeData.text.length > 30 ? '...' : '');
          break;
        case 'wifi':
          label = `WiFi: ${activeData.ssid}`;
          break;
        case 'contact':
          label = `Contact: ${activeData.firstName} ${activeData.lastName}`.trim() || 'vCard Contact';
          break;
        case 'phone':
          label = `Dial: ${activeData.phone}`;
          break;
        case 'email':
          label = `Email to: ${activeData.email}`;
          break;
        case 'sms':
          label = `SMS to: ${activeData.phone}`;
          break;
      }

      // Add to history list, removing older duplicates
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: activeTab,
        label,
        rawContent: rawString,
        payload: activeData,
        timestamp: Date.now(),
        options: { ...styleOptions }
      };

      const updated = [
        newHistoryItem,
        ...history.filter(item => item.rawContent !== rawString)
      ].slice(0, 10); // Keep max 10 records

      setHistory(updated);
      localStorage.setItem('qr_generator_history', JSON.stringify(updated));
      
      setIsLoading(false);
      triggerToast('QR Code generated successfully!');
    }, 400);
  };

  const handleClear = () => {
    // Reset active tab's form inputs
    setFormData(prev => ({
      ...prev,
      [activeTab]: { ...INITIAL_FORM_DATA[activeTab] }
    }));
    setErrors({});
    setGeneratedContent('');
    triggerToast('Inputs cleared');
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setActiveTab(item.type);
    
    // Restore exact inputs
    setFormData(prev => ({
      ...prev,
      [item.type]: { ...item.payload }
    }));

    // Restore design options
    setStyleOptions({
      size: item.options.size ?? DEFAULT_STYLE_OPTIONS.size,
      fgColor: item.options.fgColor,
      bgColor: item.options.bgColor,
      errorCorrectionLevel: item.options.errorCorrectionLevel ?? DEFAULT_STYLE_OPTIONS.errorCorrectionLevel,
      margin: item.options.margin ?? DEFAULT_STYLE_OPTIONS.margin,
      logo: item.options.logo ?? DEFAULT_STYLE_OPTIONS.logo,
      customLogoUrl: item.options.customLogoUrl,
      logoScale: item.options.logoScale ?? DEFAULT_STYLE_OPTIONS.logoScale,
      roundedPoints: item.options.roundedPoints ?? DEFAULT_STYLE_OPTIONS.roundedPoints
    });

    // Make immediate code render
    setGeneratedContent(item.rawContent);
    setGeneratedOptions({
      ...DEFAULT_STYLE_OPTIONS,
      ...item.options
    });
    setErrors({});
    triggerToast(`Restored: ${item.label}`);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('qr_generator_history', JSON.stringify(updated));
    triggerToast('History item removed');
  };

  const handleClearHistoryAll = () => {
    if (confirm('Are you sure you want to delete your entire QR history?')) {
      setHistory([]);
      localStorage.removeItem('qr_generator_history');
      triggerToast('All history cleared');
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(prev => prev === msg ? null : prev);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-rose-400 text-white flex flex-col font-sans p-4 sm:p-6 md:p-10 selection:bg-indigo-200 selection:text-indigo-900 justify-center items-center">
      
      {/* Dynamic Toast System */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/20 backdrop-blur-xl text-white px-5 py-3 rounded-2xl text-xs font-semibold shadow-xl border border-white/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glassmorphic Container Box */}
      <div className="w-full max-w-6xl bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/30 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <header className="px-6 md:px-10 py-6 border-b border-white/10 flex justify-between items-center bg-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <QrCode className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight text-white">
                QR<span className="text-indigo-200 font-light">Studio</span>
              </h1>
              <p className="text-[10px] text-white/60 font-medium">Professional QR Generator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-white/80 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full">
              <Info className="w-3.5 h-3.5 text-indigo-200" />
              100% Client-Side Compiler
            </span>
          </div>
        </header>

        {/* Hero Banner Title (Inside Glass Box for Cohesiveness) */}
        <div className="text-center pt-8 pb-4 px-6 md:px-10 max-w-3xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold font-display tracking-tight text-white sm:text-4xl">
            Create Custom <span className="text-indigo-200">QR Codes</span> Instantly
          </h2>
          <p className="text-sm text-white/75 max-w-lg mx-auto leading-relaxed">
            Generate beautifully styled, high-fidelity QR codes with custom colors, templates, and central brand logos for printing or sharing.
          </p>
        </div>

        {/* Main Grid Content Dashboard */}
        <main className="flex-1 px-6 md:px-10 pb-10 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (Inputs, Style customization, Controls) - 7 cols */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Input card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">
                    Step 1: Enter QR Content
                  </span>
                  <button
                    id="btn-clear-form"
                    onClick={handleClear}
                    className="text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    Clear Fields
                  </button>
                </div>

                <TabInputs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  formData={formData}
                  onFormChange={handleFormChange}
                  errors={errors}
                />
              </div>

              {/* Visual Styling Settings card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-sm space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">
                    Step 2: Customize Design & Styling
                  </span>
                </div>

                <StyleCustomizer
                  options={styleOptions}
                  setOptions={setStyleOptions}
                />
              </div>

              {/* GENERATE PRIMARY ACTION */}
              <button
                id="btn-generate-qr"
                onClick={handleGenerate}
                disabled={isLoading}
                className={`
                  w-full py-4 rounded-2xl bg-white text-indigo-700 font-bold text-base
                  shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 active:scale-[0.99] transition-all
                  flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50
                `}
              >
                <Wand2 className="w-5 h-5 text-indigo-600" />
                Generate QR Code
              </button>

            </div>

            {/* Right Column (Preview, Output, Actions, History) - 5 cols */}
            <div className="lg:col-span-5 lg:sticky lg:top-[92px] space-y-6">
              
              <QRPreview
                text={generatedContent}
                options={generatedOptions}
                onClear={() => {
                  setGeneratedContent('');
                  setGeneratedOptions(DEFAULT_STYLE_OPTIONS);
                }}
                isLoading={isLoading}
              />

              <HistoryList
                history={history}
                onRestore={handleRestoreHistory}
                onDelete={handleDeleteHistory}
                onClearAll={handleClearHistoryAll}
              />

            </div>

          </div>
        </main>

        {/* Footer info inside the glass block */}
        <footer className="px-6 md:px-10 py-5 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-white/45 text-xs text-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Powered by React • Vite • TypeScript</span>
          </div>
          <div className="font-medium">
            &copy; 2026 Developed by Nazneen Rizvi
          </div>
        </footer>

      </div>
    </div>
  );
}