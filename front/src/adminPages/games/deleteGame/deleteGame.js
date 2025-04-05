import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameService } from '../../../services/gameService'; // Ajuste o caminho conforme sua estrutura

function DeleteGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        // Usando o GameService para buscar o jogo
        const gameData = await GameService.getGameById(id);
        setGame(gameData);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do jogo');
        console.error(err);
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    
    try {
      // Usando o GameService para deletar o jogo
      await GameService.deleteGame(id);
      setSuccess('Jogo excluído com sucesso!');
      setTimeout(() => navigate('/games'), 1500);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Jogo não encontrado');
      } else {
        setError('Erro ao excluir o jogo. Tente novamente.');
      }
      console.error(err);
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/games');
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  if (!game) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Jogo não encontrado
        </div>
        <button
          onClick={handleCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Excluir Jogo</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Você tem certeza que deseja excluir o jogo abaixo?
            </h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium">{game.name}</h3>
              {game.description && (
                <p className="text-gray-600 mt-2">{game.description}</p>
              )}
            </div>
            
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              <p>Atenção: Esta ação é irreversível!</p>
              <p className="mt-1">Todas as avaliações e itens de compra relacionados também serão excluídos.</p>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handleCancel}
                disabled={isDeleting}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`${isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DeleteGame;