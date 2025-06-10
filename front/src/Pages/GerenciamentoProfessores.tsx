import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfessores, deleteProfessor, Professor } from '../services/professorService';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaEdit, FaTrash, FaArrowLeft, FaExclamationTriangle, FaChalkboardTeacher, FaSpinner } from 'react-icons/fa';
import ProfessorForm from '../components/ProfessorForm';
import ConfirmModal from '../components/ConfirmModal'; // Reutilize o modal
import Spinner from '../components/Spinner'; // Reutilize o spinner

const GerenciamentoProfessores = () => {
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const navigate = useNavigate();

    const fetchProfessores = async () => {
        try {
            setLoading(true);
            const data = await getProfessores();
            setProfessores(data);
            setError('');
        } catch (err: any) {
            setError('Falha ao buscar professores. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfessores();
    }, []);

    const handleDeleteClick = (id: number) => {
        setConfirmDeleteId(id);
    };

    const confirmDelete = async () => {
        if (confirmDeleteId) {
            await deleteProfessor(confirmDeleteId);
            setConfirmDeleteId(null);
            fetchProfessores();
        }
    };

    const handleEdit = (professor: Professor) => {
        setSelectedProfessor(professor);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedProfessor(null);
        setIsModalOpen(true);
    };

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.07 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
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
                        <h1 className="text-3xl font-bold text-slate-800">Gerenciamento de Professores</h1>
                    </div>
                    <button onClick={handleAddNew} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <FaUserPlus />
                        Adicionar Professor
                    </button>
                </motion.div>

                <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            <FaExclamationTriangle className="mx-auto text-4xl mb-2" />
                            <p>{error}</p>
                        </div>
                    ) : professores.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            <h3 className="text-lg font-semibold">Nenhum professor encontrado.</h3>
                            <p>Comece adicionando um novo professor no botão acima.</p>
                        </div>
                    ) : (
                        <motion.ul variants={listVariants} initial="hidden" animate="visible" className="flex flex-col">
                            {/* Cabeçalho da Lista */}
                            <li className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 font-semibold text-slate-600 border-b">
                                <div className="col-span-5">Nome</div>
                                <div className="col-span-5">Especialidade</div>
                                <div className="col-span-2 text-right">Ações</div>
                            </li>
                            {/* Itens da Lista */}
                            {professores.map((prof) => (
                                <motion.li
                                    key={prof.userId}
                                    variants={itemVariants}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="md:col-span-5 flex items-center gap-4">
                                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                            <FaChalkboardTeacher />
                                        </div>
                                        <span className="font-medium text-slate-800">{prof.nome}</span>
                                    </div>
                                    <div className="md:col-span-5 text-slate-500">{prof.especialidade}</div>
                                    <div className="md:col-span-2 flex justify-end items-center gap-4 mt-2 md:mt-0">
                                        <button onClick={() => handleEdit(prof)} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
                                            <FaEdit /> Editar
                                        </button>
                                        <button onClick={() => handleDeleteClick(prof.userId)} className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors font-medium">
                                            <FaTrash /> Excluir
                                        </button>
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </motion.div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <ProfessorForm
                        professor={selectedProfessor}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => {
                            setIsModalOpen(false);
                            fetchProfessores();
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

export default GerenciamentoProfessores;