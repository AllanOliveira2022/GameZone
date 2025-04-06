import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DeveloperService } from '../../../services/developerService';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  ThemeProvider,
  createTheme,
  Alert,
} from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#AEEA00', contrastText: '#000' },
    secondary: { main: '#7CB342', contrastText: '#000' },
    error: { main: '#FF5252' },
    background: { default: '#121212', paper: '#1E1E1E' },
    text: { primary: '#FFFFFF', secondary: '#B0B0B0' },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
  },
});

function DeleteDeveloper() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const data = await DeveloperService.getDeveloperById(id);
        setDeveloper(data);
      } catch (err) {
        setError('Erro ao carregar dados do desenvolvedor');
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      await DeveloperService.deleteDeveloper(id);
      setSuccess('Desenvolvedor excluído com sucesso!');
      setTimeout(() => navigate('/developers'), 1500);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Desenvolvedor não encontrado.');
      } else {
        setError('Erro ao excluir o desenvolvedor. Tente novamente.');
      }
      setIsDeleting(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ padding: 3, minHeight: '100vh', backgroundColor: 'background.default', color: 'text.primary' }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <IconButton color="primary" component={Link} to="/developers">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Excluir Desenvolvedor
          </Typography>
        </Box>

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

            {!success && developer && (
              <Box sx={{ backgroundColor: 'background.paper', p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Tem certeza que deseja excluir o desenvolvedor abaixo?
                </Typography>

                <Box sx={{ backgroundColor: '#2A2A2A', p: 2, borderRadius: 2, mb: 2 }}>
                  <Typography variant="subtitle1">{developer.name}</Typography>
                  {developer.cnpj && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      CNPJ: {developer.cnpj}
                    </Typography>
                  )}
                  {developer.email && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Email: {developer.email}
                    </Typography>
                  )}
                  {developer.phone && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Telefone: {developer.phone}
                    </Typography>
                  )}
                </Box>

                <Alert severity="warning" sx={{ mb: 2 }}>
                  Atenção: esta ação é irreversível e pode afetar os jogos associados a este desenvolvedor.
                </Alert>

                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={() => navigate('/developers')} disabled={isDeleting}>
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <Delete />}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                  </Button>
                </Box>
              </Box>
            )}

            {!success && !developer && !loading && (
              <Box sx={{ backgroundColor: 'background.paper', p: 3, borderRadius: 2 }}>
                <Typography>Desenvolvedor não encontrado.</Typography>
                <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/developers')}>
                  Voltar
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default DeleteDeveloper;
