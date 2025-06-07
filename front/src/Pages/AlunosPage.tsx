import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlunos, Aluno } from '../services/alunoService';

const AlunosPage = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const data = await getAlunos();
        setAlunos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAlunos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Dashboard do Aluno</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
        >
          Sair
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3">Lista de Alunos</h2>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">CPF</th>
                <th className="px-4 py-2 text-left">Telefone</th>
                <th className="px-4 py-2 text-left">Responsável</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.userId} className="border-b">
                  <td className="px-4 py-2">{aluno.nome}</td>
                  <td className="px-4 py-2">{aluno.cpf}</td>
                  <td className="px-4 py-2">{aluno.telefone}</td>
                  <td className="px-4 py-2">{aluno.nomeResponsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AlunosPage;