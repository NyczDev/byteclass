import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAlunos, Aluno } from '../services/alunoService';
import { getMaterias, Materia } from '../services/materiaService';
import { lancarNota } from '../services/notaService';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserGraduate, FaBook, FaStar, FaPencilAlt, FaPaperPlane, FaSignOutAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Spinner from '../components/Spinner'; // Reutilize o spinner

// --- Componente de Toast Notification ---
const Toast = ({ message, type, onclose }: { message: string; type: 'success' | 'error'; onclose: () => void }) => {
    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-600' : 'bg-red-600';
    const Icon = isSuccess ? FaCheckCircle : FaTimesCircle;

    useEffect(() => {
        const timer = setTimeout(onclose, 5000); // Fecha o toast após 5 segundos
        return () => clearTimeout(timer);
    }, [onclose]);

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-4 p-4 rounded-lg shadow-xl text-white ${bgColor}`}
        >
            <Icon size={24} />
            <p>{message}</p>
        </motion.div>
    );
};


const LancarNotasPage = () => {
    const navigate = useNavigate();
    const { alunoId } = useParams<{ alunoId: string }>();

    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [selectedAluno, setSelectedAluno] = useState<string>(alunoId || '');
    const [selectedMateria, setSelectedMateria] = useState<string>('');
    const [nota, setNota] = useState<string>('');
    const [descricao, setDescricao] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [alunosData, materiasData] = await Promise.all([getAlunos(), getMaterias()]);
                setAlunos(alunosData);
                setMaterias(materiasData);
            } catch (err: any) {
                setError('Falha ao carregar dados. Tente recarregar a página.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (alunoId) setSelectedAluno(alunoId);
    }, [alunoId]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAluno || !selectedMateria || !nota) {
            showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        try {
            await lancarNota(parseInt(selectedMateria), parseInt(selectedAluno), { Valor: parseFloat(nota), Descricao: descricao });
            showToast('Nota lançada com sucesso!', 'success');
            setSelectedMateria('');
            setNota('');
            setDescricao('');
        } catch (err: any) {
            showToast('Erro ao lançar nota: ' + err.message, 'error');
        }
    };

    const formContainerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const formItemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4">
             <AnimatePresence>
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onclose={() => setToast(prev => ({ ...prev, show: false }))}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl mt-8"
            >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                         <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800"><FaArrowLeft size={22} /></button>
                        <h1 className="text-3xl font-bold text-slate-800">Lançamento de Notas</h1>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <FaSignOutAlt /> Sair
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64"><Spinner /></div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500"><p>{error}</p></div>
                ) : (
                    <motion.form onSubmit={handleSubmit} variants={formContainerVariants} initial="hidden" animate="visible">
                        {/* Aluno */}
                        <motion.div variants={formItemVariants} className="mb-5">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Aluno</label>
                            <div className="relative">
                                <FaUserGraduate className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select value={selectedAluno} onChange={(e) => setSelectedAluno(e.target.value)} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
                                    <option value="">Selecione um aluno</option>
                                    {alunos.map((aluno) => <option key={aluno.userId} value={aluno.userId}>{aluno.nome}</option>)}
                                </select>
                            </div>
                        </motion.div>
                        {/* Matéria */}
                        <motion.div variants={formItemVariants} className="mb-5">
                             <label className="block text-sm font-medium text-slate-600 mb-1">Matéria</label>
                             <div className="relative">
                                <FaBook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select value={selectedMateria} onChange={(e) => setSelectedMateria(e.target.value)} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
                                    <option value="">Selecione uma matéria</option>
                                    {materias.map((materia) => <option key={materia.id} value={materia.id}>{materia.nome}</option>)}
                                </select>
                             </div>
                        </motion.div>
                        {/* Nota e Descrição */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <motion.div variants={formItemVariants}>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Nota</label>
                                 <div className="relative">
                                    <FaStar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="number" step="0.1" value={nota} onChange={(e) => setNota(e.target.value)} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" placeholder="Ex: 8.5"/>
                                 </div>
                            </motion.div>
                            <motion.div variants={formItemVariants}>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Descrição (Opcional)</label>
                                 <div className="relative">
                                     <FaPencilAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                     <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" placeholder="Ex: Prova 1"/>
                                 </div>
                            </motion.div>
                        </div>
                        {/* Botão */}
                        <motion.button type="submit" variants={formItemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all">
                            <FaPaperPlane /> Lançar Nota
                        </motion.button>
                    </motion.form>
                )}
            </motion.div>
        </div>
    );
};

export default LancarNotasPage;