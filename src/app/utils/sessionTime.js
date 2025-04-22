let sessionTime = null;

export const getOrCreateSessionTime = () => {
  if (!sessionTime) {
    sessionTime = new Date().toISOString();
  }

  return sessionTime;
};

export const getSessionTime = () => {
  return sessionTime;
};

export const updateSessionTime = () => {
  const newSessionTime = Date.now().toString();
  sessionStorage.setItem('sessionTime', newSessionTime);
  return newSessionTime;
};
