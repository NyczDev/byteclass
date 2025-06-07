import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConteudosDaMateria, createConteudo, Conteudo } from '../services/conteudoService';
import { motion } from 'framer-motion';

const GerenciamentoConteudosPage = () => {
    const { materiaId } = useParams<{ materiaId: string }>();
    const navigate = useNavigate();
    const [conteudos, setConteudos] = useState<Conteudo[]>([]);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');

    const fetchConteudos = () => {
        if (materiaId) {
            getConteudosDaMateria(parseInt(materiaId)).then(setConteudos);
        }
    };

    useEffect(fetchConteudos, [materiaId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (materiaId) {
            await createConteudo(parseInt(materiaId), { titulo, descricao });
            setTitulo('');
            setDescricao('');
            fetchConteudos(); // Refresh a lista
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">{"< Voltar"}</button>
            <h1 className="text-2xl font-bold mb-6">Gerenciar Conteúdo da Matéria</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Conteúdo</h2>
                        <div className="space-y-4">
                            <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título do Conteúdo" className="w-full p-2 border rounded" />
                            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição ou link para o material" className="w-full p-2 border rounded" rows={4}></textarea>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Adicionar</button>
                        </div>
                    </form>
                </div>
                <div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Conteúdos Existentes</h2>
                        <ul className="space-y-3">
                            {conteudos.map(c => (
                                <motion.li key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-3 bg-gray-50 rounded shadow-sm">
                                    <p className="font-bold">{c.titulo}</p>
                                    <p className="text-sm text-gray-600">{c.descricao}</p>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GerenciamentoConteudosPage;