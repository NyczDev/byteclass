import axios from 'axios';
import { Professor } from './professorService';

export interface Materia {
  id: number;
  nome: string;
  professorId: number;
  professor?: Professor; 
}

const API_URL = 'http://localhost:3000/admin/materias';

const getAuthHeaders = () => {
  const role = localStorage.getItem('role');
  return { 'X-Role': role };
};

export const getMaterias = async (): Promise<Materia[]> => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data.$values || response.data;
};

export const createMateria = async (materiaData: { nome: string; professorId: number }) => {
  const response = await axios.post(API_URL, materiaData, { headers: getAuthHeaders() });
  return response.data;
};

export const updateMateria = async (id: number, materiaData: { nome: string; professorId: number }) => {
  const response = await axios.put(`${API_URL}/${id}`, materiaData, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteMateria = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};