const QR_CODE_API = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=';

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
  FOOTER_TEXT: '© 2024 WiFi QR Code Generator. All rights reserved.',
  QR_CODE_IMG_LABEL: 'Point your camera at the QR code to connect to the WiFi network',
  LOADING: 'Loading...',
};

const ENCRYPTION_TYPES = {
  wpa: 'WPA',
  wep: 'WEP',
  nopass: 'nopass',
};

const ROUTER_LINKS = [
  { path: '/', name: 'Home' },
  { path: '/print', name: 'Print' },
];

export { QR_CODE_API, LABELS, ENCRYPTION_TYPES, ROUTER_LINKS };
