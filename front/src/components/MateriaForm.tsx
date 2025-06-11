import { useState, useEffect } from 'react';
import { Materia, createMateria, updateMateria } from '../services/materiaService';
import { getProfessores, Professor } from '../services/professorService';
import { motion } from 'framer-motion';
import { FaBook, FaChalkboardTeacher, FaSave, FaTimes } from 'react-icons/fa';

interface MateriaFormProps {
  materia: Materia | null;
  onClose: () => void;
  onSuccess: () => void;
}

const MateriaForm = ({ materia, onClose, onSuccess }: MateriaFormProps) => {
  const [formData, setFormData] = useState({
    nome: materia?.nome || '',
    professorId: materia?.professorId || 0,
  });
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getProfessores().then(setProfessores);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'professorId' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.professorId || formData.professorId === 0) {
      setError('Por favor, selecione um professor.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      if (materia) {
        await updateMateria(materia.id, formData);
      } else {
        await createMateria(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao salvar a matéria.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reutilizando as mesmas animações para consistência
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">{materia ? 'Editar' : 'Adicionar'} Matéria</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><FaTimes size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
            <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-5">
                <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Nome da Matéria</label>
                    <div className="relative"><FaBook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="nome" value={formData.nome} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"/></div>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Professor Responsável</label>
                    <div className="relative"><FaChalkboardTeacher className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><select name="professorId" value={formData.professorId} onChange={handleChange} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value={0} disabled>Selecione um professor</option>
                        {professores.map(p => <option key={p.userId} value={p.userId}>{p.nome}</option>)}
                    </select></div>
                </motion.div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm">{error}</div>}

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="font-semibold py-2 px-5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors">Cancelar</button>
                    <button type="submit" disabled={isLoading} className="font-semibold py-2 px-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-blue-300">
                        <FaSave /> {isLoading ? 'Salvando...' : (materia ? 'Salvar' : 'Criar')}
                    </button>
                </div>
            </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MateriaForm;