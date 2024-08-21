const BASE_URL = 'https://apiqa2.uniqueschoolapp.ie';
const API_VERSION = 'v5';

export const API_ENDPOINTS = {
  BASE_URL,
  LOGIN: `${BASE_URL}/${API_VERSION}/api/login`,
  FETCH_NOTIFICATIONS: `${BASE_URL}/${API_VERSION}/api/fetchnotifications`,
};

export const getLoginUrl = (params: {
  api_version: string;
  school_id: string;
  app_version: string;
  device_manufacturer: string;
  device_model: string;
  device_os_name: string;
  device_os_version: string;
  device_os_type: string;
  device_type: string;
  email: string;
  password: string;
}) => {
  const searchParams = new URLSearchParams({
    api_version: params.api_version,
    school_id: params.school_id,
    app_version: params.app_version,
    device_manufacturer: params.device_manufacturer,
    device_model: params.device_model,
    device_os_name: params.device_os_name,
    device_os_version: params.device_os_version,
    device_os_type: params.device_os_type,
    device_type: params.device_type,
    email: params.email,
    password: params.password,
  });

  return `${API_ENDPOINTS.LOGIN}?${searchParams.toString()}`;
};

export const getNotificationsUrl = (params: {
  timestamp?: number;
  previous_time_stamp?: number;
  api_version?: string;
  category?: string;
}) => {
  const searchParams = new URLSearchParams({
    timestamp: params.timestamp?.toString() || '0',
    previous_time_stamp: params.previous_time_stamp?.toString() || '0',
    api_version: params.api_version || 'api_version',
    category: params.category || '',
  });

  return `${API_ENDPOINTS.FETCH_NOTIFICATIONS}?${searchParams.toString()}`;
};