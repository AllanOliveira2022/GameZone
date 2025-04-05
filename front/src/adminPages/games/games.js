import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameService } from '../../services/gameService';
import { GenreService } from '../../services/genreService';
import { PlatformService } from '../../services/platformService';
import { DeveloperService } from '../../services/developerService';

function GamesAdmin() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        genreID: '',
        platformID: '',
        developerID: '',
        minPrice: '',
        maxPrice: '',
        search: '',
        page: 1,
        limit: 12
    });
    const resetFilters = () => {
        setFilters({
            genreID: '',
            platformID: '',
            developerID: '',
            minPrice: '',
            maxPrice: '',
            search: '',
            page: 1,
            limit: 12
        });
    };
    const [totalGames, setTotalGames] = useState(0);
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [genresRes, platformsRes, developersRes] = await Promise.all([
                    GenreService.getGenres(),
                    PlatformService.getPlatforms(),
                    DeveloperService.getDevelopers()
                ]);

                setGenres(genresRes.data);
                setPlatforms(platformsRes.data);
                setDevelopers(developersRes.data);
                
                fetchGames();
            } catch (err) {
                setError('Erro ao carregar dados iniciais');
                console.error(err);
                setLoading(false);
            }
        };

        const fetchGames = async () => {
            try {
                setLoading(true);
                const response = await GameService.getGames(filters);
                
                // Garante que o preço seja um número
                const gamesWithNumericPrice = response.data.map(game => ({
                    ...game,
                    price: Number(game.price) || 0
                }));
                
                setGames(gamesWithNumericPrice);
                setTotalGames(response.total);
                setLoading(false);
            } catch (err) {
                setError('Erro ao carregar jogos');
                console.error(err);
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [filters]);

    // ... (restante do código permanece igual até a parte de renderização)

    return (
        <div className="container mx-auto px-4 py-8">
            {/* ... (código anterior permanece igual) */}

            {/* Lista de jogos */}
            {games.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">Nenhum jogo encontrado com os filtros selecionados.</p>
                    <button
                        onClick={resetFilters}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Limpar filtros
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {games.map((game) => (
                            <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    {game.imageUrl ? (
                                        <img 
                                            src={game.imageUrl} 
                                            alt={game.name} 
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-500">Sem imagem</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{game.name}</h3>
                                    <p className="text-gray-600 mb-3 line-clamp-2">{game.description}</p>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-bold text-blue-600">
                                            {/* Garante que o preço seja formatado corretamente */}
                                            R$ {typeof game.price === 'number' ? game.price.toFixed(2) : '0.00'}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {game.platform?.name || 'Plataforma não especificada'}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            onClick={() => navigate(`/games/${game.id}`)}
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                                        >
                                            Ver Detalhes
                                        </button>
                                        
                                        {/* Botão de Editar */}
                                        <button
                                            onClick={() => navigate(`/updateGame/${game.id}`)}
                                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded"
                                        >
                                            Editar
                                        </button>
                                        
                                        {/* Botão de Deletar */}
                                        <button
                                            onClick={() => navigate(`/deleteGame/${game.id}`)}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                                        >
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ... (restante do código permanece igual) */}
                </>
            )}
        </div>
    );
}

export default GamesAdmin;