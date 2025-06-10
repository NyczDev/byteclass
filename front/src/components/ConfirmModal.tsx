import React from 'react';
import { motion } from 'framer-motion';

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
      >
        <h2 className="text-lg font-semibold text-gray-800">Confirmar Exclusão</h2>
        <p className="text-gray-600 mt-2">Você tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.</p>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onCancel} className="py-2 px-4 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="py-2 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold transition-colors">
            Excluir
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmModal;