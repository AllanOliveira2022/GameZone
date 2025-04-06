import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyService } from '../../services/buyService';
import UserService from '../../services/userService';
import {
  Grid,
  Typography,
  TextField,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  ThemeProvider,
  createTheme,
  alpha,
  Card,
  CardContent,
  Button,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Search, 
  Receipt, 
  FilterAlt, 
  RefreshOutlined, 
  PersonOutline, 
  AttachMoney, 
  DateRange,
  TrendingUp,
  ArrowBack
} from '@mui/icons-material';

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
    success: {
      main: '#69F0AE',
    },
    warning: {
      main: '#FFD740',
    },
    info: {
      main: '#40C4FF',
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
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #333333',
        },
        head: {
          backgroundColor: '#121212',
          color: '#AEEA00',
          fontWeight: 'bold',
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(174, 234, 0, 0.08) !important',
          },
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          borderRadius: 12,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        }
      }
    }
  },
});

function BuysAdmin() {
  const navigate = useNavigate();
  const [buys, setBuys] = useState([]);
  const [filteredBuys, setFilteredBuys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    userId: '',
    startDate: '',
    endDate: '',
    minTotal: '',
    maxTotal: ''
  });
  const [users, setUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalRevenue: 0,
    recentPurchases: 0,
    last7DaysRevenue: 0
  });

  // Buscar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [usersRes, buysRes] = await Promise.all([
          UserService.getUsers(),
          BuyService.getBuys()
        ]);
        
        setUsers(usersRes.users || []);
        processBuysData(buysRes.data || buysRes);
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Processar dados das compras
  const processBuysData = (buysData) => {
    const processedBuys = buysData.map(buy => ({
      ...buy,
      total: Number(buy.price || buy.total) || 0,
      createdAt: new Date(buy.dateBuy || buy.createdAt),
      userName: buy.comprador?.name || (buy.user?.name || ''),
      userEmail: buy.comprador?.email || (buy.user?.email || '')
    }));

    setBuys(processedBuys);
    setFilteredBuys(processedBuys);
    updatePagination(processedBuys);
    calculateStatistics(processedBuys);
  };

  // Atualizar paginação
  const updatePagination = (data) => {
    setPagination(prev => ({
      ...prev,
      total: data.length,
      page: 1 // Reset to first page when data changes
    }));
  };

  // Calcular estatísticas
  const calculateStatistics = (buysData) => {
    const totalRevenue = buysData.reduce((sum, buy) => sum + buy.total, 0);
    const last7DaysBuys = buysData.filter(buy => 
      buy.createdAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    
    setStats({
      totalPurchases: buysData.length,
      totalRevenue: totalRevenue,
      recentPurchases: last7DaysBuys.length,
      last7DaysRevenue: last7DaysBuys.reduce((sum, buy) => sum + buy.total, 0)
    });
  };

  // Aplicar filtros e pesquisa
  useEffect(() => {
    if (buys.length === 0) return;

    let result = [...buys];

    // Aplicar pesquisa
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(buy => 
        String(buy.id).includes(term) ||
        (buy.userName && buy.userName.toLowerCase().includes(term)) ||
        (buy.userEmail && buy.userEmail.toLowerCase().includes(term)) ||
        extractGamesFromItems(buy).some(game => 
          game.name && game.name.toLowerCase().includes(term)
        )
      );
    }

    // Aplicar filtros
    if (filters.userId) {
      result = result.filter(buy => buy.user?.id === filters.userId || buy.comprador?.id === filters.userId);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter(buy => buy.createdAt >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // Fim do dia
      result = result.filter(buy => buy.createdAt <= endDate);
    }

    if (filters.minTotal) {
      result = result.filter(buy => buy.total >= Number(filters.minTotal));
    }

    if (filters.maxTotal) {
      result = result.filter(buy => buy.total <= Number(filters.maxTotal));
    }

    setFilteredBuys(result);
    updatePagination(result);
  }, [buys, searchTerm, filters]);

  // Manipuladores de eventos
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      userId: '',
      startDate: '',
      endDate: '',
      minTotal: '',
      maxTotal: ''
    });
    setSearchTerm('');
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Funções auxiliares
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'cancelado': return 'error';
      case 'pendente': return 'warning';
      case 'processando': return 'info';
      default: return 'success';
    }
  };

  const extractGamesFromItems = (buy) => {
    if (buy.itensCompra && Array.isArray(buy.itensCompra)) {
      return buy.itensCompra.map(item => item.jogo || {
        id: item.gameID,
        name: item.gameName || `Jogo #${item.gameID}`
      });
    }
    
    if (buy.games && Array.isArray(buy.games)) {
      return buy.games;
    }
    
    return [];
  };

  // Obter dados paginados
  const getPaginatedData = () => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filteredBuys.slice(startIndex, endIndex);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        padding: '24px', 
        backgroundColor: '#121212', 
        minHeight: '100vh',
        color: '#FFFFFF'
      }}>
        {/* Cabeçalho com botão de voltar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center">
            <IconButton 
              onClick={() => navigate('/homeadmin')}
              sx={{ 
                color: '#AEEA00',
                mr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(174, 234, 0, 0.1)'
                }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ 
              color: '#AEEA00',
              fontWeight: 'bold',
              textShadow: '0px 0px 8px rgba(174, 234, 0, 0.3)'
            }}>
              Histórico de Compras
            </Typography>
          </Box>
        </Box>

        {/* Cartões de estatísticas */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              borderLeft: '4px solid #AEEA00',
              height: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total de Compras
                </Typography>
                <Typography variant="h4" sx={{ color: '#AEEA00', fontWeight: 'bold' }}>
                  {stats.totalPurchases}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <Receipt sx={{ color: 'rgba(174, 234, 0, 0.6)', fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              borderLeft: '4px solid #69F0AE',
              height: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Receita Total
                </Typography>
                <Typography variant="h4" sx={{ color: '#69F0AE', fontWeight: 'bold' }}>
                  {formatCurrency(stats.totalRevenue)}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <AttachMoney sx={{ color: 'rgba(105, 240, 174, 0.6)', fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              borderLeft: '4px solid #FFD740',
              height: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Compras Recentes (7 dias)
                </Typography>
                <Typography variant="h4" sx={{ color: '#FFD740', fontWeight: 'bold' }}>
                  {stats.recentPurchases}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <DateRange sx={{ color: 'rgba(255, 215, 64, 0.6)', fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              borderLeft: '4px solid #40C4FF',
              height: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Receita (7 dias)
                </Typography>
                <Typography variant="h4" sx={{ color: '#40C4FF', fontWeight: 'bold' }}>
                  {formatCurrency(stats.last7DaysRevenue)}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <TrendingUp sx={{ color: 'rgba(64, 196, 255, 0.6)', fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pesquisa e Filtros */}
        <Card sx={{ mb: 4, p: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <CardContent>
            <Box mb={3}>
              <TextField
                variant="outlined"
                placeholder="Pesquisar por ID, usuário ou jogos..."
                fullWidth
                InputProps={{
                  startAdornment: <Search sx={{ marginRight: '8px', color: '#AEEA00' }} />,
                  sx: { 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(174, 234, 0, 0.3)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(174, 234, 0, 0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#AEEA00'
                    }
                  }
                }}
                value={searchTerm}
                onChange={handleSearch}
              />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Button 
                startIcon={<FilterAlt />}
                onClick={() => setShowFilters(!showFilters)}
                color="primary"
                variant={showFilters ? "contained" : "outlined"}
              >
                {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
              </Button>
              
              {showFilters && (
                <Button 
                  startIcon={<RefreshOutlined />}
                  onClick={resetFilters}
                  color="secondary"
                >
                  Limpar Filtros
                </Button>
              )}
            </Box>

            {showFilters && (
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha('#000000', 0.3)
              }}>
                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel id="user-filter-label" sx={{ color: '#AEEA00' }}>Usuário</InputLabel>
                  <Select
                    labelId="user-filter-label"
                    label="Usuário"
                    name="userId"
                    value={filters.userId}
                    onChange={handleFilterChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(174, 234, 0, 0.3)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(174, 234, 0, 0.5)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#AEEA00'
                      }
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Data inicial"
                  name="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { color: '#69F0AE' }
                  }}
                  sx={{ 
                    minWidth: 180,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(105, 240, 174, 0.3)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(105, 240, 174, 0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#69F0AE'
                    }
                  }}
                />

                <TextField
                  label="Data final"
                  name="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { color: '#69F0AE' }
                  }}
                  sx={{ 
                    minWidth: 180,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(105, 240, 174, 0.3)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(105, 240, 174, 0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#69F0AE'
                    }
                  }}
                />

                <TextField
                  label="Valor mínimo"
                  name="minTotal"
                  type="number"
                  value={filters.minTotal}
                  onChange={handleFilterChange}
                  InputProps={{ 
                    inputProps: { min: 0 },
                    startAdornment: <Box component="span" mr={1}>R$</Box>
                  }}
                  InputLabelProps={{ 
                    sx: { color: '#40C4FF' }
                  }}
                  sx={{ 
                    minWidth: 150,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(64, 196, 255, 0.3)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(64, 196, 255, 0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#40C4FF'
                    }
                  }}
                />

                <TextField
                  label="Valor máximo"
                  name="maxTotal"
                  type="number"
                  value={filters.maxTotal}
                  onChange={handleFilterChange}
                  InputProps={{ 
                    inputProps: { min: 0 },
                    startAdornment: <Box component="span" mr={1}>R$</Box>
                  }}
                  InputLabelProps={{ 
                    sx: { color: '#40C4FF' }
                  }}
                  sx={{ 
                    minWidth: 150,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(64, 196, 255, 0.3)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(64, 196, 255, 0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#40C4FF'
                    }
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Tabela de resultados */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={8} mb={8}>
            <CircularProgress sx={{ color: '#AEEA00' }} size={60} thickness={4} />
          </Box>
        ) : filteredBuys.length === 0 ? (
          <Card sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: alpha('#000000', 0.5),
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            border: '1px dashed rgba(174, 234, 0, 0.3)'
          }}>
            <Typography variant="h6" color="text.secondary">
              Nenhuma compra encontrada com os filtros selecionados.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={resetFilters}
              sx={{ mt: 2 }}
            >
              Limpar filtros
            </Button>
          </Card>
        ) : (
          <>
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 3
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="10%">ID</TableCell>
                    <TableCell width="20%">Data da Compra</TableCell>
                    <TableCell width="25%">Usuário</TableCell>
                    <TableCell width="30%">Itens</TableCell>
                    <TableCell width="10%">Valor Total</TableCell>
                    <TableCell width="5%">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPaginatedData().map((buy) => {
                    const games = extractGamesFromItems(buy);
                    
                    return (
                      <TableRow 
                        key={buy.id} 
                        hover
                        onClick={() => navigate(`/buys/${buy.id}`)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell sx={{ color: '#AEEA00', fontWeight: 'medium' }}>
                          #{buy.id}
                        </TableCell>
                        <TableCell>{formatDate(buy.createdAt)}</TableCell>
                        <TableCell>
                          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonOutline sx={{ mr: 1, color: '#40C4FF' }} />
                            {buy.userName || 'Nome indisponível'}
                            {buy.userEmail && (
                              <Typography component="span" color="text.secondary" sx={{ ml: 0.5 }}>
                                ({buy.userEmail})
                              </Typography>
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {games.length > 0 ? (
                              games.length > 3 ? (
                                <>
                                  {games.slice(0, 2).map(game => (
                                    <Chip 
                                      key={game.id} 
                                      label={game.name} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ 
                                        borderColor: 'rgba(105, 240, 174, 0.5)',
                                        color: '#FFFFFF'
                                      }}
                                    />
                                  ))}
                                  <Tooltip title={`${games.length - 2} jogos adicionais`}>
                                    <Chip 
                                      label={`+${games.length - 2}`} 
                                      size="small"
                                      color="primary"
                                      sx={{ fontWeight: 'bold' }}
                                    />
                                  </Tooltip>
                                </>
                              ) : (
                                games.map(game => (
                                  <Chip 
                                    key={game.id} 
                                    label={game.name} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ 
                                      borderColor: 'rgba(105, 240, 174, 0.5)',
                                      color: '#FFFFFF'
                                    }}
                                  />
                                ))
                              )
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {buy.itensCompra ? `${buy.itensCompra.length} itens` : 'N/A'}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ 
                          color: '#69F0AE', 
                          fontWeight: 'bold',
                          fontSize: '1.05rem'
                        }}>
                          {formatCurrency(buy.total)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={buy.status || 'Concluído'} 
                            color={getStatusColor(buy.status)}
                            size="small"
                            sx={{ fontWeight: 'medium' }}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginação */}
            <Box mt={4} display="flex" justifyContent="center" alignItems="center">
              <Button
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                variant="outlined"
                color="primary"
                sx={{ 
                  mr: 2,
                  opacity: pagination.page === 1 ? 0.5 : 1,
                  '&.Mui-disabled': {
                    borderColor: 'rgba(174, 234, 0, 0.2)',
                    color: 'rgba(174, 234, 0, 0.2)'
                  }
                }}
              >
                Anterior
              </Button>
              <Card sx={{ 
                display: 'flex', 
                px: 3, 
                py: 1, 
                backgroundColor: alpha('#000000', 0.5),
                border: '1px solid rgba(174, 234, 0, 0.3)'
              }}>
                <Typography sx={{ 
                  color: '#AEEA00', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
                </Typography>
              </Card>
              <Button
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                onClick={() => handlePageChange(pagination.page + 1)}
                variant="outlined"
                color="primary"
                sx={{ 
                  ml: 2,
                  opacity: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 0.5 : 1,
                  '&.Mui-disabled': {
                    borderColor: 'rgba(174, 234, 0, 0.2)',
                    color: 'rgba(174, 234, 0, 0.2)'
                  }
                }}
              >
                Próxima
              </Button>
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default BuysAdmin;