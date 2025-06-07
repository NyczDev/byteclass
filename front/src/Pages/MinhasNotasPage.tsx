import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMateriasDoAluno } from '../services/alunoService';
import { Materia } from '../services/materiaService';
import { getNotasDoAlunoNaMateria, Nota } from '../services/notaService';
import { getConteudosDaMateria, Conteudo } from '../services/conteudoService';
import { motion, AnimatePresence } from 'framer-motion';

const MinhasNotasPage = () => {
    const navigate = useNavigate();
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
    const [notas, setNotas] = useState<Nota[]>([]);
    const [conteudos, setConteudos] = useState<Conteudo[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            getMateriasDoAluno(parseInt(userId))
                .then(setMaterias)
                .finally(() => setLoading(false));
        }
    }, [userId]);

    const handleSelectMateria = async (materia: Materia) => {
        if (!userId) return;
        setSelectedMateria(materia);
        setNotas([]);
        setConteudos([]);
        const alunoId = parseInt(userId);
        const [notasData, conteudosData] = await Promise.all([
            getNotasDoAlunoNaMateria(materia.id, alunoId),
            getConteudosDaMateria(materia.id)
        ]);
        setNotas(notasData);
        setConteudos(conteudosData);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Painel do Aluno</h1>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sair</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Coluna de Matérias */}
                <div className="md:col-span-1">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Minhas Matérias</h2>
                        {loading ? <p>Carregando...</p> : (
                            <ul className="space-y-2">
                                {materias.map(materia => (
                                    <li key={materia.id} onClick={() => handleSelectMateria(materia)}
                                        className={`p-3 rounded-lg cursor-pointer transition ${selectedMateria?.id === materia.id ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-200'}`}>
                                        {materia.nome}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Coluna de Detalhes */}
                <div className="md:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedMateria ? (
                            <motion.div key={selectedMateria.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                {/* Tabela de Notas */}
                                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Notas de {selectedMateria.nome}</h3>
                                    <table className="min-w-full">
                                        <thead><tr><th className="py-2 text-left">Descrição</th><th className="py-2 text-left">Nota</th></tr></thead>
                                        <tbody>
                                            {notas.map(nota => <tr key={nota.id}><td className="py-2">{nota.descricao}</td><td>{nota.valor}</td></tr>)}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Lista de Conteúdos */}
                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Conteúdos da Matéria</h3>
                                    <ul className="space-y-3">
                                        {conteudos.map(c => <li key={c.id} className="p-3 bg-gray-50 rounded"><strong>{c.titulo}</strong><p className="text-sm text-gray-600">{c.descricao}</p></li>)}
                                    </ul>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex justify-center items-center bg-white p-10 rounded-lg shadow-md h-full">
                                <p className="text-gray-500">Selecione uma matéria para ver os detalhes.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MinhasNotasPage;