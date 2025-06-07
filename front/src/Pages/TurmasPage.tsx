import { useState, useEffect } from 'react';
import { getTurmas } from '../services/turmaService';
import TurmaForm from '../components/TurmaForm';

const TurmasPage = () => {
  const [turmas, setTurmas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const data = await getTurmas();
        setTurmas(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchTurmas();
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Gerenciamento de Turmas</h1>
      <TurmaForm />
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Turmas Cadastradas</h2>
        <ul>
          {turmas.map((turma: any) => (
            <li key={turma.Id} className="bg-white p-2 my-2 rounded shadow">
              {turma.Nome} - {turma.PeriodoLetivo}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TurmasPage;