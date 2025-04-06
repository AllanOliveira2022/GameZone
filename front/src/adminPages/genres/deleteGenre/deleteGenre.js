import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GenreService } from '../../../services/genreService';
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
      await GenreService.deleteGenre(id);
      setSuccess('Gênero excluído com sucesso!');
      setTimeout(() => navigate('/genresAdmin'), 1500);
    } catch (err) {
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
    navigate('/genresAdmin');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ padding: '20px', backgroundColor: darkTheme.palette.background.default, minHeight: '100vh', color: darkTheme.palette.text.primary }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <IconButton color="primary" component={Link} to="/genresAdmin">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
            Excluir Gênero
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress color="primary" />
          </Box>
        ) : genre ? (
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
                    {genre.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {genre.id}
                  </Typography>
                </Box>
                <Alert severity="warning" sx={{ marginBottom: '16px' }}>
                  Atenção! Esta ação é irreversível e afetará todos os jogos associados.
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
              Gênero não encontrado.
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

export default DeleteGenre;
