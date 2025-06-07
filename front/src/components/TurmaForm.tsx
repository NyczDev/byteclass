import { useState } from 'react';
import { Turma, createTurma, updateTurma } from '../services/turmaService';
import { motion } from 'framer-motion';

interface TurmaFormProps {
  turma: Turma | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TurmaForm = ({ turma, onClose, onSuccess }: TurmaFormProps) => {
  const [formData, setFormData] = useState({
    nome: turma?.nome || '',
    periodoLetivo: turma?.periodoLetivo || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (turma) {
        await updateTurma(turma.id, formData);
      } else {
        await createTurma(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao salvar a turma.');
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
        <h2 className="text-2xl font-bold mb-6">{turma ? 'Editar' : 'Adicionar'} Turma</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome da Turma (Ex: 9º Ano A)" required className="w-full p-2 border rounded" />
          <input name="periodoLetivo" value={formData.periodoLetivo} onChange={handleChange} placeholder="Período Letivo (Ex: 2025)" required className="w-full p-2 border rounded" />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{turma ? 'Salvar' : 'Criar'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TurmaForm;