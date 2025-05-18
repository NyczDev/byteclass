import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDatanasc] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const usuario = await login(cpf, dataNasc);

      localStorage.setItem('role', usuario.role);

      switch (usuario.role) {
        case 'aluno':
          navigate('/alunos');
          window.location.reload();
          break;
        case 'professor':
          navigate('/professores');
          window.location.reload();
          break;
        case 'admin':
          navigate('/dashboard-admin');
          window.location.reload();
          break;
        default:
          navigate('/');
          break;
      }
    } catch (err: any) {
      localStorage.removeItem('role');
      setErro(err.message || 'Credenciais inválidas');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/fundo-montanhas.jpg")' }}
    >
      <header className="bg-white px-20 py-1 shadow-md flex items-center">
        <img src="/logo.png" alt="Logo ByteClass" className="h-20 mr-2" />
      </header>

      <div className="flex justify-center items-center mt-40">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-md shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-black">
            Bem-vindo de volta!
          </h2>

          <label className="block mb-2 text-sm font-semibold text-black">CPF</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded bg-gray-200 placeholder-gray-500 text-sm focus:outline-none"
            placeholder="Digite seu CPF"
            required
          />

          <label className="block mb-2 text-sm font-semibold text-black">Senha</label>
          <input
            type="password"
            value={dataNasc}
            onChange={(e) => setDatanasc(e.target.value)}
            className="w-full mb-6 px-4 py-2 rounded bg-gray-200 placeholder-gray-500 text-sm focus:outline-none"
            placeholder="Digite sua senha"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded text-sm transition"
          >
            Entrar
          </button>

          {erro && <p className="text-red-600 mt-4 text-sm text-center">{erro}</p>}

          <div className="flex justify-between mt-4 text-xs text-gray-600">
            <Link to="/cadastro" className="hover:underline">
              Ainda não possui uma conta?
            </Link>
            <Link to="/recuperar-senha" className="hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;