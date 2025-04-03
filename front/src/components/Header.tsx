

const Header = () => {
  return (
    <header className="bg-blue-600 p-4 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span>Bem-vindo, Usuário!</span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Logout</button>
        </div>
      </div>
    </header>
  )
}

export default Header
