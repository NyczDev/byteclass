import axios from 'axios';

export interface Conteudo {
  id: number;
  titulo: string;
  descricao: string;
  dataCadastro: string;
  materiaId: number;
}

const getAuthHeaders = () => {
  const role = localStorage.getItem('role');
  return { 'X-Role': role };
};

export const getConteudosDaMateria = async (materiaId: number): Promise<Conteudo[]> => {
  const API_URL = `http://localhost:3000/api/materias/${materiaId}/conteudos`;
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data?.$values || response.data;
};

export const createConteudo = async (materiaId: number, conteudoData: { titulo: string; descricao: string }) => {
  const API_URL = `http://localhost:3000/api/materias/${materiaId}/conteudos`;
  const response = await axios.post(API_URL, conteudoData, { headers: getAuthHeaders() });
  return response.data;
};