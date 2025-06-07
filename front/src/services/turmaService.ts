import axios from 'axios';

const API_URL = 'http://localhost:3000/admin/turmas';

const getAuthHeaders = () => {
  const role = localStorage.getItem('role');
  return { 'X-Role': role };
};

export const getTurmas = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createTurma = async (turmaData: { Nome: string; PeriodoLetivo: string }) => {
  const response = await axios.post(API_URL, turmaData, { headers: getAuthHeaders() });
  return response.data;
};