const QR_CODE_API = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=';

const TIMEOUT_DURATION = 1500; // in milliseconds

const LABELS = {
  TITLE: 'WiFi QR Code Generator',
  DESCRIPTION: 'Generate a QR code for your Wi-Fi network to easily share access with others.',
  SSID: 'SSID (Network Name)',
  PLACEHOLDER_SSID: 'Enter your network SSID',
  PLACEHOLDER_PASSWORD: 'Enter your network password',
  PLACEHOLDER_AUTHENTICATION_TYPE: 'Select authentication type',
  PLACEHOLDER_HIDDEN: 'Is the network hidden?',
  PASSWORD: 'Password',
  AUTHENTICATION_TYPE: 'Authentication Type',
  GENERATE_BUTTON: 'Generate QR Code',
  DOWNLOAD_BUTTON: 'Download QR Code',
  PRINT_BUTTON: 'Print QR Code',
  QR_CODE: 'Your WiFi QR Code',
  FOOTER_TEXT: () => `© ${new Date().getFullYear()} Rusu Ionut. All rights reserved.`,
  QR_CODE_IMG_LABEL: 'Point your camera at the QR code to connect to the WiFi network',
  LOADING: 'Loading...',
  NO_ANIMATION: 'No Animation Data Found',
  INVALID_JSON: 'Invalid JSON Data',
  MISSING_DATA: 'No Animation Data Provided',
  QR_CODE_IMAGE_ALT_TEXT: 'WiFi QR Code Image',
  NO_IMAGE_AVAILABLE: 'No Image Available',
  SHARE_BUTTON: 'Share QR Code',
  SHARE_VIA_EMAIL: 'Share via Email',
  COPY_LINK: 'Copy Link',
  SHARE_VIA_WHATSAPP: 'Share via WhatsApp',
  SHARE_VIA_TWITTER: 'Share via Twitter',
  LINK_COPIED: 'Link copied to clipboard!',
};

const ENCRYPTION_TYPES = {
  wpa: 'WPA',
  wep: 'WEP',
  nopass: 'nopass',
};

const ROUTER_LINKS = [
  { path: '/', name: 'Home', icon: 'fas fa-home' },
  { path: '/print', name: 'Print Qr Code', icon: 'fas fa-print' },
];

export { QR_CODE_API, LABELS, ENCRYPTION_TYPES, ROUTER_LINKS, TIMEOUT_DURATION };
