import { useState, useEffect } from 'react';
import { Professor, createProfessor, updateProfessor } from '../services/professorService';
import { motion } from 'framer-motion';

interface ProfessorFormProps {
  professor: Professor | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProfessorForm = ({ professor, onClose, onSuccess }: ProfessorFormProps) => {
  const [formData, setFormData] = useState({
    userId: professor?.userId || 0,
    nome: professor?.nome || '',
    cpf: professor?.cpf || '',
    dataNascimento: professor?.dataNascimento || '',
    especialidade: professor?.especialidade || '',
    formacao: professor?.formacao || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (professor) {
        await updateProfessor(professor.userId, formData as Professor);
      } else {
        await createProfessor(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Impede que o clique feche o modal
      >
        <h2 className="text-2xl font-bold mb-6">{professor ? 'Editar' : 'Adicionar'} Professor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" required className="w-full p-2 border rounded" />
          <input name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF" required className="w-full p-2 border rounded" />
          <input name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} placeholder="Data de Nascimento (DDMMYYYY)" required className="w-full p-2 border rounded" />
          <input name="especialidade" value={formData.especialidade} onChange={handleChange} placeholder="Especialidade" required className="w-full p-2 border rounded" />
          <input name="formacao" value={formData.formacao} onChange={handleChange} placeholder="Formação" required className="w-full p-2 border rounded" />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{professor ? 'Salvar' : 'Criar'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfessorForm;