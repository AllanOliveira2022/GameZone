import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GenreService } from '../../../services/genreService';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  ThemeProvider,
  createTheme,
  Alert
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';

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

function UpdateGenre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genreData, setGenreData] = useState({ name: '' });

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const genre = await GenreService.getGenreById(id);
        setGenreData({ name: genre.name });
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do gênero');
        console.error(err);
        setLoading(false);
      }
    };

    fetchGenre();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenreData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!genreData.name.trim()) {
      setError('O nome do gênero é obrigatório');
      setIsSubmitting(false);
      return;
    }

    try {
      await GenreService.updateGenre(id, genreData);
      setSuccess('Gênero atualizado com sucesso!');
      setTimeout(() => navigate('/genresAdmin'), 1500);
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || 'Dados inválidos');
            break;
          case 404:
            setError('Gênero não encontrado');
            break;
          case 409:
            setError('Já existe um gênero com este nome');
            break;
          default:
            setError('Erro ao atualizar o gênero. Tente novamente.');
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
    navigate('/genresAdmin');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ padding: '20px', backgroundColor: darkTheme.palette.background.default, minHeight: '100vh', color: darkTheme.palette.text.primary }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <IconButton color="primary" component={Link} to="/genresAdmin">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
            Atualizar Gênero
          </Typography>
        </Box>

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

        <Box component="form" onSubmit={handleSubmit} sx={{ backgroundColor: darkTheme.palette.background.paper, padding: '20px', borderRadius: '12px' }}>
          <Typography variant="h6" color="textPrimary" gutterBottom>
            Editar Gênero
          </Typography>

          <TextField
            label="Nome do Gênero"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={genreData.name}
            onChange={handleChange}
            required
            inputProps={{ minLength: 3, maxLength: 50 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: darkTheme.palette.text.secondary,
                },
                '&:hover fieldset': {
                  borderColor: darkTheme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: darkTheme.palette.primary.main,
                },
                color: darkTheme.palette.text.primary,
              },
              '& .MuiInputLabel-root': {
                color: darkTheme.palette.text.secondary,
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: darkTheme.palette.primary.main,
              },
            }}
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
            >
              {isSubmitting ? 'Atualizando...' : 'Atualizar Gênero'}
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default UpdateGenre;
