import axios from 'axios';

const getAuthHeaders = () => {
  const role = localStorage.getItem('role');
  return { 'X-Role': role };
};

export const lancarNota = async (materiaId: number, alunoId: number, notaData: { Valor: number; Descricao: string }) => {
  const API_URL = `http://localhost:3000/api/materias/${materiaId}/alunos/${alunoId}/notas`;
  const response = await axios.post(API_URL, notaData, { headers: getAuthHeaders() });
  return response.data;
};