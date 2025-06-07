import axios from 'axios';

const API_URL = 'http://localhost:3000/admin/alunos';

export interface Aluno {
  userId: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  nomeResponsavel: string;
}

const getAuthHeaders = () => {
  const role = localStorage.getItem('role');
  return { 'X-Role': role };
};

export const getAlunos = async (): Promise<Aluno[]> => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    // O backend retorna um objeto com uma propriedade $values
    return response.data.$values;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar alunos');
  }
};