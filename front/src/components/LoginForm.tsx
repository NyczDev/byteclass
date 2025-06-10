import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaIdCard, FaLock, FaSignInAlt, FaSpinner } from 'react-icons/fa';

const LoginForm = () => {
    const [cpf, setCpf] = useState('');
    const [dataNasc, setDatanasc] = useState('');
    const [erro, setErro] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setIsLoading(true);
        try {
            const usuario = await login(cpf, dataNasc);

            localStorage.setItem('role', usuario.role);
            localStorage.setItem('userId', usuario.id.toString());
            
            // Navega para a rota apropriada. A recarga da página não é necessária
            // em SPAs e foi removida para uma melhor experiência do usuário.
           switch (usuario.role) {
                case 'aluno':
                    navigate('/minhas-notas');
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
            localStorage.clear();
            setErro(err.message || 'CPF ou Senha inválidos. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-xl overflow-hidden">
                {/* Painel Esquerdo - Branding */}
                <div className="hidden md:flex flex-col items-center justify-center p-12 bg-blue-600 text-gray-800" style={{backgroundImage: 'url(/path-to-your-background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                    <div className="bg-white bg-opacity-40 p-8 rounded-lg text-center">
                        <img src="/logo.png" alt="Logo ByteClass" className="h-20 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2">Bem-vindo à ByteClass</h1>
                        <p className="text-gray-400">Sua plataforma de gestão acadêmica.</p>
                    </div>
                </div>

                {/* Painel Direito - Formulário */}
                <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
                    <motion.form
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        onSubmit={handleLogin}
                    >
                        <h2 className="text-3xl font-bold mb-2 text-slate-800">Acesse sua Conta</h2>
                        <p className="text-slate-500 mb-8">Insira seus dados para continuar.</p>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-600 mb-1">CPF</label>
                            <div className="relative">
                                <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" placeholder="000.000.000-00"/>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Senha (Data de Nascimento)</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="password" value={dataNasc} onChange={(e) => setDatanasc(e.target.value)} required className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" placeholder="DDMMYYYY"/>
                            </div>
                        </div>

                        {erro && <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md text-sm mb-6">{erro}</div>}

                        <motion.button
                            type="submit" disabled={isLoading}
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all disabled:bg-blue-400"
                        >
                            {isLoading ? <FaSpinner className="animate-spin" /> : <FaSignInAlt />}
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </motion.button>

                         <div className="flex justify-between mt-6 text-sm text-slate-600">
                            <Link to="/cadastro" className="hover:underline hover:text-blue-600">Criar uma conta</Link>
                            <Link to="/recuperar-senha" className="hover:underline hover:text-blue-600">Esqueceu a senha?</Link>
                        </div>
                    </motion.form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;