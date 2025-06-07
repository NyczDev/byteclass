import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const cardVariants = {
    hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" },
  };

  const managementOptions = [
    { title: "Gerenciar Professores", path: "/admin/professores", description: "Adicionar, editar e remover professores." },
    { title: "Gerenciar Alunos", path: "/admin/alunos", description: "Adicionar, editar e remover alunos." },
    { title: "Gerenciar Matérias", path: "/admin/materias", description: "Adicionar, editar e remover matérias." },
    { title: "Gerenciar Turmas", path: "/admin/turmas", description: "Adicionar, editar e remover turmas." },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Painel de Administração</h1>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementOptions.map(opt => (
          <motion.div 
            key={opt.title}
            variants={cardVariants} 
            whileHover="hover" 
            onClick={() => navigate(opt.path)}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-gray-700">{opt.title}</h2>
            <p className="text-gray-500 mt-2">{opt.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;