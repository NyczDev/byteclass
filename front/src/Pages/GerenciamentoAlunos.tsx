import { useState, useEffect } from 'react';
import { getAlunos, deleteAluno, Aluno } from '../services/alunoService';
import { motion, AnimatePresence } from 'framer-motion';
import AlunoForm from '../components/AlunoForm';

const GerenciamentoAlunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const data = await getAlunos();
      setAlunos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza?')) {
      await deleteAluno(id);
      fetchAlunos();
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setIsModalOpen(true);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Alunos</h1>
        <button onClick={() => { setSelectedAluno(null); setIsModalOpen(true); }} className="bg-blue-600 text-white py-2 px-4 rounded">Adicionar Aluno</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">CPF</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.userId}>
                <td className="px-6 py-4">{aluno.nome}</td>
                <td className="px-6 py-4">{aluno.cpf}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(aluno)} className="text-indigo-600 mr-4">Editar</button>
                  <button onClick={() => handleDelete(aluno.userId)} className="text-red-600">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <AlunoForm 
            aluno={selectedAluno}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchAlunos}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GerenciamentoAlunos;