import axios from 'axios';

const API_URL = 'http://localhost:3000/admin/materias';

const getAuthHeaders = () => {
  const role = localStorage.getItem('role');
  return { 'X-Role': role };
};

export const getMaterias = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createMateria = async (materiaData: { Nome: string; ProfessorId: number }) => {
  const response = await axios.post(API_URL, materiaData, { headers: getAuthHeaders() });
  return response.data;
};