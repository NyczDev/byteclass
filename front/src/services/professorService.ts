import axios from 'axios';
import { Materia } from './materiaService';

const API_URL = 'http://localhost:3000/admin/professores';

export interface Professor {
  userId: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  especialidade: string;
  formacao: string;
  role?: string;
}

const getAuthHeaders = () => {
  const role = localStorage.getItem('role');
  return { 'X-Role': role };
};

// ... (as funções create, update, delete, getProfessores continuam aqui)
export const getProfessores = async (): Promise<Professor[]> => {
    try {
      const response = await axios.get(API_URL, { headers: getAuthHeaders() });
      return response.data.$values || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar professores');
    }
  };
  
  export const createProfessor = async (professorData: Omit<Professor, 'userId'>) => {
    const response = await axios.post(API_URL, professorData, { headers: getAuthHeaders() });
    return response.data;
  };
  
  export const updateProfessor = async (id: number, professorData: Omit<Professor, 'userId'>) => {
    const response = await axios.put(`${API_URL}/${id}`, professorData, { headers: getAuthHeaders() });
    return response.data;
  };
  
  export const deleteProfessor = async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
  };

// ADICIONE ESTA NOVA FUNÇÃO
export const getMateriasDoProfessor = async (professorId: number): Promise<Materia[]> => {
  const response = await axios.get(`${API_URL}/${professorId}/materias`, { headers: getAuthHeaders() });
  return response.data?.$values || response.data;
};