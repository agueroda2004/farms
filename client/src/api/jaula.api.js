import api from "./axiosConfig"; // Asumiendo que tienes un axiosConfig.js

export const getJaulas = async (granjaId) => {
  const response = await api.get(`/jaulas?granjaId=${granjaId}`);
  return response.data;
};

export const getJaulaById = async (id) => {
  const response = await api.get(`/jaulas/${id}`);
  return response.data;
};

export const createJaula = async (jaulaData) => {
  const response = await api.post("/jaulas", jaulaData);
  return response.data;
};

export const updateJaula = async (id, jaulaData) => {
  const response = await api.put(`/jaulas/${id}`, jaulaData);
  return response.data;
};

export const deleteJaula = async (id) => {
  const response = await api.delete(`/jaulas/${id}`);
  return response.data;
};
