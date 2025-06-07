import { useState, useEffect } from 'react';
import { getMaterias, deleteMateria, Materia } from '../services/materiaService';
import { motion, AnimatePresence } from 'framer-motion';
import MateriaForm from '../components/MateriaForm';

const GerenciamentoMaterias = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);

  const fetchMaterias = async () => {
    try { setLoading(true); setMaterias(await getMaterias()); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMaterias(); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza?')) {
      await deleteMateria(id);
      fetchMaterias();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Matérias</h1>
        <button onClick={() => { setSelectedMateria(null); setIsModalOpen(true); }} className="bg-blue-600 text-white py-2 px-4 rounded">Adicionar Matéria</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead><tr><th className="px-6 py-3 text-left">Nome</th><th className="px-6 py-3 text-left">Professor</th><th className="px-6 py-3 text-right">Ações</th></tr></thead>
          <tbody>
            {materias.map((materia) => (
              <tr key={materia.id}>
                <td className="px-6 py-4">{materia.nome}</td>
                <td className="px-6 py-4">{materia.professor?.nome || 'N/A'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setSelectedMateria(materia); setIsModalOpen(true); }} className="text-indigo-600 mr-4">Editar</button>
                  <button onClick={() => handleDelete(materia.id)} className="text-red-600">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && <MateriaForm materia={selectedMateria} onClose={() => setIsModalOpen(false)} onSuccess={fetchMaterias} />}
      </AnimatePresence>
    </div>
  );
};

export default GerenciamentoMaterias;