import React, { useState } from 'react';
import { Aluno, createAluno, updateAluno } from '../services/alunoService';
import { motion } from 'framer-motion';
import { FaUser, FaIdCard, FaCalendarAlt, FaPhone, FaUsers, FaSave, FaTimes } from 'react-icons/fa';

const formatarDataParaInput = (dataStr: string | undefined | null): string => {
  if (!dataStr) return '';
  try {
    // Tenta criar uma data. new Date() é flexível e aceita vários formatos, incluindo ISO e YYYY-MM-DD.
    const data = new Date(dataStr);
    
    // Se a data for inválida (ex: formato "DD/MM/YYYY" pode falhar em alguns navegadores), tenta o parse manual.
    if (isNaN(data.getTime())) {
      const partes = dataStr.split('T')[0].split(/[\/-]/); // Divide por / ou -
      if (partes.length === 3) {
        const [p1, p2, p3] = partes;
        // Assume YYYY-MM-DD ou DD-MM-YYYY
        if (p1.length === 4) return `${p1}-${p2}-${p3}`; // Já é YYYY-MM-DD
        if (p3.length === 4) return `${p3}-${p2}-${p1}`; // Converte DD-MM-YYYY para YYYY-MM-DD
      }
      return ''; // Retorna vazio se não conseguir converter
    }
    
    // Se a data for válida, formata para o padrão.
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;

  } catch (error) {
    return ''; // Em caso de qualquer erro, retorna uma string vazia.
  }
};


interface AlunoFormProps {
  aluno: Aluno | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AlunoForm = ({ aluno, onClose, onSuccess }: AlunoFormProps) => {
  const [formData, setFormData] = useState({
    nome: aluno?.nome || '',
    cpf: aluno?.cpf || '',
    dataNascimento: formatarDataParaInput(aluno?.dataNascimento), // CORRIGIDO
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
      // O input type="date" já fornece a data no formato YYYY-MM-DD,
      // que a maioria dos back-ends consegue interpretar.
      const dataToSend = {
        ...formData,
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
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start py-10 z-50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">{aluno ? 'Editar' : 'Adicionar'} Aluno</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-5">
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nome Completo</label>
                <div className="relative"><FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="nome" value={formData.nome} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
            </motion.div>
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-1">CPF</label>
                <div className="relative"><FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="cpf" value={formData.cpf} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
            </motion.div>
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-1">Data de Nascimento</label>
                <div className="relative"><FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
            </motion.div>
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-1">Telefone</label>
                <div className="relative"><FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="telefone" value={formData.telefone} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
            </motion.div>
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Responsável</label>
                <div className="relative"><FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="nomeResponsavel" value={formData.nomeResponsavel} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
            </motion.div>
            
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm">{error}</div>}

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="font-semibold py-2 px-5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors">Cancelar</button>
              <button type="submit" disabled={isLoading} className="font-semibold py-2 px-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300 w-32">
                <FaSave /> {aluno ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AlunoForm;