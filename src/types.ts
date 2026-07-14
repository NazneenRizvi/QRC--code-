export type QRType = 'url' | 'text' | 'wifi' | 'contact' | 'phone' | 'email' | 'sms';

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export interface WifiData {
  ssid: string;
  password?: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface ContactData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
  website: string;
  address: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneData {
  phone: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface QRStyleOptions {
  size: number;
  fgColor: string;
  bgColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  logo: 'none' | 'link' | 'mail' | 'wifi' | 'phone' | 'star' | 'heart' | 'custom';
  customLogoUrl?: string; // Data URL of uploaded logo
  logoScale: number; // Factor between 0.1 and 0.3
  roundedPoints: boolean; // Custom look: round the individual dark squares!
}

export interface HistoryItem {
  id: string;
  type: QRType;
  label: string; // Human-friendly label (e.g. SSID or domain)
  rawContent: string; // The formatted string that went into the QR code
  payload: any; // The raw form data payload for restoring
  timestamp: number;
  options: {
    fgColor: string;
    bgColor: string;
    size: number;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    margin: number;
    logo: 'none' | 'link' | 'mail' | 'wifi' | 'phone' | 'star' | 'heart' | 'custom';
    customLogoUrl?: string;
    logoScale: number;
    roundedPoints: boolean;
  };
}

export interface ColorPreset {
  name: string;
  fg: string;
  bg: string;
}
