import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { PlatformService } from '../../services/platformService';

function PlatformsAdmin() {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    fetchPlatforms();
  }, [pagination.page, pagination.limit, searchTerm]);

  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      };
      
      const result = await PlatformService.getPlatforms(filters);
      setPlatforms(result.data);
      setPagination(prev => ({
        ...prev,
        total: result.total
      }));
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlatform = () => {
    navigate('/createPlatform'); // Redireciona para a tela de criação
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
        <Typography variant="h4">Gerenciamento de Plataformas</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddPlatform}
        >
          Adicionar Plataforma
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          variant="outlined"
          placeholder="Pesquisar plataformas..."
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
            {platforms.map((platform) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={platform.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {platform.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {platform.description || 'Sem descrição'}
                    </Typography>
                    <Box mt={2} display="flex" gap={1}>
                      <button
                        onClick={() => navigate(`/updatePlatform/${platform.id}`)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => navigate(`/deletePlatform/${platform.id}`)}
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
    </div>
  );
}

export default PlatformsAdmin;