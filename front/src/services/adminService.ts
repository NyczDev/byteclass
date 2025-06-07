import axios from 'axios';

const API_URL = 'http://localhost:3000/admin';

export interface Admin {
  userId: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
}

const getAuthHeaders = () => {
  const role = localStorage.getItem('role');
  return { 'X-Role': role };
};

export const getAdmins = async (): Promise<Admin[]> => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data.$values;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar administradores');
  }
};