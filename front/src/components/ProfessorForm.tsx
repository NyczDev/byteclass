import React, { useState } from 'react';
import { Professor, createProfessor, updateProfessor } from '../services/professorService';
import { motion } from 'framer-motion';
import { FaUser, FaIdCard, FaCalendarAlt, FaStar, FaGraduationCap, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';

/**
 * Converte uma string de data (que pode vir em formatos como DD/MM/YYYY, YYYY-MM-DD, ou ISO)
 * para o formato "YYYY-MM-DD", que é o formato exigido pelo <input type="date">.
 */
const formatarDataParaInput = (dataStr: string | undefined | null): string => {
  if (!dataStr) return '';
  try {
    const data = new Date(dataStr);
    if (isNaN(data.getTime())) {
      const partes = dataStr.split('T')[0].split(/[\/-]/);
      if (partes.length === 3) {
        const [p1, p2, p3] = partes;
        if (p1.length === 4) return `${p1}-${p2}-${p3}`;
        if (p3.length === 4) return `${p3}-${p2}-${p1}`;
      }
      return '';
    }
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  } catch (error) {
    return '';
  }
};


interface ProfessorFormProps {
  professor: Professor | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProfessorForm = ({ professor, onClose, onSuccess }: ProfessorFormProps) => {
  const [formData, setFormData] = useState({
    nome: professor?.nome || '',
    cpf: professor?.cpf || '',
    dataNascimento: formatarDataParaInput(professor?.dataNascimento), // CORRIGIDO
    especialidade: professor?.especialidade || '',
    formacao: professor?.formacao || '',
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
            dataNascimento: new Date(formData.dataNascimento).toISOString(),
        };

        if (professor) {
            await updateProfessor(professor.userId, dataToSend as Professor);
        } else {
            await createProfessor(dataToSend as Omit<Professor, 'userId'>);
        }
        onSuccess();
        onClose();
    } catch (err: any) {
        setError(err.response?.data?.message || 'Ocorreu um erro ao salvar o professor.');
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
            <h2 className="text-2xl font-bold text-slate-800">{professor ? 'Editar' : 'Adicionar'} Professor</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FaTimes size={20} /></button>
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
                    <label className="block text-sm font-medium text-slate-600 mb-1">Especialidade</label>
                    <div className="relative"><FaStar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="especialidade" value={formData.especialidade} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Formação Acadêmica</label>
                    <div className="relative"><FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="formacao" value={formData.formacao} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/></div>
                </motion.div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm">{error}</div>}

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="font-semibold py-2 px-5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors">Cancelar</button>
                    <button type="submit" disabled={isLoading} className="font-semibold py-2 px-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300 w-32">
                       {isLoading ? <FaSpinner className="animate-spin" /> : <><FaSave /> {professor ? 'Salvar' : 'Criar'}</>}
                    </button>
                </div>
            </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfessorForm;