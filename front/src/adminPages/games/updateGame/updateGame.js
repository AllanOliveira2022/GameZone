import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameService } from '../../../services/gameService'; // Ajuste o caminho conforme sua estrutura
import { GenreService } from '../../../services/genreService';
import { PlatformService } from '../../../services/platformService';
import { DeveloperService } from '../../../services/developerService';

function UpdateGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [gameData, setGameData] = useState({
    name: '',
    description: '',
    price: 0,
    genreID: '',
    platformID: '',
    developerID: ''
  });
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carrega os dados em paralelo
        const [gameResponse, genresRes, platformsRes, developersRes] = await Promise.all([
          GameService.getGameById(id),
          GenreService.getGenres(),
          PlatformService.getPlatforms(),
          DeveloperService.getDevelopers()
        ]);

        setGameData({
          name: gameResponse.name,
          description: gameResponse.description,
          price: gameResponse.price,
          genreID: gameResponse.genreID,
          platformID: gameResponse.platformID,
          developerID: gameResponse.developerID
        });

        setGenres(genresRes.data);
        setPlatforms(platformsRes.data);
        setDevelopers(developersRes.data);
        
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do jogo');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGameData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await GameService.updateGame(id, gameData);
      setSuccess('Jogo atualizado com sucesso!');
      setTimeout(() => navigate('/gamesAdmin'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar o jogo. Tente novamente.');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Atualizar Jogo</h1>
      
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
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nome do Jogo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={gameData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Descrição *
          </label>
          <textarea
            id="description"
            name="description"
            value={gameData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Preço *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={gameData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genreID">
            Gênero *
          </label>
          <select
            id="genreID"
            name="genreID"
            value={gameData.genreID}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Selecione um gênero</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="platformID">
            Plataforma *
          </label>
          <select
            id="platformID"
            name="platformID"
            value={gameData.platformID}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Selecione uma plataforma</option>
            {platforms.map(platform => (
              <option key={platform.id} value={platform.id}>{platform.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="developerID">
            Desenvolvedor *
          </label>
          <select
            id="developerID"
            name="developerID"
            value={gameData.developerID}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Selecione um desenvolvedor</option>
            {developers.map(developer => (
              <option key={developer.id} value={developer.id}>{developer.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Atualizar Jogo
          </button>
          <button
            type="button"
            onClick={() => navigate('/games')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateGame;