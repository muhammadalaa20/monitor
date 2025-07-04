const getDefaultBaseUrl = () => {
  if (typeof window === "undefined") return "http://localhost:5000";

  const localOrigin = window.location.origin;
  const assumedBackendPort = 5000;

  try {
    const url = new URL(localOrigin);
    return `${url.protocol}//${url.hostname}:${assumedBackendPort}`;
  } catch (e) {
    console.error('Error creating URL:', e);
    return "http://localhost:5000" ;
  }
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || getDefaultBaseUrl();
