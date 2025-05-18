import axios from 'axios';

export interface Usuario {
  token: string;
  role: 'aluno' | 'professor' | 'admin' | string;
}

const API_URL = 'http://localhost:3000/api/login';

export async function login(cpf: string, senha: string): Promise<Usuario> {
  try {
    const response = await axios.post<Usuario>(API_URL, { cpf, senha });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Erro ao fazer login'
    );
  }
}
