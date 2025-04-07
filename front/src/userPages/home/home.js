import React, { useState, useEffect } from "react";
import { 
  Box, 
  ThemeProvider, 
  CircularProgress, 
  Alert,
  Typography,
  Grid,
  Fade,
  Button,
  Paper,
  useMediaQuery,
  Container,
  Stack
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { createTheme } from "@mui/material/styles";
import GameCard from "../../components/gameCard/gameCard";
import Menu from "../../components/menu/menu";
import { GameService } from '../../services/gameService';
import { useNavigate } from "react-router-dom";

// Definindo as cores da paleta como constantes
const colors = {
  primary500: "#26ff00",
  primary300: "#8aff63",
  primary700: "#1caa00",
  secondary500: "#32e514",
  background400: "#101010",
  background300: "#1a1a1a",
  textPrimary: "#e7ffea",
  textSecondary: "#c2ffb0",
  error: "#ff3333",
  warning: "#ffcc00",
  success: "#26ff00",
  neutral600: "#b9b9b9",
  background200: "#272727"
};

// Tema personalizado com valores hexadecimais
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary500,
      light: colors.primary300,
      dark: colors.primary700
    },
    secondary: {
      main: colors.secondary500,
    },
    background: {
      default: colors.background400,
      paper: colors.background300
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary
    },
    error: {
      main: colors.error
    },
    warning: {
      main: colors.warning
    },
    success: {
      main: colors.success
    }
  },
  typography: {
    // Ajuste de tipografia para melhor responsividade
    h5: {
      fontSize: '1.25rem',
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    body1: {
      fontSize: '0.875rem',
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background300,
          border: `1px solid ${colors.primary700}`,
          transition: "all 0.3s ease",
          '&:hover': {
            transform: "translateY(-4px)",
            boxShadow: `0 4px 20px ${colors.primary700}`,
            borderColor: colors.primary500
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: '0.8rem',
          padding: '6px 12px',
          '@media (min-width:600px)': {
            fontSize: '0.875rem',
            padding: '8px 16px',
          },
          '&.Mui-disabled': {
            backgroundColor: colors.background200,
            color: colors.neutral600
          }
        },
        containedPrimary: {
          backgroundColor: colors.primary500,
          color: colors.background400,
          '&:hover': {
            backgroundColor: colors.primary300,
            boxShadow: `0 0 15px ${colors.primary500}`
          }
        },
        outlinedPrimary: {
          borderColor: colors.primary500,
          color: colors.primary500,
          '&:hover': {
            backgroundColor: colors.primary700,
            borderColor: colors.primary300
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background300,
          color: colors.textPrimary
        },
        standardError: {
          border: `1px solid ${colors.error}`,
          backgroundColor: colors.background300
        }
      }
    }
  }
});

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [userName, setUserName] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const loadGames = async (filters = {}, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page,
        limit: pagination.limit
      };
      
      const response = await GameService.getGames(params);
      setGames(response.data);
      setPagination({
        ...pagination,
        total: response.total,
        page: parseInt(response.page)
      });
    } catch (err) {
      console.error("Failed to fetch games:", err);
      setError("Erro ao carregar jogos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (searchTerm, platform, genre, minPrice, maxPrice) => {
    const newFilters = {};
    if (searchTerm) newFilters.search = searchTerm;
    if (platform) newFilters.platformID = platform;
    if (genre) newFilters.genreID = genre;
    if (minPrice) newFilters.minPrice = minPrice;
    if (maxPrice) newFilters.maxPrice = maxPrice;
    
    setFilters(newFilters);
    loadGames(newFilters, 1);
  };

  useEffect(() => {
    // Carregar o nome do usuário do localStorage
    const storedUserName = localStorage.getItem('name');
    setUserName(storedUserName || "Visitante");
    
    loadGames();
  }, []);

  const handlePageChange = (newPage) => {
    loadGames(filters, newPage);
  };

  const handleLogout = () => {
    // Limpar dados do usuário no localStorage
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    // Redirecionar para a página de login
    navigate('/');
  };

  const goToLibrary = () => {
    navigate('/library');
  };

  return (
    <ThemeProvider theme={theme}>
      <Menu onFilter={handleFilter} />
      
      <Box 
        component="main"
        sx={{
          py: { xs: 3, sm: 4, md: 5 },
          px: { xs: 2, sm: 2, md: 3 },
          minHeight: "100vh",
          backgroundColor: colors.background400,
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Container 
          maxWidth="xl" 
          disableGutters 
          sx={{ 
            mx: 'auto',
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          {/* Cabeçalho com mensagem de boas-vindas e botões - Responsivo */}
          <Paper
            elevation={3}
            sx={{
              mb: { xs: 2, sm: 3, md: 4 },
              p: { xs: 2, sm: 3 },
              backgroundColor: colors.background300,
              borderLeft: `4px solid ${colors.primary500}`,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: { xs: 2, sm: 2 }
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: colors.textPrimary,
                  mb: 0.5,
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
                }}
              >
                Bem-vindo, {userName}!
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: colors.textSecondary,
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                }}
              >
                Aproveite nosso catálogo de jogos
              </Typography>
            </Box>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 1, sm: 2 }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<LibraryBooksIcon />}
                onClick={goToLibrary}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
                sx={{
                  minWidth: { xs: '100%', sm: '150px' },
                  height: { xs: '40px', sm: 'auto' }
                }}
              >
                Minha Biblioteca
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
                sx={{
                  minWidth: { xs: '100%', sm: '120px' },
                  height: { xs: '40px', sm: 'auto' }
                }}
              >
                {isMobile ? "Sair" : "Sair do Sistema"}
              </Button>
            </Stack>
          </Paper>

          {/* Estado de loading */}
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: { xs: 'calc(100vh - 250px)', sm: 'calc(100vh - 300px)', md: 'calc(100vh - 350px)' }
            }}>
              <CircularProgress 
                color="primary" 
                size={isMobile ? 40 : 60} 
                thickness={4} 
                sx={{ color: colors.primary500 }}
              />
            </Box>
          )}

          {/* Mensagem de erro */}
          {error && (
            <Alert 
              severity="error"
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
                backgroundColor: colors.background300,
                border: `1px solid ${colors.error}`,
                color: colors.textPrimary,
                '& .MuiAlert-message': { 
                  width: '100%', 
                  textAlign: 'center',
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Sem jogos encontrados */}
          {!loading && !error && games.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              py: { xs: 2, sm: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: { xs: 'calc(100vh - 250px)', sm: 'calc(100vh - 300px)', md: 'calc(100vh - 350px)' }
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 2,
                  color: colors.primary500,
                  textShadow: `0 0 10px ${colors.primary700}`,
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' }
                }}
              >
                Nenhum jogo encontrado
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: colors.neutral600,
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                }}
              >
                Tente ajustar os filtros ou pesquisa
              </Typography>
            </Box>
          )}

          {/* Grade de jogos com animação - Responsiva */}
          <Grid 
            container 
            spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
            columns={{ xs: 2, sm: 6, md: 9, lg: 12 }}
          >
            {!loading && !error && games.map((game, index) => (
              <Fade 
                in={true} 
                timeout={300} 
                style={{ transitionDelay: `${index * 75}ms` }}
                key={game.id}
              >
                <Grid item xs={2} sm={3} md={3} lg={4}>
                  <GameCard game={game} />
                </Grid>
              </Fade>
            ))}
          </Grid>

          {/* Paginação - Responsiva */}
          {!loading && games.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center', 
              alignItems: 'center',
              mt: { xs: 3, sm: 4 },
              gap: { xs: 2, sm: 3 }
            }}>
              <Button
                variant="contained"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
                sx={{
                  minWidth: { xs: '100%', sm: '100px' },
                  order: { xs: 2, sm: 1 }
                }}
              >
                Anterior
              </Button>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: colors.textSecondary,
                  fontWeight: 'medium',
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  order: { xs: 1, sm: 2 }
                }}
              >
                Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
              </Typography>
              
              <Button
                variant="contained"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page * pagination.limit >= pagination.total}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
                sx={{
                  minWidth: { xs: '100%', sm: '100px' },
                  order: { xs: 3, sm: 3 }
                }}
              >
                Próxima
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Home;