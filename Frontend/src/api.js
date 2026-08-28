const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_URL = configuredApiUrl
  ? configuredApiUrl.startsWith("http")
    ? configuredApiUrl
    : `https://${configuredApiUrl}`
  : "http://localhost:8080";

export default API_URL;
