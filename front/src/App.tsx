import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AlunosPage from './Pages/AlunosPage';
import ProfessoresPage from './Pages/ProfessoresPage';
import AdminPage from './Pages/AdminPage';
import LoginPage from './Pages/LoginPage';

function App() {
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/alunos"
          element={
            role === 'aluno' ? <AlunosPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/professores"
          element={
            role === 'professor' ? <ProfessoresPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/dashboard-admin"
          element={
            role === 'admin' ? <AdminPage /> : <Navigate to="/" replace />
          }
        />
        {/* rota coringa */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
