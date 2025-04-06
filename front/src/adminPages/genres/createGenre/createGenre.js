import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenreService } from '../../../services/genreService';
import {
  TextField, Button, Box, CircularProgress, Alert, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
      if (!genreData.name.trim()) {
        throw new Error('O nome do gênero é obrigatório');
      }

      await GenreService.createGenre(genreData);
      setSuccess('Gênero criado com sucesso!');
      setGenreData({ name: '' });

      setTimeout(() => navigate('/genresAdmin'), 1500);
    } catch (err) {
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
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{
      padding: 3,
      backgroundColor: '#101010',
      minHeight: '100vh',
      color: '#e7ffea',
      position: 'relative'
    }}>
      {/* Botão de Voltar */}
      <IconButton
        onClick={() => navigate('/genresAdmin')}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: '#26ff00',
          '&:hover': {
            color: '#32e514',
            backgroundColor: '#1a1a1a'
          }
        }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <h2 style={{
        color: '#26ff00',
        textAlign: 'center',
        marginBottom: '2rem',
        textShadow: '0 0 5px #26ff00'
      }}>Criar Novo Gênero</h2>

      {error && (
        <Alert severity="error" sx={{
          backgroundColor: '#1a1a1a',
          color: '#e7ffea',
          border: '1px solid #ff3e3e',
          marginBottom: '1rem'
        }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{
          backgroundColor: '#1a1a1a',
          color: '#e7ffea',
          border: '1px solid #26ff00',
          marginBottom: '1rem'
        }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome do Gênero"
          variant="outlined"
          fullWidth
          margin="normal"
          name="name"
          value={genreData.name}
          onChange={handleChange}
          required
          inputProps={{
            minLength: 3,
            maxLength: 50
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#32e514',
              },
              '&:hover fieldset': {
                borderColor: '#26ff00',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#26ff00',
              },
              color: '#e7ffea',
            },
            '& .MuiInputLabel-root': {
              color: '#32e514',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#26ff00',
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: '#1fcc00',
            color: '#101010',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#26ff00',
              boxShadow: '0 0 10px #26ff00'
            },
            padding: '12px 0',
            fontSize: '1rem'
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} sx={{ color: '#101010' }} /> : 'Criar Gênero'}
        </Button>
      </form>
    </Box>
  );
}

export default CreateGenre;
