import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GameService } from '../../../services/gameService';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  ThemeProvider,
  createTheme,
  Alert
} from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';

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
  },
});

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
        const gameData = await GameService.getGameById(id);
        setGame(gameData);
      } catch (err) {
        setError('Erro ao carregar dados do jogo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await GameService.deleteGame(id);
      setSuccess('Jogo excluído com sucesso!');
      setTimeout(() => navigate('/gamesAdmin'), 1500);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Jogo não encontrado');
      } else {
        setError('Erro ao excluir o jogo. Tente novamente.');
      }
      console.error(err);
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/gamesAdmin');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ padding: '20px', backgroundColor: darkTheme.palette.background.default, minHeight: '100vh', color: darkTheme.palette.text.primary }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <IconButton color="primary" component={Link} to="/gamesAdmin">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
            Excluir Jogo
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress color="primary" />
          </Box>
        ) : game ? (
          <>
            {error && (
              <Alert severity="error" sx={{ marginBottom: '1rem' }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ marginBottom: '1rem' }}>
                {success}
              </Alert>
            )}

            {!success && (
              <Box sx={{ backgroundColor: darkTheme.palette.background.paper, padding: '20px', borderRadius: '12px' }}>
                <Typography variant="h6" color="textPrimary" gutterBottom>
                  Confirmar exclusão
                </Typography>
                <Box sx={{ backgroundColor: '#282828', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <Typography variant="subtitle1" color="textPrimary">
                    {game.name}
                  </Typography>
                  {game.description && (
                    <Typography variant="body2" color="textSecondary" mt={1}>
                      {game.description}
                    </Typography>
                  )}
                </Box>
                <Alert severity="warning" sx={{ marginBottom: '16px' }}>
                  Atenção! Esta ação é irreversível. Todas as avaliações e dados associados também serão excluídos.
                </Alert>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <Delete />}
                  >
                    {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                  </Button>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ backgroundColor: darkTheme.palette.background.paper, padding: '20px', borderRadius: '12px' }}>
            <Typography variant="body1" color="textPrimary">
              Jogo não encontrado.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{ marginTop: '16px' }}
            >
              Voltar para lista
            </Button>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default DeleteGame;
