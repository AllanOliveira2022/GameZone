import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameService } from '../../services/gameService';
import { GenreService } from '../../services/genreService';
import { PlatformService } from '../../services/platformService';
import { DeveloperService } from '../../services/developerService';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormHelperText,
  CardMedia,
  Chip
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';

function GamesAdmin() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });
  const [filters, setFilters] = useState({
    genreID: '',
    platformID: '',
    developerID: '',
    minPrice: '',
    maxPrice: ''
  });
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [developers, setDevelopers] = useState([]);

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
        console.error('Erro ao carregar dados iniciais:', err);
        setLoading(false);
      }
    };

    const fetchGames = async () => {
      try {
        setLoading(true);
        const params = {
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm
        };
        
        const response = await GameService.getGames(params);
        
        const gamesWithNumericPrice = response.data.map(game => ({
          ...game,
          price: Number(game.price) || 0
        }));
        
        setGames(gamesWithNumericPrice);
        setPagination(prev => ({
          ...prev,
          total: response.total
        }));
      } catch (err) {
        console.error('Erro ao carregar jogos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [filters, pagination.page, pagination.limit, searchTerm]);

  const handleAddGame = () => {
    navigate('/createGame');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      genreID: '',
      platformID: '',
      developerID: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gerenciamento de Jogos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddGame}
        >
          Adicionar Jogo
        </Button>
      </Box>

      {/* Barra de pesquisa */}
      <Box mb={3}>
        <TextField
          variant="outlined"
          placeholder="Pesquisar jogos..."
          fullWidth
          InputProps={{
            startAdornment: <Search sx={{ marginRight: '8px' }} />
          }}
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>

      {/* Filtros */}
      <Box mb={3} display="flex" gap={2} flexWrap="wrap">
        <FormControl sx={{ minWidth: 180 }}>
          <TextField
            select
            label="Gênero"
            name="genreID"
            value={filters.genreID}
            onChange={handleFilterChange}
            SelectProps={{
              native: true
            }}
          >
            <option value="">Todos</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </TextField>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <TextField
            select
            label="Plataforma"
            name="platformID"
            value={filters.platformID}
            onChange={handleFilterChange}
            SelectProps={{
              native: true
            }}
          >
            <option value="">Todas</option>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </TextField>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <TextField
            select
            label="Desenvolvedor"
            name="developerID"
            value={filters.developerID}
            onChange={handleFilterChange}
            SelectProps={{
              native: true
            }}
          >
            <option value="">Todos</option>
            {developers.map((developer) => (
              <option key={developer.id} value={developer.id}>
                {developer.name}
              </option>
            ))}
          </TextField>
        </FormControl>

        <Button variant="outlined" onClick={resetFilters}>
          Limpar Filtros
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : games.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            Nenhum jogo encontrado com os filtros selecionados.
          </Typography>
          <Button
            variant="text"
            onClick={resetFilters}
            sx={{ mt: 2 }}
          >
            Limpar filtros
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {games.map((game) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={game.imageUrl || '/placeholder-game.jpg'}
                    alt={game.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {game.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {game.description?.substring(0, 100)}...
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {game.genre && (
                        <Chip label={game.genre.name} size="small" />
                      )}
                      {game.platform && (
                        <Chip label={game.platform.name} size="small" variant="outlined" />
                      )}
                    </Box>
                    
                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      R$ {game.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/games/${game.id}`)}
                    >
                      Detalhes
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => navigate(`/updateGame/${game.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => navigate(`/deleteGame/${game.id}`)}
                    >
                      Excluir
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box mt={3} display="flex" justifyContent="center">
            <Button
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Anterior
            </Button>
            <Typography sx={{ margin: '0 16px', alignSelf: 'center' }}>
              Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
            </Typography>
            <Button
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Próxima
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default GamesAdmin;