import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import DeveloperService from '../../../services/developerService'; // ajuste o caminho conforme sua estrutura

function CreateDeveloper() {
  const navigate = useNavigate();
  const [developerData, setDeveloperData] = useState({
    name: '',
    CNPJ: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeveloperData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await DeveloperService.createDeveloper(developerData);
      setSuccess('Desenvolvedor cadastrado com sucesso!');
      setDeveloperData({ name: '', CNPJ: '', email: '', phone: '' });
      setTimeout(() => navigate('/developersAdmin'), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao cadastrar desenvolvedor.';
      setError(msg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate('/developersadmin');

  return (
    <Box maxWidth={500} mx="auto" mt={6} px={2}>
      <Typography variant="h4" color="white" gutterBottom>
        Novo Desenvolvedor
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#1e1e1e', borderRadius: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome da Empresa"
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
            name="CNPJ"
            value={developerData.CNPJ}
            onChange={handleChange}
            fullWidth
            required
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
            required
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
            required
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
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default CreateDeveloper;
