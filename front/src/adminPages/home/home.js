import React from 'react';
import { Link } from 'react-router-dom';

function HomeAdmin() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel Administrativo</h1>
        
        {/* Seção de Jogos */}
        <div className="mb-12 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Gerenciamento de Jogos</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/createGame" 
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-blue-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Jogo
              </h3>
              <p className="text-sm text-gray-600 mt-1">Cadastre um novo jogo no sistema</p>
            </Link>
            
            <Link 
              to="/updateGame" 
              className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-yellow-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Jogo
              </h3>
              <p className="text-sm text-gray-600 mt-1">Atualize informações de jogos existentes</p>
            </Link>
            
            <Link 
              to="/deleteGame" 
              className="bg-red-50 hover:bg-red-100 p-4 rounded-lg border border-red-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-red-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remover Jogo
              </h3>
              <p className="text-sm text-gray-600 mt-1">Exclua jogos do catálogo</p>
            </Link>
          </div>
        </div>

        {/* Seção de Gêneros */}
        <div className="mb-12 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Gerenciamento de Gêneros</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/createGenre" 
              className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg border border-purple-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-purple-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Gênero
              </h3>
              <p className="text-sm text-gray-600 mt-1">Crie um novo gênero de jogos</p>
            </Link>
            
            <Link 
              to="/updateGenre" 
              className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-yellow-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Gênero
              </h3>
              <p className="text-sm text-gray-600 mt-1">Atualize informações de gêneros</p>
            </Link>
            
            <Link 
              to="/deleteGenre" 
              className="bg-red-50 hover:bg-red-100 p-4 rounded-lg border border-red-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-red-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remover Gênero
              </h3>
              <p className="text-sm text-gray-600 mt-1">Exclua gêneros do sistema</p>
            </Link>
          </div>
        </div>

        {/* Seção de Desenvolvedores */}
        <div className="mb-12 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Gerenciamento de Desenvolvedores</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/createDeveloper" 
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-green-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Desenvolvedor
              </h3>
              <p className="text-sm text-gray-600 mt-1">Cadastre uma nova desenvolvedora</p>
            </Link>
            
            <Link 
              to="/updateDeveloper" 
              className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-yellow-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Desenvolvedor
              </h3>
              <p className="text-sm text-gray-600 mt-1">Atualize informações de desenvolvedores</p>
            </Link>
            
            <Link 
              to="/deleteDeveloper" 
              className="bg-red-50 hover:bg-red-100 p-4 rounded-lg border border-red-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-red-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remover Desenvolvedor
              </h3>
              <p className="text-sm text-gray-600 mt-1">Exclua desenvolvedores do sistema</p>
            </Link>
          </div>
        </div>

        {/* Seção de Plataformas */}
        <div className="mb-12 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-yellow-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Gerenciamento de Plataformas</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/createPlatform" 
              className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-yellow-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Plataforma
              </h3>
              <p className="text-sm text-gray-600 mt-1">Cadastre uma nova plataforma</p>
            </Link>
            
            <Link 
              to="/updatePlatform" 
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-blue-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Plataforma
              </h3>
              <p className="text-sm text-gray-600 mt-1">Atualize informações de plataformas</p>
            </Link>
            
            <Link 
              to="/deletePlatform" 
              className="bg-red-50 hover:bg-red-100 p-4 rounded-lg border border-red-200 transition-colors duration-200"
            >
              <h3 className="font-medium text-red-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remover Plataforma
              </h3>
              <p className="text-sm text-gray-600 mt-1">Exclua plataformas do sistema</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeAdmin;