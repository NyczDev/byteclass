import axios from 'axios';

export interface Turma {
  id: number;
  nome: string;
  periodoLetivo: string;
}

const API_URL = 'http://localhost:3000/admin/turmas';

const getAuthHeaders = () => {
  const role = localStorage.getItem('role');
  return { 'X-Role': role };
};

export const getTurmas = async (): Promise<Turma[]> => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data.$values || response.data;
};

export const createTurma = async (turmaData: { nome: string; periodoLetivo: string }) => {
  const response = await axios.post(API_URL, turmaData, { headers: getAuthHeaders() });
  return response.data;
};

export const updateTurma = async (id: number, turmaData: { nome: string; periodoLetivo: string }) => {
  const response = await axios.put(`${API_URL}/${id}`, turmaData, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteTurma = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};