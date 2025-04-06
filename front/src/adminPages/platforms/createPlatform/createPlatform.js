import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformService } from '../../../services/platformService';
import { TextField, Button, Box, CircularProgress, Alert } from '@mui/material';

function CreatePlatform() {
  const navigate = useNavigate();
  const [platformData, setPlatformData] = useState({
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlatformData(prev => ({
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
      if (!platformData.name.trim()) {
        throw new Error('O nome da plataforma é obrigatório');
      }

      await PlatformService.createPlatform(platformData);
      setSuccess('Plataforma criada com sucesso!');
      setPlatformData({ name: '' });
      setTimeout(() => navigate('/platformsAdmin'), 1500);
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || 'Dados inválidos');
            break;
          case 409:
            setError('Já existe uma plataforma com este nome');
            break;
          default:
            setError('Erro ao criar a plataforma. Tente novamente.');
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
      color: '#e7ffea'
    }}>
      <h2 style={{
        color: '#26ff00',
        textAlign: 'center',
        marginBottom: '2rem',
        textShadow: '0 0 5px #26ff00'
      }}>Criar Nova Plataforma</h2>

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
          label="Nome da Plataforma"
          variant="outlined"
          fullWidth
          margin="normal"
          name="name"
          value={platformData.name}
          onChange={handleChange}
          required
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
          {isSubmitting ? <CircularProgress size={24} sx={{ color: '#101010' }} /> : 'Criar Plataforma'}
        </Button>
      </form>
    </Box>
  );
}

export default CreatePlatform;