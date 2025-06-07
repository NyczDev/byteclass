import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAlunos, Aluno } from '../services/alunoService';
import { getMaterias, Materia } from '../services/materiaService';
import { lancarNota } from '../services/notaService';
import { motion } from 'framer-motion';

const LancarNotasPage = () => {
  const navigate = useNavigate();
  const { alunoId } = useParams<{ alunoId: string }>(); // Captura o ID da URL
  
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<string>(alunoId || '');
  const [selectedMateria, setSelectedMateria] = useState<string>('');
  const [nota, setNota] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alunosData, materiasData] = await Promise.all([
          getAlunos(),
          getMaterias(),
        ]);
        setAlunos(alunosData);
        setMaterias(materiasData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Atualiza o aluno selecionado se o ID da URL mudar
  useEffect(() => {
    if (alunoId) {
      setSelectedAluno(alunoId);
    }
  }, [alunoId]);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAluno || !selectedMateria || !nota) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await lancarNota(
        parseInt(selectedMateria),
        parseInt(selectedAluno),
        { Valor: parseFloat(nota), Descricao: descricao }
      );
      setMessage('Nota lançada com sucesso!');
      // Limpa os campos após o sucesso, mas mantém o aluno selecionado se veio da URL
      setSelectedMateria('');
      setNota('');
      setDescricao('');
    } catch (err: any) {
      setMessage('Erro ao lançar nota: ' + err.message);
    }
  };

  const formVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 bg-gray-100 min-h-screen flex justify-center items-center"
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        variants={formVariants}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Lançamento de Notas</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition duration-150"
          >
            Sair
          </motion.button>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-4">Lançar Nova Nota</h2>
        {loading && <p className="text-gray-600">Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Aluno</label>
              <select
                value={selectedAluno}
                onChange={(e) => setSelectedAluno(e.target.value)}
                className="w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500 bg-gray-50"
              >
                <option value="">Selecione um aluno</option>
                {alunos.map((aluno) => (
                  <option key={aluno.userId} value={aluno.userId}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Matéria</label>
              <select
                value={selectedMateria}
                onChange={(e) => setSelectedMateria(e.target.value)}
                className="w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500 bg-gray-50"
              >
                <option value="">Selecione uma matéria</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nota</label>
              <input
                type="number"
                step="0.1"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500"
                placeholder="Digite a nota"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Descrição</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500"
                placeholder="Ex: Prova 1, Trabalho em grupo"
              />
            </div>
            <motion.button
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded text-sm transition duration-150"
            >
              Lançar Nota
            </motion.button>
            {message && <p className="mt-4 text-center text-green-600">{message}</p>}
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LancarNotasPage;