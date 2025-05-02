const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAndSetSessionTime = async () => {
  try {
    const response = await fetch(`${apiURL}/serverTime`);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    const data = await response.json();
    const serverTime = data.sessionTime;
    
    sessionStorage.setItem('sessionTime', serverTime);
    
    return serverTime;
  } catch (error) {
    console.error('Failed to fetch server time:', error);
    const fallbackTime = new Date().toISOString();
    sessionStorage.setItem('sessionTime', fallbackTime);
    return fallbackTime;
  }
};


export const getOrCreateSessionTime = async () => {
  let currentSessionTime = sessionStorage.getItem('sessionTime');
  
  if (!currentSessionTime) {
    currentSessionTime = await fetchAndSetSessionTime();
  }
  
  return currentSessionTime;
};


export const getSessionTime = () => {
  return sessionStorage.getItem('sessionTime');
};


export const resetSessionTime = async () => {
  return await fetchAndSetSessionTime();
};