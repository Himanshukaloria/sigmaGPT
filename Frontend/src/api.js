const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_URL = configuredApiUrl
  ? (() => {
      const url = configuredApiUrl.startsWith("http")
        ? configuredApiUrl
        : `https://${configuredApiUrl}`;
      return url.includes(".onrender.com") ? url : `${url}.onrender.com`;
    })()
  : "http://localhost:8080";

export default API_URL;
