const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_URL = configuredApiUrl
  ? (() => {
      const url = configuredApiUrl.startsWith("http")
        ? configuredApiUrl
        : `https://${configuredApiUrl}`;
      if (url.includes(".onrender.com") || url.includes("localhost")) {
        return url;
      }
      return `${url}.onrender.com`;
    })()
  : "http://localhost:8080";

export default API_URL;
