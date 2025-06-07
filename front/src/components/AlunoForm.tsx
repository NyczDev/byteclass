import { useState } from 'react';
import { Aluno, createAluno, updateAluno } from '../services/alunoService';
import { motion } from 'framer-motion';

interface AlunoFormProps {
  aluno: Aluno | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AlunoForm = ({ aluno, onClose, onSuccess }: AlunoFormProps) => {
  const [formData, setFormData] = useState({
    nome: aluno?.nome || '',
    cpf: aluno?.cpf || '',
    dataNascimento: aluno?.dataNascimento || '',
    telefone: aluno?.telefone || '',
    nomeResponsavel: aluno?.nomeResponsavel || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (aluno) {
        await updateAluno(aluno.userId, formData);
      } else {
        await createAluno(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao salvar o aluno.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">{aluno ? 'Editar' : 'Adicionar'} Aluno</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome Completo" required className="w-full p-2 border rounded" />
          <input name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF" required className="w-full p-2 border rounded" />
          <input name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} placeholder="Data de Nascimento (DDMMYYYY)" required className="w-full p-2 border rounded" />
          <input name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Telefone" required className="w-full p-2 border rounded" />
          <input name="nomeResponsavel" value={formData.nomeResponsavel} onChange={handleChange} placeholder="Nome do Responsável" required className="w-full p-2 border rounded" />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{aluno ? 'Salvar Alterações' : 'Criar Aluno'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AlunoForm;