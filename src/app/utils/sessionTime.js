let sessionTime = null;

async function fetchUTCTimeFromAPI() {
  const response = await fetch(
    "https://www.timeapi.io/api/Time/current/zone?timeZone=Etc/UTC"
  );
  const data = await response.json();
  return data.dateTime;
}
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    sessionTime = null;
    sessionStorage.removeItem('sessionTime');
  });
}

export const getOrCreateSessionTime = async (page) => {
  let sessionTimer = await fetchUTCTimeFromAPI();

  if (!sessionTime || page === 1) {
    sessionTime = sessionTimer;
    return sessionTimer;
  }
};

export const getSessionTime = () => {
  return sessionTime;
};

export const updateSessionTime = () => {
  const newSessionTime = Date.now().toString();
  sessionStorage.setItem("sessionTime", newSessionTime);
  return newSessionTime;
};
