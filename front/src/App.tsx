import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AlunosPage from './Pages/AlunosPage';
import ProfessoresPage from './Pages/ProfessoresPage';
import AdminPage from './Pages/AdminPage';
import LoginPage from './Pages/LoginPage';
import TurmasPage from './Pages/TurmasPage';
import MateriasPage from './Pages/MateriasPage';

import { ReactNode } from 'react';

interface RequireAuthProps {
  role: string;
  allowedRole: string;
  children: ReactNode;
}

function RequireAuth({ role, allowedRole, children }: RequireAuthProps) {
  return role === allowedRole ? children : <Navigate to="/" replace />;
}

function App() {
  const role = localStorage.getItem('role') ?? '';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/alunos"
          element={
            <RequireAuth role={role} allowedRole="aluno">
              <AlunosPage />
            </RequireAuth>
          }
        />
        <Route
          path="/professores"
          element={
            <RequireAuth role={role} allowedRole="professor">
              <ProfessoresPage />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard-admin"
          element={
            <RequireAuth role={role} allowedRole="admin">
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route
          path="/turmas"
          element={
            <RequireAuth role={role} allowedRole="admin">
              <TurmasPage />
            </RequireAuth>
          }
        />
        <Route
          path="/materias"
          element={
            <RequireAuth role={role} allowedRole="admin">
              <MateriasPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;