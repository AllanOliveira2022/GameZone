import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GenreService } from '../../../services/genreService'; // Ajuste o caminho conforme sua estrutura

function DeleteGenre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        // Usando o GenreService para buscar o gênero
        const genreData = await GenreService.getGenreById(id);
        setGenre(genreData);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do gênero');
        console.error(err);
        setLoading(false);
      }
    };

    fetchGenre();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    
    try {
      // Usando o GenreService para deletar o gênero
      await GenreService.deleteGenre(id);
      setSuccess('Gênero excluído com sucesso!');
      setTimeout(() => navigate('/genresAdmin'), 1500);
    } catch (err) {
      // Tratamento aprimorado de erros
      if (err.response) {
        switch (err.response.status) {
          case 404:
            setError('Gênero não encontrado');
            break;
          case 409:
            setError('Não é possível excluir - existem jogos associados a este gênero');
            break;
          default:
            setError('Erro ao excluir o gênero. Tente novamente.');
        }
      } else {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      console.error(err);
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/genres');
  };

  if (loading) return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-2">Carregando...</p>
    </div>
  );

  if (!genre) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Gênero não encontrado
        </div>
        <button
          onClick={handleCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Excluir Gênero</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fadeIn">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 animate-fadeIn">
          {success}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-red-600">
            <h2 className="text-xl font-semibold text-white">
              Confirmar exclusão
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">{genre.name}</h3>
              <p className="mt-2 text-sm text-gray-600">ID: {genre.id}</p>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-6 rounded">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold">Atenção!</span>
              <p className="mt-1">Esta ação é irreversível e afetará todos os jogos associados.</p>
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={handleCancel}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ${
                  isDeleting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Excluindo...
                  </>
                ) : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteGenre;