import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConteudosDaMateria, createConteudo, Conteudo } from '../services/conteudoService';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaPlus, FaBookOpen, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const GerenciamentoConteudosPage = () => {
    const { materiaId } = useParams<{ materiaId: string }>();
    const navigate = useNavigate();

    const [conteudos, setConteudos] = useState<Conteudo[]>([]);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchConteudos = useCallback(async () => {
        if (!materiaId) return;
        try {
            setLoading(true);
            const data = await getConteudosDaMateria(parseInt(materiaId));
            setConteudos(data);
            setError('');
        } catch (err) {
            setError('Não foi possível carregar os conteúdos. Tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [materiaId]);

    useEffect(() => {
        fetchConteudos();
    }, [fetchConteudos]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (materiaId && titulo) {
            await createConteudo(parseInt(materiaId), { titulo, descricao });
            setTitulo('');
            setDescricao('');
            fetchConteudos(); // Refresh a lista
        }
    };

    // Variantes de animação para a lista
    const listContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const listItemVariants = {
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
                >
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors">
                        <FaArrowLeft />
                        Voltar para Matérias
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 mb-8">Gerenciar Conteúdos</h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Coluna do Formulário */}
                    <motion.div 
                        className="lg:col-span-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg sticky top-8">
                            <h2 className="text-xl font-bold text-slate-700 mb-5">Adicionar Novo Conteúdo</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="titulo" className="block text-sm font-medium text-slate-600 mb-1">Título</label>
                                    <input 
                                        id="titulo"
                                        value={titulo} 
                                        onChange={e => setTitulo(e.target.value)} 
                                        placeholder="Ex: Introdução a Algoritmos" 
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="descricao" className="block text-sm font-medium text-slate-600 mb-1">Descrição / Link</label>
                                    <textarea 
                                        id="descricao"
                                        value={descricao} 
                                        onChange={e => setDescricao(e.target.value)} 
                                        placeholder="Link para o PDF, vídeo ou breve resumo" 
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                        rows={4}
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <FaPlus /> Adicionar Conteúdo
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Coluna da Lista de Conteúdos */}
                    <motion.div 
                        className="lg:col-span-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold text-slate-700 mb-5">Conteúdos da Matéria</h2>
                            {loading ? (
                                <div className="flex justify-center items-center h-48">
                                    <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                                </div>
                            ) : error ? (
                                <div className="text-center py-10 text-red-500">
                                    <FaExclamationTriangle className="mx-auto text-4xl mb-2" />
                                    <p>{error}</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {conteudos.length > 0 ? (
                                        <motion.ul 
                                            className="space-y-4"
                                            variants={listContainerVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            {conteudos.map(c => (
                                                <motion.li key={c.id} variants={listItemVariants} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                                        <FaBookOpen />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-semibold text-slate-800">{c.titulo}</p>
                                                        <p className="text-sm text-slate-600 break-words">{c.descricao}</p>
                                                    </div>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    ) : (
                                        <div className="text-center py-10 text-slate-500">
                                            <h3 className="text-lg font-semibold">Nenhum conteúdo cadastrado.</h3>
                                            <p>Use o formulário ao lado para começar.</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default GerenciamentoConteudosPage;