import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMateriasDoAluno } from '../services/alunoService';
import { Materia } from '../services/materiaService';
import { getNotasDoAlunoNaMateria, Nota } from '../services/notaService';
import { getConteudosDaMateria, Conteudo } from '../services/conteudoService';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaSignOutAlt, FaClipboardCheck, FaFileAlt, FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const MateriaListSkeleton = () => (
    <div className="space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 rounded-lg"></div>
        ))}
    </div>
);

const MinhasNotasPage = () => {
    const navigate = useNavigate();
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
    const [notas, setNotas] = useState<Nota[]>([]);
    const [conteudos, setConteudos] = useState<Conteudo[]>([]);
    const [loadingMaterias, setLoadingMaterias] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            getMateriasDoAluno(parseInt(userId))
                .then(setMaterias)
                .finally(() => setLoadingMaterias(false));
        } else {
            navigate('/login');
        }
    }, [userId, navigate]);

    const handleSelectMateria = async (materia: Materia) => {
        if (!userId) return;
        
        if (selectedMateria?.id === materia.id) return;

        setSelectedMateria(materia);
        setLoadingDetails(true);

        try {
            const alunoId = parseInt(userId);
            const [notasData, conteudosData] = await Promise.all([
                getNotasDoAlunoNaMateria(materia.id, alunoId),
                getConteudosDaMateria(materia.id)
            ]);
            setNotas(notasData);
            setConteudos(conteudosData);
        } catch (error) {
            console.error("Falha ao buscar detalhes da matéria", error);
        } finally {
            setLoadingDetails(false);
        }
    };
    
    const getNotaStyle = (valor: number) => {
        if (valor >= 7) return { icon: FaCheckCircle, color: 'text-green-500' };
        if (valor >= 5) return { icon: FaExclamationCircle, color: 'text-yellow-500' };
        return { icon: FaTimesCircle, color: 'text-red-500' };
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-slate-800">Painel do Aluno</h1>
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <FaSignOutAlt /> Sair
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Coluna de Matérias */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 bg-white p-6 rounded-xl shadow-lg"
                    >
                        <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <FaBook /> Minhas Matérias
                        </h2>
                        {loadingMaterias ? <MateriaListSkeleton /> : (
                            <ul className="space-y-3">
                                {materias.map(materia => (
                                    <li key={materia.id} onClick={() => handleSelectMateria(materia)}
                                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 font-semibold flex items-center gap-3 ${
                                            selectedMateria?.id === materia.id 
                                            ? 'bg-blue-600 text-white shadow-md' 
                                            : 'bg-slate-100 hover:bg-blue-100 hover:text-blue-800'
                                        }`}
                                    >
                                        <FaBook className={selectedMateria?.id === materia.id ? 'text-white' : 'text-blue-500'}/>
                                        {materia.nome}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>

                    {/* Coluna de Detalhes */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {loadingDetails ? (
                                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center h-full bg-white p-10 rounded-xl shadow-lg">
                                    <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                                </motion.div>
                            ) : selectedMateria ? (
                                <motion.div key={selectedMateria.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                    {/* Card de Notas */}
                                    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                                        <h3 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-3"><FaClipboardCheck /> Notas de {selectedMateria.nome}</h3>
                                        {notas.length > 0 ? (
                                            <ul className="space-y-3">
                                                {notas.map(nota => {
                                                    const { icon: Icon, color } = getNotaStyle(nota.valor);
                                                    return (
                                                        <li key={nota.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                                            <span className="font-medium text-slate-700">{nota.descricao}</span>
                                                            <div className={`flex items-center gap-2 font-bold text-lg ${color}`}>
                                                                <Icon />
                                                                <span>{nota.valor.toFixed(1)}</span>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : <p className="text-slate-500">Nenhuma nota lançada para esta matéria ainda.</p>}
                                    </div>
                                    
                                    {/* Card de Conteúdos */}
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                         <h3 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-3"><FaFileAlt /> Materiais de Apoio</h3>
                                         {conteudos.length > 0 ? (
                                            <ul className="space-y-4">
                                                {conteudos.map(c => (
                                                    <li key={c.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                                           <FaBook />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800">{c.titulo}</p>
                                                            <p className="text-sm text-slate-600 break-words">{c.descricao}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                         ) : <p className="text-slate-500">Nenhum material de apoio cadastrado para esta matéria.</p>}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col justify-center items-center bg-white p-10 rounded-xl shadow-lg h-full text-center">
                                    <FaArrowLeft className="text-4xl text-blue-400 mb-4"/>
                                    <h3 className="text-xl font-semibold text-slate-600">Selecione uma matéria</h3>
                                    <p className="text-slate-500">Escolha uma das suas matérias na lista ao lado para ver suas notas e os materiais de apoio.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MinhasNotasPage;