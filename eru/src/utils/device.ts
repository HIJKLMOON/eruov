export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: string;
}

const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/Mac OS X/i.test(userAgent)) return 'macOS';
  if (/Windows/i.test(userAgent)) return 'Windows';
  if (/Linux/i.test(navigator.platform)) return 'Linux';
  return 'Unknown';
};

const getDeviceName = (): string => {
  const userAgent = navigator.userAgent;
  if (/iPad/i.test(userAgent)) return 'iPad';
  if (/iPhone/i.test(userAgent)) return 'iPhone';
  if (/iPod/i.test(userAgent)) return 'iPod';
  if (/Android/i.test(userAgent)) {
    const match = userAgent.match(/\b(\w+)\s+Build/);
    if (match) return match[1];
    return 'Android Device';
  }
  if (/Mac OS X/i.test(userAgent)) return 'Mac';
  if (/Windows/i.test(userAgent)) return 'Windows PC';
  if (/Linux/i.test(navigator.platform)) return 'Linux PC';
  return 'Unknown';
};

const generateUUID = (): string => {
  if (typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  // Fallback: RFC4122 v4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = generateUUID();
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

export const getUserIP = async (): Promise<string> => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
};

export const getDeviceInfo = (): DeviceInfo => ({
  deviceId: getDeviceId(),
  deviceName: getDeviceName(),
  deviceType: getDeviceType(),
});
