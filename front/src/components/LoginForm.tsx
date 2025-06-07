import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
            localStorage.setItem('userId', usuario.id.toString());

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
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
            setErro(err.message || 'Credenciais inválidas');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, delayChildren: 0.3 } },
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
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: 'url("/fundo-montanhas.jpg")' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.6 } }}
                className="absolute top-0 left-0 w-full bg-white px-20 py-4 shadow-md flex items-center justify-start"
            >
                <img src="/logo.png" alt="Logo ByteClass" className="h-16 mr-4" />
            </motion.header>

            <motion.form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-md shadow-lg w-full max-w-sm"
                variants={formVariants}
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Bem-vindo de volta!</h2>

                <label className="block mb-2 text-sm font-semibold text-gray-700">CPF</label>
                <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full mb-4 px-4 py-2 rounded border focus:outline-none focus:border-blue-500"
                    placeholder="Digite seu CPF"
                    required
                />

                <label className="block mb-2 text-sm font-semibold text-gray-700">Senha</label>
                <input
                    type="password"
                    value={dataNasc}
                    onChange={(e) => setDatanasc(e.target.value)}
                    className="w-full mb-6 px-4 py-2 rounded border focus:outline-none focus:border-blue-500"
                    placeholder="Digite sua senha"
                    required
                />

                <motion.button
                    type="submit"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded text-sm transition duration-150"
                >
                    Entrar
                </motion.button>

                {erro && <p className="text-red-600 mt-4 text-sm text-center">{erro}</p>}

                <div className="flex justify-between mt-4 text-xs text-gray-600">
                    <Link to="/cadastro" className="hover:underline">Ainda não possui uma conta?</Link>
                    <Link to="/recuperar-senha" className="hover:underline">Esqueceu a senha?</Link>
                </div>
            </motion.form>
        </motion.div>
    );
};

export default LoginForm;