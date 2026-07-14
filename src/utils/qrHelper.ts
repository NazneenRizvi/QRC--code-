import { WifiData, ContactData, EmailData, QRStyleOptions } from '../types';

/**
 * Validates a URL structure
 */
export function validateUrl(url: string): boolean {
  if (!url.trim()) return false;
  // Lenient URL validation
  const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?.*$/i;
  return regex.test(url);
}

/**
 * Validates an email structure
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validates a phone number
 */
export function validatePhone(phone: string): boolean {
  const regex = /^\+?[0-9\s\-()]{3,20}$/;
  return regex.test(phone.trim());
}

/**
 * Escape WiFi SSID/Password special characters
 */
function escapeWifiString(val: string): string {
  // Escapes backslashes, semicolons, commas, and double quotes
  return val.replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/:/g, '\\:')
            .replace(/"/g, '\\"');
}

/**
 * Formats data based on type into standard QR strings
 */
export function formatQRContent(type: string, data: any): string {
  switch (type) {
    case 'url': {
      let url = (data.url || '').trim();
      if (url && !/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    }
    case 'text':
      return data.text || '';
    case 'wifi': {
      const wifi = data as WifiData;
      const ssid = escapeWifiString(wifi.ssid || '');
      const password = wifi.encryption !== 'nopass' ? escapeWifiString(wifi.password || '') : '';
      const encryption = wifi.encryption;
      const hidden = wifi.hidden ? 'true' : '';
      return `WIFI:T:${encryption};S:${ssid};${password ? `P:${password};` : ''}${hidden ? `H:${hidden};` : ''};`;
    }
    case 'contact': {
      const c = data as ContactData;
      // Format standard vCard 3.0
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${c.lastName || ''};${c.firstName || ''};;;`,
        `FN:${c.firstName || ''} ${c.lastName || ''}`.trim(),
        c.organization ? `ORG:${c.organization}` : '',
        c.phone ? `TEL;TYPE=CELL:${c.phone}` : '',
        c.email ? `EMAIL;TYPE=PREF,INTERNET:${c.email}` : '',
        c.website ? `URL:${c.website}` : '',
        c.address ? `ADR;TYPE=WORK:;;${c.address};;;;` : '',
        'END:VCARD'
      ].filter(Boolean).join('\n');
    }
    case 'phone':
      return `tel:${(data.phone || '').trim()}`;
    case 'email': {
      const e = data as EmailData;
      const to = e.email.trim();
      const subject = encodeURIComponent(e.subject || '');
      const body = encodeURIComponent(e.body || '');
      if (subject || body) {
        return `mailto:${to}?subject=${subject}&body=${body}`;
      }
      return `mailto:${to}`;
    }
    case 'sms':
      return `SMSTO:${(data.phone || '').trim()}:${data.message || ''}`;
    default:
      return '';
  }
}

// Inline SVGs for preset logos
export const LOGO_SVG_DATA = {
  link: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%COLOR%" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%COLOR%" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  wifi: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%COLOR%" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20" stroke-width="3"></line></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%COLOR%" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%COLOR%" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%COLOR%" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
};

/**
 * Helper to encode an SVG string with custom color for drawing on canvas
 */
export function getSvgLogoDataUrl(logoType: keyof typeof LOGO_SVG_DATA, color: string): string {
  const rawSvg = LOGO_SVG_DATA[logoType];
  if (!rawSvg) return '';
  const hexColor = encodeURIComponent(color);
  const styledSvg = rawSvg.replace(/%COLOR%/g, hexColor);
  return `data:image/svg+xml;utf8,${styledSvg}`;
}

/**
 * Draws custom features on the QR canvas, such as rounding points and drawing the center logo.
 * Note: standard qrcode canvas output is flat. Here we can overlay a custom styled logo.
 */
export function decorateQRCanvas(
  canvas: HTMLCanvasElement,
  options: QRStyleOptions
): Promise<void> {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve();
      return;
    }

    const { logo, customLogoUrl, fgColor, bgColor, logoScale } = options;
    if (logo === 'none') {
      resolve();
      return;
    }

    // Determine the image source
    let src = '';
    if (logo === 'custom' && customLogoUrl) {
      src = customLogoUrl;
    } else if (logo !== 'custom') {
      src = getSvgLogoDataUrl(logo as keyof typeof LOGO_SVG_DATA, fgColor);
    }

    if (!src) {
      resolve();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Calculate logo size based on scale
      const logoSize = width * logoScale;
      const x = (width - logoSize) / 2;
      const y = (height - logoSize) / 2;

      // Draw a rounded white background for the logo
      const padding = 6;
      const rectSize = logoSize + padding * 2;
      const rectX = x - padding;
      const rectY = y - padding;
      const radius = 8;

      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.moveTo(rectX + radius, rectY);
      ctx.lineTo(rectX + rectSize - radius, rectY);
      ctx.quadraticCurveTo(rectX + rectSize, rectY, rectX + rectSize, rectY + radius);
      ctx.lineTo(rectX + rectSize, rectY + rectSize - radius);
      ctx.quadraticCurveTo(rectX + rectSize, rectY + rectSize, rectX + rectSize - radius, rectY + rectSize);
      ctx.lineTo(rectX + radius, rectY + rectSize);
      ctx.quadraticCurveTo(rectX, rectY + rectSize, rectX, rectY + rectSize - radius);
      ctx.lineTo(rectX, rectY + radius);
      ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
      ctx.closePath();
      ctx.fill();

      // Add a subtle border matching fgColor
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = fgColor + '30'; // 30 is hex for ~18% opacity
      ctx.stroke();

      // Draw the logo inside
      ctx.drawImage(img, x, y, logoSize, logoSize);
      resolve();
    };

    img.onerror = () => {
      console.error('Error loading QR logo overlay');
      resolve();
    };

    img.src = src;
  });
}
