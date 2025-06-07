import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
 
import LoginPage from './Pages/LoginPage';
import ProfessoresPage from './Pages/ProfessoresPage';
import MinhasNotasPage from './Pages/MinhasNotasPage';
import LancarNotasPage from './Pages/LancarNotasPage';
import AdminPage from './Pages/AdminPage';
import GerenciamentoProfessores from './Pages/GerenciamentoProfessores';
import GerenciamentoAlunos from './Pages/GerenciamentoAlunos';
import GerenciamentoMaterias from './Pages/GerenciamentoMaterias';
import GerenciamentoTurmas from './Pages/GerenciamentoTurmas';
import GerenciamentoConteudosPage from './Pages/GerenciamentoConteudosPage'; // Nova página

interface RequireAuthProps {
  role: string;
  allowedRoles: string[];
  children: ReactNode;
}

function RequireAuth({ role, allowedRoles, children }: RequireAuthProps) {
  return allowedRoles.includes(role) ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  const role = localStorage.getItem('role') ?? '';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Rota do Aluno */}
        <Route path="/minhas-notas" element={<RequireAuth role={role} allowedRoles={['aluno']}><MinhasNotasPage /></RequireAuth>} />
        
        {/* Rotas do Professor */}
        <Route path="/professores" element={<RequireAuth role={role} allowedRoles={['professor']}><ProfessoresPage /></RequireAuth>} />
        <Route path="/lancar-notas" element={<RequireAuth role={role} allowedRoles={['professor']}><LancarNotasPage /></RequireAuth>}>
          <Route path=":alunoId" element={<LancarNotasPage />} />
        </Route>
        <Route path="/materias/:materiaId/conteudos" element={<RequireAuth role={role} allowedRoles={['professor', 'admin']}><GerenciamentoConteudosPage /></RequireAuth>} />

        {/* Rotas do Admin */}
        <Route path="/dashboard-admin" element={<RequireAuth role={role} allowedRoles={['admin']}><AdminPage /></RequireAuth>} />
        <Route path="/admin/professores" element={<RequireAuth role={role} allowedRoles={['admin']}><GerenciamentoProfessores /></RequireAuth>} />
        <Route path="/admin/alunos" element={<RequireAuth role={role} allowedRoles={['admin']}><GerenciamentoAlunos /></RequireAuth>} />
        <Route path="/admin/materias" element={<RequireAuth role={role} allowedRoles={['admin']}><GerenciamentoMaterias /></RequireAuth>} />
        <Route path="/admin/turmas" element={<RequireAuth role={role} allowedRoles={['admin']}><GerenciamentoTurmas /></RequireAuth>} />

        {/* Rota Padrão */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;