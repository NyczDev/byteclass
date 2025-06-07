import axios from 'axios';
import { Materia } from './materiaService'; 

export interface Nota {
  id: number;
  valor: number;
  descricao: string;
  dataLancamento: string;
  alunoId: number;
  materiaId: number;
  materia?: Materia;
}

const getAuthHeaders = () => {
  const role = localStorage.getItem('role');
  return { 'X-Role': role };
};

export const lancarNota = async (materiaId: number, alunoId: number, notaData: { Valor: number; Descricao: string }) => {
  const API_URL = `http://localhost:3000/api/materias/${materiaId}/alunos/${alunoId}/notas`;
  const response = await axios.post(API_URL, notaData, { headers: getAuthHeaders() });
  return response.data;
};

export const getNotasDoAlunoNaMateria = async (materiaId: number, alunoId: number): Promise<Nota[]> => {
  const API_URL = `http://localhost:3000/api/materias/${materiaId}/alunos/${alunoId}/notas`;
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data.$values || response.data;
};