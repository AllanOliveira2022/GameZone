import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { DeveloperService } from '../../services/developerService';
import { useNavigate } from 'react-router-dom';

function DevelopersAdmin() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDevelopers();
  }, [pagination.page, pagination.limit]);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const result = await DeveloperService.getDevelopers({
        page: pagination.page,
        limit: pagination.limit
      });
      
      setDevelopers(result.data);
      setPagination(prev => ({
        ...prev,
        total: result.total
      }));
    } catch (error) {
      console.error('Failed to fetch developers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleEditDeveloper = (developerId) => {
    navigate(`/updateDeveloper/${developerId}`);
  };

  const handleDeleteDeveloper = (developerId) => {
    navigate(`/deleteDeveloper/${developerId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gerenciamento de Desenvolvedoras</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/createDeveloper')}
        >
          Adicionar
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {developers.map((developer) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={developer.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {developer.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      CNPJ: {developer.cnpj || 'Não informado'}
                    </Typography>
                    <Typography variant="body2">
                      {developer.description || 'Sem descrição'}
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Edit />}
                        onClick={() => handleEditDeveloper(developer.id)}
                        size="small"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteDeveloper(developer.id)}
                        size="small"
                      >
                        Deletar
                      </Button>
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

export default DevelopersAdmin;