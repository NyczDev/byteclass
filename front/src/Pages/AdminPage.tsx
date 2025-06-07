import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdmins, Admin } from '../services/adminService';

const AdminPage = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAdmins();
        setAdmins(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Painel de Administração</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
        >
          Sair
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3">Lista de Administradores</h2>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">CPF</th>
                <th className="px-4 py-2 text-left">Data de Nascimento</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.userId} className="border-b">
                  <td className="px-4 py-2">{admin.nome}</td>
                  <td className="px-4 py-2">{admin.cpf}</td>
                  <td className="px-4 py-2">{admin.dataNascimento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPage;