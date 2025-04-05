import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenreService } from '../../../services/genreService'; // Ajuste o caminho conforme sua estrutura

function CreateGenre() {
  const navigate = useNavigate();
  const [genreData, setGenreData] = useState({
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenreData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Usando o GenreService para criar o gênero
      await GenreService.createGenre(genreData);
      setSuccess('Gênero criado com sucesso!');
      setGenreData({ name: '' }); // Limpa o formulário
      
      // Redireciona após 1.5 segundos
      setTimeout(() => navigate('/genres'), 1500);
    } catch (err) {
      // Tratamento específico de erros baseado na resposta da API
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || 'Dados inválidos');
            break;
          case 409:
            setError('Um gênero com este nome já existe');
            break;
          default:
            setError('Erro ao criar o gênero. Tente novamente.');
        }
      } else {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/genres');
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Gênero</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nome do Gênero *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={genreData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: Ação, RPG, FPS..."
            required
            autoFocus
            minLength={3}
            maxLength={50}
          />
          <p className="text-gray-500 text-xs italic mt-1">* Campo obrigatório (3-50 caracteres)</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </>
            ) : 'Criar Gênero'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGenre;