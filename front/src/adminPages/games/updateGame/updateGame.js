import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameService } from '../../../services/gameService';
import { GenreService } from '../../../services/genreService';
import { PlatformService } from '../../../services/platformService';
import { DeveloperService } from '../../../services/developerService';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  MenuItem,
  Alert,
  ThemeProvider,
  createTheme
} from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#AEEA00',
      contrastText: '#000000',
    },
    secondary: {
      main: '#7CB342',
      contrastText: '#000000',
    },
    error: {
      main: '#FF5252',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          borderRadius: 12,
        },
      },
    },
  },
});

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
        const [gameRes, genresRes, platformsRes, devsRes] = await Promise.all([
          GameService.getGameById(id),
          GenreService.getGenres(),
          PlatformService.getPlatforms(),
          DeveloperService.getDevelopers()
        ]);

        setGameData({
          name: gameRes.name,
          description: gameRes.description,
          price: gameRes.price,
          genreID: gameRes.genreID,
          platformID: gameRes.platformID,
          developerID: gameRes.developerID
        });

        setGenres(genresRes.data);
        setPlatforms(platformsRes.data);
        setDevelopers(devsRes.data);
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
    setGameData((prev) => ({
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ padding: '24px', minHeight: '100vh', backgroundColor: darkTheme.palette.background.default }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
          Atualizar Jogo
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ backgroundColor: darkTheme.palette.background.paper, p: 3, borderRadius: 2 }}>
              <TextField
                fullWidth
                label="Nome do Jogo"
                name="name"
                value={gameData.name}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={gameData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Preço"
                name="price"
                type="number"
                inputProps={{ step: '0.01', min: 0 }}
                value={gameData.price}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Gênero"
                name="genreID"
                value={gameData.genreID}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              >
                <MenuItem value="">Selecione um gênero</MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Plataforma"
                name="platformID"
                value={gameData.platformID}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              >
                <MenuItem value="">Selecione uma plataforma</MenuItem>
                {platforms.map((platform) => (
                  <MenuItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Desenvolvedor"
                name="developerID"
                value={gameData.developerID}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              >
                <MenuItem value="">Selecione um desenvolvedor</MenuItem>
                {developers.map((dev) => (
                  <MenuItem key={dev.id} value={dev.id}>
                    {dev.name}
                  </MenuItem>
                ))}
              </TextField>

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" onClick={() => navigate('/gamesAdmin')}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Atualizar Jogo
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default UpdateGame;
