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
  CircularProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import { Add, Search, ShoppingCart, AttachMoney, Person } from '@mui/icons-material';
import { BuyService } from '../../services/buyService';

function BuysAdmin() {
  const navigate = useNavigate();
  const [buys, setBuys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    fetchBuys();
  }, [pagination.page, pagination.limit, searchTerm]);

  const fetchBuys = async () => {
    try {
      setLoading(true);
      const result = await BuyService.getBuys(pagination.page, pagination.limit);
      setBuys(result.data);
      setPagination(prev => ({
        ...prev,
        total: result.total
      }));
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBuy = () => {
    navigate('/createBuy');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const calculateTotal = (games) => {
    return games.reduce((total, game) => total + (game.price * game.quantity), 0);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gerenciamento de Vendas</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddBuy}
        >
          Registrar Venda
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          variant="outlined"
          placeholder="Pesquisar vendas..."
          fullWidth
          InputProps={{
            startAdornment: <Search sx={{ marginRight: '8px' }} />
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
            {buys.map((buy) => (
              <Grid item xs={12} key={buy.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box>
                        <Typography variant="h6" component="span" sx={{ mr: 2 }}>
                          Venda #{buy.id}
                        </Typography>
                        <Chip 
                          label={formatDate(buy.createdAt)} 
                          size="small" 
                          color="info"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="h6" color="primary">
                        Total: R$ {calculateTotal(buy.games).toFixed(2)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={2}>
                      <Person color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Cliente: {buy.user?.name || 'Anônimo'}
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Itens da compra:
                    </Typography>
                    
                    <List dense sx={{ mb: 2 }}>
                      {buy.games.map((game, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar src={game.imageUrl} variant="square">
                                <SportsEsports />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={game.name}
                              secondary={`${game.quantity}x R$ ${game.price.toFixed(2)}`}
                            />
                            <Typography variant="body2">
                              R$ {(game.price * game.quantity).toFixed(2)}
                            </Typography>
                          </ListItem>
                          {index < buy.games.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))}
                    </List>

                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => navigate(`/buys/${buy.id}`)}
                      >
                        Detalhes
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => navigate(`/updateBuy/${buy.id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => navigate(`/deleteBuy/${buy.id}`)}
                      >
                        Excluir
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
            <Typography sx={{ margin: '0 16px', alignSelf: 'center' }}>
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
    </Box>
  );
}

export default BuysAdmin;