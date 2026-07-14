import React, { useRef, useState } from 'react';
import { QRStyleOptions, ColorPreset } from '../types';
import { Upload, X, Sliders, Palette, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface StyleCustomizerProps {
  options: QRStyleOptions;
  setOptions: (options: QRStyleOptions | ((prev: QRStyleOptions) => QRStyleOptions)) => void;
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Classic Dark', fg: '#000000', bg: '#FFFFFF' },
  { name: 'Sleek Indigo', fg: '#4f46e5', bg: '#ffffff' },
  { name: 'Emerald Forest', fg: '#047857', bg: '#f0fdf4' },
  { name: 'Cosmic Royal', fg: '#6d28d9', bg: '#faf5ff' },
  { name: 'Ocean Depth', fg: '#1d4ed8', bg: '#eff6ff' },
  { name: 'Crimson Rose', fg: '#be123c', bg: '#fff1f2' },
  { name: 'Modern Charcoal', fg: '#1f2937', bg: '#f9fafb' },
  { name: 'Bronze Gold', fg: '#b45309', bg: '#fef3c7' },
];

export default function StyleCustomizer({
  options,
  setOptions
}: StyleCustomizerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePresetSelect = (preset: ColorPreset) => {
    setOptions(prev => ({
      ...prev,
      fgColor: preset.fg,
      bgColor: preset.bg
    }));
  };

  const handleLogoSelect = (logoType: QRStyleOptions['logo']) => {
    setOptions(prev => {
      // If adding a logo, automatically set error correction to high ('H') or 'Q' to protect readability!
      const correction = logoType !== 'none' ? 'H' : prev.errorCorrectionLevel;
      return {
        ...prev,
        logo: logoType,
        errorCorrectionLevel: correction
      };
    });
  };

  // Drag and drop logo handlers
  const processLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }
    
    // Limit file size to 2MB for browser memory
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const resultUrl = e.target.result;
        setOptions(prev => ({
          ...prev,
          logo: 'custom',
          customLogoUrl: resultUrl,
          errorCorrectionLevel: 'H' // High correction is critical for custom logos
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processLogoFile(e.target.files[0]);
    }
  };

  const removeCustomLogo = () => {
    setOptions(prev => ({
      ...prev,
      logo: 'none',
      customLogoUrl: undefined
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const logoPresets: { id: QRStyleOptions['logo']; label: string }[] = [
    { id: 'none', label: 'None' },
    { id: 'link', label: 'Globe/Link' },
    { id: 'mail', label: 'Email' },
    { id: 'wifi', label: 'WiFi' },
    { id: 'phone', label: 'Phone' },
    { id: 'star', label: 'Star' },
    { id: 'heart', label: 'Heart' },
  ];

  return (
    <div id="style-customizer-container" className="space-y-6">
      
      {/* SECTION 1: PRESET PALETTES */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-indigo-100 flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-200" />
          Color Style Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = options.fgColor.toLowerCase() === preset.fg.toLowerCase() && 
                               options.bgColor.toLowerCase() === preset.bg.toLowerCase();
            return (
              <button
                key={preset.name}
                id={`preset-color-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handlePresetSelect(preset)}
                className={`
                  flex items-center gap-2 p-2 rounded-xl text-left border text-xs font-medium transition-all duration-200 cursor-pointer
                  ${isSelected 
                    ? 'border-white/50 ring-2 ring-white/10 bg-white/25' 
                    : 'border-white/10 bg-white/5 text-white/90 hover:border-white/25 hover:bg-white/10'
                  }
                `}
              >
                <div className="flex -space-x-1 border border-white/15 rounded p-0.5 bg-white shrink-0">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.fg }} />
                  <div className="w-4 h-4 rounded border border-gray-200" style={{ backgroundColor: preset.bg }} />
                </div>
                <span className="truncate text-white/90">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* SECTION 2: CUSTOM COLORS */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-200" />
            Custom Coloring
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* FG Color */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
              <label htmlFor="picker-fg" className="block text-xs font-semibold text-indigo-200 mb-1.5">Foreground Color</label>
              <div className="flex items-center gap-2">
                <input
                  id="picker-fg"
                  type="color"
                  value={options.fgColor}
                  onChange={(e) => setOptions(prev => ({ ...prev, fgColor: e.target.value }))}
                  className="w-10 h-10 border border-white/20 rounded-lg cursor-pointer bg-transparent"
                />
                <input
                  id="input-hex-fg"
                  type="text"
                  value={options.fgColor.toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.startsWith('#') && val.length <= 7) {
                      setOptions(prev => ({ ...prev, fgColor: val }));
                    }
                  }}
                  className="w-full text-xs font-mono uppercase bg-transparent border-0 border-b border-white/20 focus:border-white focus:ring-0 py-1 text-white"
                />
              </div>
            </div>

            {/* BG Color */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
              <label htmlFor="picker-bg" className="block text-xs font-semibold text-indigo-200 mb-1.5">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  id="picker-bg"
                  type="color"
                  value={options.bgColor}
                  onChange={(e) => setOptions(prev => ({ ...prev, bgColor: e.target.value }))}
                  className="w-10 h-10 border border-white/20 rounded-lg cursor-pointer bg-transparent"
                />
                <input
                  id="input-hex-bg"
                  type="text"
                  value={options.bgColor.toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.startsWith('#') && val.length <= 7) {
                      setOptions(prev => ({ ...prev, bgColor: val }));
                    }
                  }}
                  className="w-full text-xs font-mono uppercase bg-transparent border-0 border-b border-white/20 focus:border-white focus:ring-0 py-1 text-white"
                />
              </div>
            </div>
          </div>

          {/* SIZES & QUIET ZONE */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="range-size" className="text-xs font-semibold text-indigo-100">QR Code Render Size</label>
                <span className="text-[10px] font-mono text-white/90 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">{options.size} × {options.size} px</span>
              </div>
              <input
                id="range-size"
                type="range"
                min="128"
                max="512"
                step="32"
                value={options.size}
                onChange={(e) => setOptions(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                className="w-full accent-white h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="range-margin" className="text-xs font-semibold text-indigo-100">Margin Padding</label>
                <span className="text-[10px] font-mono text-white/90 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">{options.margin} blocks</span>
              </div>
              <input
                id="range-margin"
                type="range"
                min="0"
                max="6"
                step="1"
                value={options.margin}
                onChange={(e) => setOptions(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                className="w-full accent-white h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: ERROR CORRECTION & LOGO LOGIC */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-200" />
            Reliability & Error Correction
          </h3>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex gap-2">
              {(['L', 'M', 'Q', 'H'] as const).map((lvl) => {
                const label = lvl === 'L' ? 'Low (7%)' : 
                              lvl === 'M' ? 'Medium (15%)' : 
                              lvl === 'Q' ? 'Quartile (25%)' : 'High (30%)';
                const isSelected = options.errorCorrectionLevel === lvl;
                return (
                  <button
                    key={lvl}
                    id={`err-corr-btn-${lvl.toLowerCase()}`}
                    onClick={() => setOptions(prev => ({ ...prev, errorCorrectionLevel: lvl }))}
                    className={`
                      flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer
                      ${isSelected 
                        ? 'bg-white text-indigo-950 border-white shadow-md' 
                        : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
                      }
                    `}
                  >
                    <div className="font-bold text-[9px] uppercase opacity-75">{lvl}</div>
                    <div>{label.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-white/60 mt-2">
              Higher error correction rates make the QR code heavier but highly resilient to dirt, scanning angle distortion, or <strong>central brand logo overlays</strong>.
            </p>
          </div>

          {/* BRAND LOGO OVERLAYS */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-200" />
              Brand Logo Overlay
            </h4>

            {/* Logo Selection chips */}
            <div className="flex flex-wrap gap-1.5">
              {logoPresets.map((preset) => {
                const isSelected = options.logo === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`logo-preset-${preset.id}`}
                    onClick={() => handleLogoSelect(preset.id)}
                    className={`
                      px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer
                      ${isSelected 
                        ? 'bg-white border-white/40 text-indigo-950 font-bold' 
                        : 'bg-white/10 border-white/10 text-white/80 hover:border-white/25 hover:text-white'
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom File Upload drop area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200
                ${options.logo === 'custom' && options.customLogoUrl
                  ? 'border-indigo-400 bg-white/10'
                  : isDragging
                    ? 'border-indigo-300 bg-white/15'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {options.logo === 'custom' && options.customLogoUrl ? (
                <div className="flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 border border-white/20 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden shrink-0">
                      <img src={options.customLogoUrl} alt="Custom logo preview" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Custom Logo Loaded</div>
                      <div className="text-[10px] text-white/60">Auto-configured error buffer</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomLogo();
                    }}
                    className="p-1 rounded-full hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5 flex flex-col items-center justify-center text-white/70">
                  <Upload className="w-5 h-5 text-indigo-200" />
                  <div className="text-xs font-semibold">
                    Drag logo here or <span className="text-white underline">browse files</span>
                  </div>
                  <div className="text-[10px] text-white/50">Supports PNG, JPG, SVG (Max 2MB)</div>
                </div>
              )}
            </div>

            {/* Logo Scale slider if logo is loaded */}
            {options.logo !== 'none' && (
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-indigo-100">Logo Overlay Scale</span>
                  <span className="font-mono text-white/90 bg-white/15 px-1.5 py-0.5 rounded">{Math.round(options.logoScale * 100)}%</span>
                </div>
                <input
                  id="range-logo-scale"
                  type="range"
                  min="0.10"
                  max="0.25"
                  step="0.01"
                  value={options.logoScale}
                  onChange={(e) => setOptions(prev => ({ ...prev, logoScale: parseFloat(e.target.value) }))}
                  className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
