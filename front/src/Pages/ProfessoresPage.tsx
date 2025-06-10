import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMateriasDoProfessor } from '../services/professorService';
import { Materia } from '../services/materiaService';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaBook, FaClipboardList, FaFolderOpen, FaExclamationCircle } from 'react-icons/fa';

// Componente para o esqueleto da UI enquanto as matérias carregam
const MateriaCardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
        <div className="h-8 w-3/4 bg-slate-200 rounded-md mb-6"></div>
        <div className="h-4 w-full bg-slate-200 rounded-md mb-4"></div>
        <div className="flex justify-end gap-4 mt-6">
            <div className="h-10 w-28 bg-slate-200 rounded-lg"></div>
            <div className="h-10 w-36 bg-slate-200 rounded-lg"></div>
        </div>
    </div>
);


const ProfessoresPage = () => {
    const navigate = useNavigate();
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            getMateriasDoProfessor(parseInt(userId))
                .then(setMaterias)
                .catch(err => {
                    console.error("Erro ao buscar matérias do professor:", err);
                    setError("Não foi possível carregar suas matérias. Tente novamente mais tarde.");
                })
                .finally(() => setLoading(false));
        } else {
            navigate('/login');
        }
    }, [userId, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-slate-800">Painel do Professor</h1>
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <FaSignOutAlt /> Sair
                    </button>
                </motion.div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-slate-700">Minhas Matérias Lecionadas</h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => <MateriaCardSkeleton key={i} />)}
                    </div>
                ) : error ? (
                     <div className="text-center py-10 text-red-500 bg-white rounded-lg shadow-md">
                        <FaExclamationCircle className="mx-auto text-4xl mb-2" />
                        <p>{error}</p>
                    </div>
                ) : materias.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-slate-600">Nenhuma matéria atribuída.</h3>
                        <p className="text-slate-500 mt-2">Entre em contato com a administração para ser associado a uma matéria.</p>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {materias.map(materia => (
                            <motion.div
                                key={materia.id}
                                variants={itemVariants}
                                className="bg-white rounded-xl shadow-lg flex flex-col justify-between p-6 transition-shadow hover:shadow-xl"
                            >
                                <div className="mb-4">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                            <FaBook size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">{materia.nome}</h3>
                                    </div>
                                    <p className="text-slate-500 text-sm">Gerencie as notas e os materiais de apoio para esta matéria.</p>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-slate-200 pt-4 mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate(`/lancar-notas`)} // Idealmente, poderia ser `/materias/${materia.id}/lancar-notas`
                                        className="flex w-full sm:w-auto items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                                    >
                                        <FaClipboardList /> Lançar Notas
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate(`/materias/${materia.id}/conteudos`)}
                                        className="flex w-full sm:w-auto items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                                    >
                                        <FaFolderOpen /> Conteúdo
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProfessoresPage;