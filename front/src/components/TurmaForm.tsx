import { useState } from 'react';
import { createTurma } from '../services/turmaService';

const TurmaForm = () => {
  const [nome, setNome] = useState('');
  const [periodoLetivo, setPeriodoLetivo] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTurma({ Nome: nome, PeriodoLetivo: periodoLetivo });
      setMessage('Turma criada com sucesso!');
      setNome('');
      setPeriodoLetivo('');
    } catch (error: any) {
      setMessage('Erro ao criar turma: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Nova Turma</h3>
      <div className="mb-2">
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-2 py-1 border rounded" />
      </div>
      <div className="mb-4">
        <label>Período Letivo:</label>
        <input type="text" value={periodoLetivo} onChange={(e) => setPeriodoLetivo(e.target.value)} required className="w-full px-2 py-1 border rounded" />
      </div>
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Criar</button>
      {message && <p className="mt-2">{message}</p>}
    </form>
  );
};

export default TurmaForm;