import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BuyService } from '../../services/buyService';
import UserService from '../../services/userService';
import {
  Box, Typography, Button, CircularProgress, Alert,
  Grid, Card, CardMedia, CardContent, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;

  const navigate = useNavigate();

  // Get authentication data from localStorage
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');

  useEffect(() => {
    if (token && userId) {
      fetchUserLibrary();
    }
  }, [page]);

  const fetchUserLibrary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await UserService.getUserGames();
      if (response && response.games && Array.isArray(response.games)) {
        setGames(response.games);
        setTotalPages(Math.ceil(response.games.length / limit));
      } else {
        const purchases = await BuyService.getUserBuys(userId, page, limit);
        if (purchases && purchases.data && Array.isArray(purchases.data)) {
          const extractedGames = purchases.data.flatMap(purchase =>
            purchase.itensCompra.map(item => ({
              ...item.jogo,
              purchaseDate: purchase.createdAt,
              purchaseId: purchase.id,
            })).filter(Boolean)
          );
          setGames(extractedGames);
          setTotalPages(Math.ceil(purchases.total / limit));
        } else {
          setGames([]);
          setTotalPages(0);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar a biblioteca:', err);
      setError('Erro ao carregar sua biblioteca. Por favor, tente novamente mais tarde.');
      setGames([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToStore = () => {
    navigate('/home');
  };

  const playGame = (gameId) => {
    navigate(`/play/${gameId}`);
  };

  // Redirect if not authenticated
  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" sx={{ backgroundColor: 'var(--background-400)' }}>
        <CircularProgress sx={{ color: 'var(--primary-500)' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh" sx={{ backgroundColor: 'var(--background-400)', color: 'var(--text-primary)' }}>
        <Alert severity="error" sx={{
          width: '100%',
          maxWidth: 600,
          backgroundColor: 'var(--background-300)',
          color: 'var(--text-primary)',
          border: '1px solid var(--error)',
          mb: 2
        }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={fetchUserLibrary} sx={{ color: 'var(--primary-500)', borderColor: 'var(--primary-500)', '&:hover': { backgroundColor: 'var(--primary-800)', borderColor: 'var(--primary-500)' } }}>
          Tentar novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{
      padding: { xs: 2, md: 4 },
      backgroundColor: 'var(--background-400)',
      minHeight: '100vh',
      color: 'var(--text-primary)'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>
          Minha Biblioteca
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={goToStore}
          sx={{
            color: 'var(--primary-500)',
            borderColor: 'var(--primary-500)',
            '&:hover': {
              backgroundColor: 'var(--primary-800)',
              borderColor: 'var(--primary-500)'
            }
          }}
        >
          Voltar para a Loja
        </Button>
      </Box>

      {games.length === 0 ? (
        <Box sx={{
          backgroundColor: 'var(--background-300)',
          padding: 4,
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ color: 'var(--text-muted)', mb: 2 }}>
            Sua biblioteca está vazia!
          </Typography>
          <Typography sx={{ color: 'var(--text-primary)', mb: 3 }}>
            Você ainda não adquiriu nenhum jogo. Visite a loja para encontrar jogos incríveis.
          </Typography>
          <Button variant="contained" onClick={goToStore} sx={{ backgroundColor: 'var(--primary-500)', color: 'var(--background-400)', '&:hover': { backgroundColor: 'var(--primary-400)' } }}>
            Ir para a Loja
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {games.map((game) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
                <Card sx={{
                  height: '100%',
                  borderRadius: 2,
                  backgroundColor: 'var(--background-300)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.3)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={game.coverImage || '/placeholder-game.jpg'}
                    alt={game.name || 'Game'}
                    sx={{ objectFit: 'cover', borderBottom: '2px solid var(--primary-700)' }}
                  />
                  <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ color: 'var(--text-secondary)', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {game.name || 'Unnamed Game'}
                    </Typography>
                    {game.purchaseDate && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
                        Adquirido em: {new Date(game.purchaseDate).toLocaleDateString()}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {game.description && game.description.length > 30 ? `${game.description.substring(0, 30)}...` : game.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'var(--background-200)', borderTop: '1px solid var(--primary-700)' }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => playGame(game.id)}
                      startIcon={<PlayArrowIcon />}
                      sx={{
                        backgroundColor: 'var(--primary-500)',
                        color: 'var(--background-400)',
                        '&:hover': { backgroundColor: 'var(--primary-400)' },
                        fontSize: '0.9rem'
                      }}
                    >
                      Jogar
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                onClick={handlePreviousPage}
                disabled={page === 1}
                sx={{
                  backgroundColor: page === 1 ? 'var(--background-300)' : 'var(--primary-500)',
                  color: page === 1 ? 'var(--text-muted)' : 'var(--background-400)',
                  '&:hover': { backgroundColor: page === 1 ? 'var(--background-300)' : 'var(--primary-400)' },
                  mr: 2,
                  '&:disabled': { color: 'var(--text-muted)', backgroundColor: 'var(--background-300)' }
                }}
              >
                Anterior
              </Button>
              <Typography sx={{ color: 'var(--text-primary)', alignSelf: 'center' }}>
                Página {page} de {totalPages}
              </Typography>
              <Button
                onClick={handleNextPage}
                disabled={page === totalPages}
                sx={{
                  backgroundColor: page === totalPages ? 'var(--background-300)' : 'var(--primary-500)',
                  color: page === totalPages ? 'var(--text-muted)' : 'var(--background-400)',
                  '&:hover': { backgroundColor: page === totalPages ? 'var(--background-300)' : 'var(--primary-400)' },
                  ml: 2,
                  '&:disabled': { color: 'var(--text-muted)', backgroundColor: 'var(--background-300)' }
                }}
              >
                Próxima
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default Library;