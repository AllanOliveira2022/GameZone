import React, { useState, useEffect } from 'react';
import { BuyService } from '../../services/buyService';
import { Navigate } from 'react-router-dom';

function Library() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;

  // Verificação de autenticação via localStorage
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUserPurchases();
  }, [page]);

  const fetchUserPurchases = async () => {
    try {
      setLoading(true);
      
      // Verifica se o usuário está autenticado
      if (!token || !userId) {
        setError("Você precisa estar logado para ver sua biblioteca.");
        setLoading(false);
        return;
      }

      const result = await BuyService.getUserBuys(userId, page, limit);
      setPurchases(result.data);
      setTotalPages(Math.ceil(result.total / limit));
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar jogos da biblioteca:', err);
      setError('Não foi possível carregar sua biblioteca. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Redireciona se não estiver autenticado
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Minha Biblioteca</h1>
      
      {purchases.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700">Sua biblioteca está vazia!</h2>
          <p className="mt-2 text-gray-600">Você ainda não comprou nenhum jogo. Visite nossa loja para encontrar jogos incríveis.</p>
          <button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.href = '/store'}
          >
            Ir para a Loja
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {purchase.game && (
                  <>
                    <div className="relative">
                      <img 
                        src={purchase.game.coverImage || '/placeholder-game.jpg'} 
                        alt={purchase.game.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-3">
                        <h3 className="font-bold text-lg truncate">{purchase.game.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Data da compra: {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">
                          {purchase.game.developer}
                        </span>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-3 rounded"
                          onClick={() => window.location.href = `/play/${purchase.game.id}`}
                        >
                          Jogar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-l-md border ${
                    page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Anterior
                </button>
                <div className="px-4 py-2 bg-blue-600 text-white font-medium border-t border-b">
                  {page} de {totalPages}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-r-md border ${
                    page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Próximo
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Library;