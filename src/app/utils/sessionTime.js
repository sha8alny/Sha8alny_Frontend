let sessionTime= null

export const getOrCreateSessionTime = () => {
  if (!sessionTime) {
    sessionTime = new Date().toISOString();
  } 

  return sessionTime;
};

export const getSessionTime = () => {
  return sessionTime;
};
