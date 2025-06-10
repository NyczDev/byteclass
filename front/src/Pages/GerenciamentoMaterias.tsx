import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMaterias, deleteMateria, Materia } from '../services/materiaService';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaBook, FaEdit, FaTrash, FaArrowLeft, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import MateriaForm from '../components/MateriaForm'; // Seu componente de formulário
import ConfirmModal from '../components/ConfirmModal'; 
import Spinner from '../components/Spinner'; // Reutilize o spinner

const GerenciamentoMaterias = () => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const navigate = useNavigate();

    const fetchMaterias = async () => {
        try {
            setLoading(true);
            const data = await getMaterias();
            setMaterias(data);
            setError('');
        } catch (err: any) {
            setError('Falha ao buscar matérias. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterias();
    }, []);

    const handleEditClick = (e: React.MouseEvent, materia: Materia) => {
        e.stopPropagation(); // Impede que o clique no botão propague para o card
        setSelectedMateria(materia);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Impede a propagação do clique
        setConfirmDeleteId(id);
    };

    const confirmDelete = async () => {
        if (confirmDeleteId) {
            await deleteMateria(confirmDeleteId);
            setConfirmDeleteId(null);
            fetchMaterias();
        }
    };

    const handleAddNew = () => {
        setSelectedMateria(null);
        setIsModalOpen(true);
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
        hover: { scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                >
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin')} className="text-blue-600 hover:text-blue-800">
                            <FaArrowLeft size={24} />
                        </button>
                        <h1 className="text-3xl font-bold text-slate-800">Gerenciamento de Matérias</h1>
                    </div>
                    <button onClick={handleAddNew} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <FaPlus />
                        Adicionar Matéria
                    </button>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500 bg-white rounded-lg shadow-md">
                        <FaExclamationTriangle className="mx-auto text-4xl mb-2" />
                        <p>{error}</p>
                    </div>
                ) : materias.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-slate-600">Nenhuma matéria encontrada.</h3>
                        <p className="text-slate-500 mt-2">Clique em "Adicionar Matéria" para cadastrar a primeira.</p>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {materias.map((materia) => (
                            <motion.div
                                key={materia.id}
                                variants={itemVariants}
                                whileHover="hover"
                                onClick={() => navigate(`/admin/materias/${materia.id}/conteudos`)}
                                className="bg-white rounded-xl shadow-lg cursor-pointer flex flex-col justify-between p-6"
                            >
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex-shrink-0 h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                            <FaBook size={24} />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-800">{materia.nome}</h2>
                                    </div>
                                    <p className="text-slate-600 mb-6">
                                        <span className="font-medium">Professor:</span> {materia.professor?.nome || 'Não atribuído'}
                                    </p>
                                </div>
                                <div className="flex justify-end items-center gap-4 border-t border-slate-200 pt-4 mt-4">
                                    <button onClick={(e) => handleEditClick(e, materia)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                                        <FaEdit /> Editar
                                    </button>
                                    <button onClick={(e) => handleDeleteClick(e, materia.id)} className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-colors">
                                        <FaTrash /> Excluir
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <MateriaForm
                        materia={selectedMateria}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => {
                            setIsModalOpen(false);
                            fetchMaterias();
                        }}
                    />
                )}
                {confirmDeleteId !== null && (
                    <ConfirmModal
                        onConfirm={confirmDelete}
                        onCancel={() => setConfirmDeleteId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default GerenciamentoMaterias;