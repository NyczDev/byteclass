import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMateriasDoProfessor } from '../services/professorService'; // CORRIGIDO
import { Materia } from '../services/materiaService';
import { motion } from 'framer-motion';

const ProfessoresPage = () => {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
        // CORRIGIDO para usar a função certa
        getMateriasDoProfessor(parseInt(userId))
            .then(setMaterias)
            .catch(err => console.error("Erro ao buscar matérias do professor:", err))
            .finally(() => setLoading(false));
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Painel do Professor</h1>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sair</button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Minhas Matérias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? <p>Carregando...</p> : materias.map(materia => (
                <motion.div key={materia.id} whileHover={{ scale: 1.05 }} className="bg-gray-50 p-4 rounded-lg shadow">
                    <h3 className="font-bold">{materia.nome}</h3>
                    <div className="mt-4 flex space-x-2">
                        <button onClick={() => navigate(`/lancar-notas`)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Lançar Notas</button>
                        <button onClick={() => navigate(`/materias/${materia.id}/conteudos`)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Gerenciar Conteúdo</button>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessoresPage;