import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlunos, deleteAluno, Aluno } from '../services/alunoService';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaEdit, FaTrash, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import AlunoForm from '../components/AlunoForm'; // Seu componente de formulário
import Spinner from '../components/Spinner'; // Um componente de spinner genérico (exemplo abaixo)

import ConfirmModal from '../components/ConfirmModal'; 
const GerenciamentoAlunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<number | null>(null);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const navigate = useNavigate();

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const data = await getAlunos();
      setAlunos(data);
      setError('');
    } catch (err: any) {
      setError('Falha ao buscar alunos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleDeleteClick = (id: number) => {
    setShowConfirmModal(id);
  };

  const confirmDelete = async () => {
    if (showConfirmModal) {
      await deleteAluno(showConfirmModal);
      setShowConfirmModal(null);
      fetchAlunos(); // Atualiza a lista
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedAluno(null);
    setIsModalOpen(true);
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="text-blue-600 hover:text-blue-800">
              <FaArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Gerenciamento de Alunos</h1>
          </div>
          <button 
            onClick={handleAddNew} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <FaUserPlus />
            Adicionar Aluno
          </button>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <FaExclamationTriangle className="mx-auto text-4xl mb-2" />
              <p>{error}</p>
            </div>
          ) : alunos.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <h3 className="text-lg font-semibold">Nenhum aluno encontrado.</h3>
              <p>Comece adicionando um novo aluno no botão acima.</p>
            </div>
          ) : (
            <motion.ul variants={listVariants} initial="hidden" animate="visible" className="divide-y divide-slate-200">
              {/* Cabeçalho da Lista */}
              <li className="hidden md:grid grid-cols-3 gap-4 px-4 py-2 font-semibold text-slate-600">
                <div className="col-span-1">Nome</div>
                <div className="col-span-1">CPF</div>
                <div className="col-span-1 text-right">Ações</div>
              </li>
              {/* Itens da Lista */}
              {alunos.map((aluno) => (
                <motion.li 
                  key={aluno.userId}
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center px-4 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="font-medium text-slate-800">{aluno.nome}</div>
                  <div className="text-slate-500">{aluno.cpf}</div>
                  <div className="flex justify-end items-center gap-4 mt-2 md:mt-0">
                    <button onClick={() => handleEdit(aluno)} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
                      <FaEdit /> Editar
                    </button>
                    <button onClick={() => handleDeleteClick(aluno.userId)} className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors font-medium">
                      <FaTrash /> Excluir
                    </button>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <AlunoForm 
            aluno={selectedAluno}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              fetchAlunos();
            }}
          />
        )}
        {showConfirmModal !== null && (
          <ConfirmModal 
            onConfirm={confirmDelete} 
            onCancel={() => setShowConfirmModal(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GerenciamentoAlunos;