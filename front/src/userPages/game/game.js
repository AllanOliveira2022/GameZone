import '../../styles/game/game.css';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, CircularProgress, Alert, 
  Grid, Card, CardMedia, CardContent, Chip, Divider, Rating
} from '@mui/material';
import { GameService } from '../../services/gameService';

function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const loadGameData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await GameService.getGameById(id);
      setGameData(response.game);
    } catch (err) {
      console.error('Erro ao carregar jogo:', err);
      setError(err.response?.data?.message || 'Erro ao carregar informações do jogo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGameData();
  }, [id]);

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPurchaseSuccess(true);
      setTimeout(() => navigate('/library'), 2000);
    } catch (err) {
      setError('Erro ao processar compra');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: 'var(--primary-500)' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error" sx={{ 
          width: '100%', 
          maxWidth: 600,
          backgroundColor: 'var(--background-300)',
          color: 'var(--text-primary)',
          border: '1px solid var(--error)'
        }}>
          {error}
          <Button 
            variant="outlined" 
            sx={{ 
              mt: 2,
              color: 'var(--primary-500)',
              borderColor: 'var(--primary-500)',
              '&:hover': {
                backgroundColor: 'var(--primary-800)',
                borderColor: 'var(--primary-500)'
              }
            }} 
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </Alert>
      </Box>
    );
  }

  if (!gameData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="warning" sx={{ 
          width: '100%', 
          maxWidth: 600,
          backgroundColor: 'var(--background-300)',
          color: 'var(--text-primary)',
          border: '1px solid var(--warning)'
        }}>
          Jogo não encontrado
          <Button 
            variant="outlined" 
            sx={{ 
              mt: 2,
              color: 'var(--primary-500)',
              borderColor: 'var(--primary-500)',
              '&:hover': {
                backgroundColor: 'var(--primary-800)',
                borderColor: 'var(--primary-500)'
              }
            }} 
            onClick={() => navigate('/')}
          >
            Voltar para a loja
          </Button>
        </Alert>
      </Box>
    );
  }

  const averageRating = gameData.Avaliations?.length > 0 
    ? gameData.Avaliations.reduce((sum, aval) => sum + aval.rating, 0) / gameData.Avaliations.length 
    : 0;

  return (
    <Box sx={{ 
      padding: { xs: 2, md: 4 },
      backgroundColor: 'var(--background-400)',
      minHeight: '100vh',
      color: 'var(--text-primary)'
    }}>
      <Grid container spacing={4}>
        {/* Seção de imagem e compra */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2,
            backgroundColor: 'var(--background-300)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <CardMedia
              component="img"
              height="400"
              image={gameData.imageUrl || '/placeholder-game.jpg'}
              alt={gameData.name}
              sx={{ 
                objectFit: 'cover',
                borderBottom: '2px solid var(--primary-700)'
              }}
            />
            <CardContent>
              <Typography gutterBottom variant="h4" component="h1" sx={{
                color: 'var(--text-secondary)',
                textShadow: '0 0 8px var(--primary-500)',
                fontWeight: 'bold'
              }}>
                {gameData.name}
              </Typography>
              
              {/* Avaliações */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                backgroundColor: 'var(--background-200)',
                p: 1,
                borderRadius: 1
              }}>
                <Rating 
                  value={averageRating} 
                  precision={0.5} 
                  readOnly 
                  sx={{ 
                    mr: 1,
                    color: 'var(--primary-500)',
                    '& .MuiRating-iconEmpty': {
                      color: 'var(--background-100)'
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                  ({gameData.Avaliations?.length || 0} avaliações)
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={`Gênero: ${gameData.Genre?.name || 'Não especificado'}`} 
                  sx={{ 
                    backgroundColor: 'var(--primary-800)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--primary-500)',
                    '&:hover': {
                      backgroundColor: 'var(--primary-700)'
                    }
                  }}
                  variant="outlined"
                />
                <Chip 
                  label={`Plataforma: ${gameData.Platform?.name || 'Não especificada'}`} 
                  sx={{ 
                    backgroundColor: 'var(--accent-800)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--accent-500)',
                    '&:hover': {
                      backgroundColor: 'var(--accent-700)'
                    }
                  }}
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="h5" sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                color: 'var(--primary-400)',
                textShadow: '0 0 5px var(--primary-700)',
                backgroundColor: 'var(--background-300)',
                p: 1,
                borderRadius: 1,
                borderLeft: '4px solid var(--primary-500)'
              }}>
                {gameData.price ? `R$ ${parseFloat(gameData.price).toFixed(2)}` : 'Grátis'}
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handlePurchase}
                disabled={purchasing || purchaseSuccess}
                sx={{ 
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backgroundColor: 'var(--primary-500)',
                  color: 'var(--background-400)',
                  '&:hover': {
                    backgroundColor: 'var(--primary-400)',
                    boxShadow: '0 0 15px var(--primary-500)'
                  },
                  '&:disabled': {
                    backgroundColor: purchasing ? 'var(--primary-800)' : 'var(--success)',
                    color: purchasing ? 'var(--text-primary)' : 'var(--background-400)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {purchasing ? (
                  <CircularProgress size={24} sx={{ color: 'var(--background-400)' }} />
                ) : purchaseSuccess ? (
                  'Compra realizada!'
                ) : (
                  'Comprar Agora'
                )}
              </Button>
              
              {purchaseSuccess && (
                <Alert severity="success" sx={{ 
                  mt: 2,
                  backgroundColor: 'var(--primary-800)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--success)'
                }}>
                  Redirecionando para sua biblioteca...
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Seção de detalhes */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%', 
            p: 3, 
            borderRadius: 2,
            backgroundColor: 'var(--background-300)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: 'var(--text-secondary)',
              borderBottom: '2px solid var(--primary-700)',
              pb: 1
            }}>
              Descrição
            </Typography>
            <Typography paragraph sx={{ 
              textAlign: 'justify',
              color: 'var(--text-primary)',
              lineHeight: 1.6
            }}>
              {gameData.description || 'Nenhuma descrição disponível.'}
            </Typography>
            
            <Divider sx={{ 
              my: 3,
              borderColor: 'var(--primary-700)',
              borderWidth: 1
            }} />
            
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: 'var(--text-secondary)',
              borderBottom: '2px solid var(--primary-700)',
              pb: 1
            }}>
              Desenvolvedor
            </Typography>
            <Box sx={{ 
              mb: 2,
              backgroundColor: 'var(--background-200)',
              p: 2,
              borderRadius: 1
            }}>
              <Typography paragraph sx={{ 
                fontWeight: 'bold',
                color: 'var(--primary-400)',
                mb: 1
              }}>
                {gameData.Developer?.name || 'Desenvolvedor não especificado'}
              </Typography>
              {gameData.Developer?.email && (
                <Typography paragraph sx={{ 
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <span style={{ color: 'var(--primary-500)' }}>✉️</span>
                  <strong>Contato:</strong> {gameData.Developer.email}
                </Typography>
              )}
              {gameData.Developer?.phone && (
                <Typography paragraph sx={{ 
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <span style={{ color: 'var(--primary-500)' }}>📞</span>
                  <strong>Telefone:</strong> {gameData.Developer.phone}
                </Typography>
              )}
              {gameData.Developer?.CNPJ && (
                <Typography paragraph sx={{ 
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <span style={{ color: 'var(--primary-500)' }}>📄</span>
                  <strong>CNPJ:</strong> {gameData.Developer.CNPJ}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ 
              my: 3,
              borderColor: 'var(--primary-700)',
              borderWidth: 1
            }} />
            
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: 'var(--text-secondary)',
              borderBottom: '2px solid var(--primary-700)',
              pb: 1
            }}>
              Detalhes Técnicos
            </Typography>
            
            <Box sx={{ 
              mb: 2,
              backgroundColor: 'var(--background-200)',
              p: 2,
              borderRadius: 1
            }}>
              <Typography paragraph sx={{ 
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <span style={{ color: 'var(--primary-500)' }}>📅</span>
                <strong>Lançamento:</strong> {new Date(gameData.createdAt).toLocaleDateString('pt-BR')}
              </Typography>
              <Typography paragraph sx={{ 
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <span style={{ color: 'var(--primary-500)' }}>🔄</span>
                <strong>Última Atualização:</strong> {new Date(gameData.updatedAt).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
            
            {/* Seção de avaliações */}
            {gameData.Avaliations?.length > 0 && (
              <>
                <Divider sx={{ 
                  my: 3,
                  borderColor: 'var(--primary-700)',
                  borderWidth: 1
                }} />
                <Typography variant="h5" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  color: 'var(--text-secondary)',
                  borderBottom: '2px solid var(--primary-700)',
                  pb: 1
                }}>
                  Avaliações
                </Typography>
                {gameData.Avaliations.map((avaliation, index) => (
                  <Box key={index} sx={{ 
                    mb: 2, 
                    p: 2, 
                    backgroundColor: 'var(--background-200)',
                    borderRadius: 1,
                    borderLeft: '3px solid var(--primary-500)'
                  }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 'bold',
                      color: 'var(--primary-400)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <span style={{ color: 'var(--primary-500)' }}>👤</span>
                      {avaliation.userName || 'Anônimo'}
                    </Typography>
                    <Rating 
                      value={avaliation.rating} 
                      readOnly 
                      size="small" 
                      sx={{ 
                        my: 0.5,
                        color: 'var(--primary-500)',
                        '& .MuiRating-iconEmpty': {
                          color: 'var(--background-100)'
                        }
                      }} 
                    />
                    <Typography variant="body2" sx={{ 
                      color: 'var(--text-primary)',
                      mt: 1,
                      fontStyle: avaliation.comment ? 'normal' : 'italic'
                    }}>
                      {avaliation.comment || 'Sem comentário'}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Game;