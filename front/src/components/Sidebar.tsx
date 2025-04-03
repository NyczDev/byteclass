import { useState } from 'react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      {/* Botão para abrir/fechar a sidebar em dispositivos móveis */}
      <button
        className="lg:hidden p-4 text-white bg-blue-600 rounded-md"
        onClick={toggleSidebar}
      >
        {isOpen ? "Fechar" : "Abrir"} Sidebar
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-50 lg:bg-transparent lg:static lg:block transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`w-64 h-full bg-gray-800 text-white p-6 transition-all duration-300 lg:w-60 lg:block ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <h2 className="text-2xl font-bold mb-6">Sidebar</h2>
          <ul>
            <li className="mb-4">
              <a href="#" className="hover:text-blue-400">Dashboard</a>
            </li>
            <li className="mb-4">
              <a href="#" className="hover:text-blue-400">Sobre</a>
            </li>
            <li className="mb-4">
              <a href="#" className="hover:text-blue-400">Contato</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
