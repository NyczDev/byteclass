import { useState, useEffect } from 'react';
import { getMaterias } from '../services/materiaService';
import MateriaForm from '../components/MateriaForm';

const MateriasPage = () => {
  const [materias, setMaterias] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const data = await getMaterias();
        setMaterias(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchMaterias();
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Gerenciamento de Matérias</h1>
      <MateriaForm />
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Matérias Cadastradas</h2>
        <ul>
          {materias.map((materia: any) => (
            <li key={materia.Id} className="bg-white p-2 my-2 rounded shadow">
              {materia.Nome} - Professor: {materia.Professor?.Nome ?? 'Não atribuído'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MateriasPage;