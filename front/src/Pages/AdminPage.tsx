import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaUserGraduate, FaBook, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Animações mais ricas com Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Anima cada filho com um pequeno atraso
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0px 15px 25px rgba(0,0,0,0.15)",
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  const managementOptions = [
    {
      title: "Gerenciar Professores",
      path: "/admin/professores",
      description: "Adicionar, editar e remover professores.",
      icon: <FaChalkboardTeacher size={40} className="text-white" />,
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      title: "Gerenciar Alunos",
      path: "/admin/alunos",
      description: "Adicionar, editar e remover alunos.",
      icon: <FaUserGraduate size={40} className="text-white" />,
      bgColor: "from-green-500 to-green-600",
    },
    {
      title: "Gerenciar Matérias",
      path: "/admin/materias",
      description: "Adicionar, editar e remover matérias.",
      icon: <FaBook size={40} className="text-white" />,
      bgColor: "from-purple-500 to-purple-600",
    },
    {
      title: "Gerenciar Turmas",
      path: "/admin/turmas",
      description: "Adicionar, editar e remover turmas.",
      icon: <FaUsers size={40} className="text-white" />,
      bgColor: "from-yellow-500 to-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800">Painel de Administração</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <FaSignOutAlt />
            Sair
          </button>
        </motion.div>

        {/* Grade de Opções */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {managementOptions.map((opt) => (
            <motion.div
              key={opt.title}
              variants={cardVariants}
              whileHover="hover"
              onClick={() => navigate(opt.path)}
              className={`p-6 rounded-xl shadow-lg cursor-pointer text-white flex flex-col justify-between h-48 bg-gradient-to-br ${opt.bgColor}`}
            >
              <div className="flex justify-end">
                {opt.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{opt.title}</h2>
                <p className="text-white/80 mt-1">{opt.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;