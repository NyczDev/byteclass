

const Dashboard = () => {
  return (
    <main className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-700">Total de provas</h3>
          <p className="text-2xl text-blue-600">200</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-700">Professores</h3>
          <p className="text-2xl text-green-600">20</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-700">Alunos</h3>
          <p className="text-2xl text-yellow-600">320</p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
