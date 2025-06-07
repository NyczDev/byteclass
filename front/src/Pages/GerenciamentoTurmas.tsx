import { useState, useEffect } from 'react';
import { getTurmas, deleteTurma, Turma } from '../services/turmaService';
import { motion, AnimatePresence } from 'framer-motion';
import TurmaForm from '../components/TurmaForm';

const GerenciamentoTurmas = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  
  const fetchTurmas = async () => {
    try { setLoading(true); setTurmas(await getTurmas()); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTurmas(); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza?')) {
      await deleteTurma(id);
      fetchTurmas();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Turmas</h1>
        <button onClick={() => { setSelectedTurma(null); setIsModalOpen(true); }} className="bg-blue-600 text-white py-2 px-4 rounded">Adicionar Turma</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead><tr><th className="px-6 py-3 text-left">Nome</th><th className="px-6 py-3 text-left">Período Letivo</th><th className="px-6 py-3 text-right">Ações</th></tr></thead>
          <tbody>
            {turmas.map((turma) => (
              <tr key={turma.id}>
                <td className="px-6 py-4">{turma.nome}</td>
                <td className="px-6 py-4">{turma.periodoLetivo}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setSelectedTurma(turma); setIsModalOpen(true); }} className="text-indigo-600 mr-4">Editar</button>
                  <button onClick={() => handleDelete(turma.id)} className="text-red-600">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && <TurmaForm turma={selectedTurma} onClose={() => setIsModalOpen(false)} onSuccess={fetchTurmas} />}
      </AnimatePresence>
    </div>
  );
};

export default GerenciamentoTurmas;