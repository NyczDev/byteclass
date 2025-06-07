import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfessores, Professor } from '../services/professorService';

const ProfessoresPage = () => {
  const navigate = useNavigate();
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const data = await getProfessores();
        setProfessores(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessores();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Dashboard do Professor</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
        >
          Sair
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3">Lista de Professores</h2>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">CPF</th>
                <th className="px-4 py-2 text-left">Especialidade</th>
                <th className="px-4 py-2 text-left">Formação</th>
              </tr>
            </thead>
            <tbody>
              {professores.map((professor) => (
                <tr key={professor.userId} className="border-b">
                  <td className="px-4 py-2">{professor.nome}</td>
                  <td className="px-4 py-2">{professor.cpf}</td>
                  <td className="px-4 py-2">{professor.especialidade}</td>
                  <td className="px-4 py-2">{professor.formacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProfessoresPage;