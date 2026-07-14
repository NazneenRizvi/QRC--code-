import React from 'react';
import { QRType, WifiEncryption } from '../types';
import { 
  Globe, 
  AlignLeft, 
  Wifi, 
  Contact, 
  Phone, 
  Mail, 
  MessageSquare 
} from 'lucide-react';

interface TabInputsProps {
  activeTab: QRType;
  setActiveTab: (tab: QRType) => void;
  formData: Record<QRType, any>;
  onFormChange: (tab: QRType, data: any) => void;
  errors: Record<string, string>;
}

export default function TabInputs({
  activeTab,
  setActiveTab,
  formData,
  onFormChange,
  errors
}: TabInputsProps) {
  
  const tabs = [
    { id: 'url' as QRType, label: 'Website URL', icon: Globe },
    { id: 'text' as QRType, label: 'Plain Text', icon: AlignLeft },
    { id: 'wifi' as QRType, label: 'WiFi Network', icon: Wifi },
    { id: 'contact' as QRType, label: 'vCard Contact', icon: Contact },
    { id: 'phone' as QRType, label: 'Phone Call', icon: Phone },
    { id: 'email' as QRType, label: 'Email Draft', icon: Mail },
    { id: 'sms' as QRType, label: 'SMS Message', icon: MessageSquare },
  ];

  const handleFieldChange = (field: string, value: any) => {
    onFormChange(activeTab, {
      ...formData[activeTab],
      [field]: value
    });
  };

  const inputClass = (fieldName: string) => `
    w-full px-4 py-2.5 rounded-xl border bg-white/10 text-white placeholder-white/40
    transition-all duration-200 outline-none
    ${errors[fieldName] 
      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100/20' 
      : 'border-white/20 focus:border-white/50 focus:bg-white/15 focus:ring-4 focus:ring-white/10'
    }
  `;

  const labelClass = "block text-sm font-semibold text-indigo-100 mb-1.5";

  return (
    <div id="tab-inputs-container" className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none gap-1.5 scroll-smooth md:flex-wrap md:overflow-visible">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0
                ${isActive 
                  ? 'bg-white text-indigo-950 border border-white/50 shadow-md shadow-white/10' 
                  : 'bg-white/10 text-white/80 border border-white/10 hover:bg-white/20 hover:text-white'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Inputs Section */}
      <div id="form-fields-wrapper" className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm backdrop-blur-md">
        
        {/* URL Form */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="url-input" className={labelClass}>Website Link</label>
              <input
                id="url-input"
                type="text"
                placeholder="https://example.com"
                value={formData.url.url || ''}
                onChange={(e) => handleFieldChange('url', e.target.value)}
                className={inputClass('url')}
              />
              {errors.url && <p className="text-xs text-red-400 mt-1.5">{errors.url}</p>}
              <p className="text-xs text-white/60 mt-1.5">
                Include the protocol (e.g. <code>https://</code>) or let us prepend it automatically.
              </p>
            </div>
          </div>
        )}

        {/* Text Form */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="text-input" className={labelClass}>Raw Text Content</label>
              <textarea
                id="text-input"
                rows={4}
                placeholder="Enter simple notes, serial codes, bitcoin addresses, or messages..."
                value={formData.text.text || ''}
                onChange={(e) => handleFieldChange('text', e.target.value)}
                className={inputClass('text')}
              />
              {errors.text && <p className="text-xs text-red-400 mt-1.5">{errors.text}</p>}
              <div className="flex justify-between items-center mt-1 text-xs text-white/50">
                <span>Supports multiple lines</span>
                <span>{(formData.text.text || '').length} characters</span>
              </div>
            </div>
          </div>
        )}

        {/* WiFi Form */}
        {activeTab === 'wifi' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wifi-ssid" className={labelClass}>Network Name (SSID)</label>
                <input
                  id="wifi-ssid"
                  type="text"
                  placeholder="e.g. MyHomeNetwork"
                  value={formData.wifi.ssid || ''}
                  onChange={(e) => handleFieldChange('ssid', e.target.value)}
                  className={inputClass('ssid')}
                />
                {errors.ssid && <p className="text-xs text-red-400 mt-1.5">{errors.ssid}</p>}
              </div>

              <div>
                <label htmlFor="wifi-enc" className={labelClass}>Security Mode</label>
                <select
                  id="wifi-enc"
                  value={formData.wifi.encryption || 'WPA'}
                  onChange={(e) => handleFieldChange('encryption', e.target.value as WifiEncryption)}
                  className={`${inputClass('encryption')} [&>option]:bg-indigo-900 [&>option]:text-white`}
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="nopass">Unsecured (No Password)</option>
                </select>
              </div>
            </div>

            {formData.wifi.encryption !== 'nopass' && (
              <div>
                <label htmlFor="wifi-pass" className={labelClass}>Network Password</label>
                <input
                  id="wifi-pass"
                  type="password"
                  placeholder="Enter WiFi password"
                  value={formData.wifi.password || ''}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  className={inputClass('password')}
                />
                {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                id="wifi-hidden"
                type="checkbox"
                checked={formData.wifi.hidden || false}
                onChange={(e) => handleFieldChange('hidden', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-white/20 bg-white/10 rounded focus:ring-offset-0 focus:ring-indigo-500"
              />
              <label htmlFor="wifi-hidden" className="text-sm text-white/80 select-none cursor-pointer">
                Hidden Network SSID
              </label>
            </div>
          </div>
        )}

        {/* Contact/vCard Form */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-fn" className={labelClass}>First Name</label>
                <input
                  id="contact-fn"
                  type="text"
                  placeholder="John"
                  value={formData.contact.firstName || ''}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  className={inputClass('firstName')}
                />
                {errors.contactName && <p className="text-xs text-red-400 mt-1.5">{errors.contactName}</p>}
              </div>
              <div>
                <label htmlFor="contact-ln" className={labelClass}>Last Name</label>
                <input
                  id="contact-ln"
                  type="text"
                  placeholder="Doe"
                  value={formData.contact.lastName || ''}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  className={inputClass('lastName')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-phone" className={labelClass}>Mobile Phone</label>
                <input
                  id="contact-phone"
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  value={formData.contact.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className={inputClass('contactPhone')}
                />
                {errors.contactPhone && <p className="text-xs text-red-400 mt-1.5">{errors.contactPhone}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className={labelClass}>Email Address</label>
                <input
                  id="contact-email"
                  type="text"
                  placeholder="john.doe@example.com"
                  value={formData.contact.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className={inputClass('contactEmail')}
                />
                {errors.contactEmail && <p className="text-xs text-red-400 mt-1.5">{errors.contactEmail}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-org" className={labelClass}>Company / Organization</label>
                <input
                  id="contact-org"
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={formData.contact.organization || ''}
                  onChange={(e) => handleFieldChange('organization', e.target.value)}
                  className={inputClass('organization')}
                />
              </div>
              <div>
                <label htmlFor="contact-web" className={labelClass}>Website URL</label>
                <input
                  id="contact-web"
                  type="text"
                  placeholder="https://acme.org"
                  value={formData.contact.website || ''}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  className={inputClass('contactWebsite')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-adr" className={labelClass}>Physical Address</label>
              <input
                id="contact-adr"
                type="text"
                placeholder="123 Main St, San Francisco, CA 94105"
                value={formData.contact.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className={inputClass('address')}
              />
            </div>
          </div>
        )}

        {/* Phone Form */}
        {activeTab === 'phone' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="phone-input" className={labelClass}>Phone Number</label>
              <input
                id="phone-input"
                type="tel"
                placeholder="e.g. +1 (555) 019-2834"
                value={formData.phone.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className={inputClass('phone')}
              />
              {errors.phone && <p className="text-xs text-red-400 mt-1.5">{errors.phone}</p>}
              <p className="text-xs text-white/60 mt-1.5">
                Scanning this QR code prompts devices to immediately dial this phone number.
              </p>
            </div>
          </div>
        )}

        {/* Email Form */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="email-to" className={labelClass}>Recipient Email</label>
              <input
                id="email-to"
                type="email"
                placeholder="recipient@example.com"
                value={formData.email.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className={inputClass('email')}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="email-sub" className={labelClass}>Subject Line <span className="text-white/40 font-normal">(Optional)</span></label>
              <input
                id="email-sub"
                type="text"
                placeholder="Inquiry about QR Code Generator"
                value={formData.email.subject || ''}
                onChange={(e) => handleFieldChange('subject', e.target.value)}
                className={inputClass('subject')}
              />
            </div>

            <div>
              <label htmlFor="email-body" className={labelClass}>Pre-written Body <span className="text-white/40 font-normal">(Optional)</span></label>
              <textarea
                id="email-body"
                rows={3}
                placeholder="Hi, I would like to..."
                value={formData.email.body || ''}
                onChange={(e) => handleFieldChange('body', e.target.value)}
                className={inputClass('body')}
              />
            </div>
          </div>
        )}

        {/* SMS Form */}
        {activeTab === 'sms' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="sms-phone" className={labelClass}>Receiver Phone Number</label>
              <input
                id="sms-phone"
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={formData.sms.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className={inputClass('smsPhone')}
              />
              {errors.smsPhone && <p className="text-xs text-red-400 mt-1.5">{errors.smsPhone}</p>}
            </div>

            <div>
              <label htmlFor="sms-msg" className={labelClass}>Default Message Text</label>
              <textarea
                id="sms-msg"
                rows={3}
                placeholder="Hello! Send this custom message..."
                value={formData.sms.message || ''}
                onChange={(e) => handleFieldChange('message', e.target.value)}
                className={inputClass('smsMessage')}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
