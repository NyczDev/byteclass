import React, { useState } from 'react';
import { Aluno, createAluno, updateAluno } from '../services/alunoService';
import { motion } from 'framer-motion';
import { FaUser, FaIdCard, FaCalendarAlt, FaPhone, FaUsers, FaSave, FaTimes } from 'react-icons/fa';

interface AlunoFormProps {
  aluno: Aluno | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AlunoForm = ({ aluno, onClose, onSuccess }: AlunoFormProps) => {
  const [formData, setFormData] = useState({
    nome: aluno?.nome || '',
    cpf: aluno?.cpf || '',
    dataNascimento: aluno?.dataNascimento ? new Date(aluno.dataNascimento).toISOString().split('T')[0] : '',
    telefone: aluno?.telefone || '',
    nomeResponsavel: aluno?.nomeResponsavel || '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const dataToSend = {
        ...formData,
        // Garante que a data seja enviada no formato correto, se necessário
        dataNascimento: new Date(formData.dataNascimento).toISOString(),
      };

      if (aluno) {
        await updateAluno(aluno.userId, dataToSend);
      } else {
        await createAluno(dataToSend);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao salvar o aluno.');
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">{aluno ? 'Editar' : 'Adicionar'} Aluno</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-5">
            {/* Campos do formulário com ícones */}
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nome Completo</label>
                <div className="relative"><FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="nome" value={formData.nome} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"/></div>
            </motion.div>
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-1">CPF</label>
                <div className="relative"><FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="cpf" value={formData.cpf} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"/></div>
            </motion.div>
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-1">Data de Nascimento</label>
                <div className="relative"><FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"/></div>
            </motion.div>
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-1">Telefone</label>
                <div className="relative"><FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="telefone" value={formData.telefone} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"/></div>
            </motion.div>
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Responsável</label>
                <div className="relative"><FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="nomeResponsavel" value={formData.nomeResponsavel} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"/></div>
            </motion.div>
            
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm">{error}</div>}

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="font-semibold py-2 px-5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors">Cancelar</button>
              <button type="submit" disabled={isLoading} className="font-semibold py-2 px-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-blue-300">
                <FaSave /> {isLoading ? 'Salvando...' : (aluno ? 'Salvar' : 'Criar')}
              </button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AlunoForm;