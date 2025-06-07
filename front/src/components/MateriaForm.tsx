import { useState } from 'react';
import { createMateria } from '../services/materiaService';

const MateriaForm = () => {
  const [nome, setNome] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMateria({ Nome: nome, ProfessorId: parseInt(professorId) });
      setMessage('Matéria criada com sucesso!');
      setNome('');
      setProfessorId('');
    } catch (error: any) {
      setMessage('Erro ao criar matéria: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Nova Matéria</h3>
      <div className="mb-2">
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-2 py-1 border rounded" />
      </div>
      <div className="mb-4">
        <label>ID do Professor:</label>
        <input type="number" value={professorId} onChange={(e) => setProfessorId(e.target.value)} required className="w-full px-2 py-1 border rounded" />
      </div>
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Criar</button>
      {message && <p className="mt-2">{message}</p>}
    </form>
  );
};

export default MateriaForm;