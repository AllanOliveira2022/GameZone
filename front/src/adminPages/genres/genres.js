import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenreService } from '../../services/genreService';
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
  FormHelperText
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';

function GenresAdmin() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({
    name: false
  });

  useEffect(() => {
    fetchGenres();
  }, [pagination.page, pagination.limit, searchTerm]);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      };
      
      const result = await GenreService.getGenres(filters);
      setGenres(result.data);
      setPagination(prev => ({
        ...prev,
        total: result.total
      }));
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGenre = () => {
    navigate('/createGenre');
  };

  const handleSaveGenre = async () => {
    if (!formData.name.trim()) {
      setErrors({ name: true });
      return;
    }

    try {
      await GenreService.createGenre(formData);
      setOpenDialog(false);
      fetchGenres();
    } catch (error) {
      console.error('Failed to save genre:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'name' && errors.name) {
      setErrors({ name: false });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gerenciamento de Gêneros</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddGenre}
        >
          Adicionar Gênero
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          variant="outlined"
          placeholder="Pesquisar gêneros..."
          fullWidth
          InputProps={{
            startAdornment: <Search style={{ marginRight: '8px' }} />
          }}
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {genres.map((genre) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={genre.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {genre.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {genre.description || 'Sem descrição'}
                    </Typography>
                    <Box mt={2} display="flex" gap={1}>
                      {/* Botão de Editar - Navega para a rota de edição */}
                      <button
                        onClick={() => navigate(`/updateGenre/${genre.id}`)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded"
                      >
                        Editar
                      </button>
                      
                      {/* Botão de Deletar - Navega para a rota de exclusão */}
                      <button
                        onClick={() => navigate(`/deleteGenre/${genre.id}`)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                      >
                        Deletar
                      </button>
                    </Box>
                  </CardContent>
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
            <Typography style={{ margin: '0 16px', alignSelf: 'center' }}>
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

      {/* Modal apenas para adicionar novo gênero (se ainda necessário) */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Gênero</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <FormControl fullWidth error={errors.name} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Nome do Gênero"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                error={errors.name}
              />
              {errors.name && (
                <FormHelperText>O nome do gênero é obrigatório</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              multiline
              rows={4}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveGenre} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GenresAdmin;