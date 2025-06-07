import { useState, useEffect } from 'react';
import { getProfessores, deleteProfessor, Professor } from '../services/professorService';
import { motion, AnimatePresence } from 'framer-motion';
import ProfessorForm from '../components/ProfessorForm'; // Criaremos este componente a seguir

const GerenciamentoProfessores = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  const fetchProfessores = async () => {
    try {
      setLoading(true);
      const data = await getProfessores();
      setProfessores(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        await deleteProfessor(id);
        fetchProfessores(); // Re-fetch para atualizar a lista
      } catch (err: any) {
        setError(err.message);
      }
    }
  };
  
  const handleEdit = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProfessor(null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfessor(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Professores</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Adicionar Professor
        </motion.button>
      </div>

      <motion.div layout className="bg-white p-6 rounded-lg shadow-md">
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidade</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {professores.map((prof) => (
                <motion.tr 
                  key={prof.userId}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prof.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prof.especialidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(prof)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                    <button onClick={() => handleDelete(prof.userId)} className="text-red-600 hover:text-red-900">Excluir</button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <ProfessorForm 
            professor={selectedProfessor}
            onClose={handleCloseModal}
            onSuccess={fetchProfessores}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GerenciamentoProfessores;