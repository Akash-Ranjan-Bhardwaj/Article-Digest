export const setUser = (userId) => {
  localStorage.setItem('user', userId);
};

export const getUser = () => {
  return localStorage.getItem('user');
};

export const clearUser = () => {
  localStorage.removeItem('user');
};
