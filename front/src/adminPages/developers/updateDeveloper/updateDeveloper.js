import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import DeveloperService from '../../../services/developerService';

function UpdateDeveloper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [developerData, setDeveloperData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const response = await DeveloperService.getDeveloperById(id);
        setDeveloperData({
          name: response.data.name || '',
          CNPJ: response.data.CNPJ || '',
          email: response.data.email || '',
          phone: response.data.phone || ''
        });
      } catch (err) {
        setError('Erro ao carregar dados do desenvolvedor.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeveloperData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!developerData.name.trim()) {
      setError('O nome do desenvolvedor é obrigatório');
      setIsSubmitting(false);
      return;
    }

    try {
      await DeveloperService.updateDeveloper(id, developerData);
      setSuccess('Desenvolvedor atualizado com sucesso!');
      setTimeout(() => navigate('/developersAdmin'), 1500);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Desenvolvedor não encontrado');
      } else if (err.response?.status === 400) {
        setError('Dados inválidos. Verifique as informações.');
      } else {
        setError('Erro ao atualizar desenvolvedor. Tente novamente.');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate('/developersAdmin');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box maxWidth={500} mx="auto" mt={6} px={2}>
      <Typography variant="h4" color="white" gutterBottom>
        Editar Desenvolvedor
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#1e1e1e', borderRadius: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome da Empresa *"
            name="name"
            value={developerData.name}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
            margin="normal"
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { color: '#fff' } }}
          />
          <TextField
            label="CNPJ"
            name="cnpj"
            value={developerData.cnpj}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="00.000.000/0000-00"
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { color: '#fff' } }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={developerData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="contato@empresa.com"
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { color: '#fff' } }}
          />
          <TextField
            label="Telefone"
            name="phone"
            type="tel"
            value={developerData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="(00) 00000-0000"
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleCancel}
              disabled={isSubmitting}
              sx={{ borderRadius: 2 }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              sx={{ borderRadius: 2, minWidth: 160 }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Atualizar'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default UpdateDeveloper;
