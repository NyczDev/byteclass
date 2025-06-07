import axios from 'axios';
import { Materia } from './materiaService';

// ... (interface Aluno e outras funções existentes) ...
export interface Aluno {
  userId: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  nomeResponsavel: string;
  role?: string;
}


const getAuthHeaders = () => {
    const role = localStorage.getItem('role');
    return { 'X-Role': role };
  };
  
  export const getAlunos = async (): Promise<Aluno[]> => {
    try {
      const response = await axios.get('http://localhost:3000/admin/alunos', { headers: getAuthHeaders() });
      return response.data.$values || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar alunos');
    }
  };
  
  export const createAluno = async (alunoData: Omit<Aluno, 'userId'>) => {
    const response = await axios.post('http://localhost:3000/admin/alunos', alunoData, { headers: getAuthHeaders() });
    return response.data;
  };
  
  export const updateAluno = async (id: number, alunoData: Omit<Aluno, 'userId'>) => {
    const response = await axios.put(`http://localhost:3000/admin/alunos/${id}`, alunoData, { headers: getAuthHeaders() });
    return response.data;
  };
  
  export const deleteAluno = async (id: number) => {
    const response = await axios.delete(`http://localhost:3000/admin/alunos/${id}`, { headers: getAuthHeaders() });
    return response.data;
  };

export const getMateriasDoAluno = async (alunoId: number): Promise<Materia[]> => {
  const API_URL = `http://localhost:3000/admin/alunos/${alunoId}/materias`;
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data?.$values || response.data;
};