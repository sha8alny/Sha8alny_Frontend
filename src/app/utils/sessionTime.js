export const getOrCreateSessionTime = () => {
  let currentSessionTime = sessionStorage.getItem('sessionTime');
  
  if (!currentSessionTime) {
    currentSessionTime = new Date().toISOString();
    sessionStorage.setItem('sessionTime', currentSessionTime);
  }
  
  return currentSessionTime;
};

export const getSessionTime = () => {
  return sessionStorage.getItem('sessionTime');
};

export const resetSessionTime = () => {
  const newSessionTime = new Date().toISOString();
  sessionStorage.setItem('sessionTime', newSessionTime);
  return newSessionTime;
};
