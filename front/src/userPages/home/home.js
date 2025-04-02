import React, { useState, useEffect } from "react";
import { 
  Box, 
  ThemeProvider, 
  CircularProgress, 
  Alert,
  Typography,
  Grid,
  Fade,
  Button
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import GameCard from "../../components/gameCard/gameCard";
import Menu from "../../components/menu/menu";
import { GameService } from '../../services/gameService';

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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

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
    loadGames();
  }, []);

  const handlePageChange = (newPage) => {
    loadGames(filters, newPage);
  };

  return (
    <ThemeProvider theme={theme}>
      <Menu onFilter={handleFilter} />
      
      <Box 
        component="main"
        sx={{
          pt: { xs: 20, sm: 25, md: 27 },
          pb: 4,
          minHeight: "100vh",
          backgroundColor: colors.background400,
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            maxWidth: 1600,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          {/* Estado de loading */}
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: 'calc(100vh - 250px)'
            }}>
              <CircularProgress 
                color="primary" 
                size={60} 
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
                mb: 4,
                backgroundColor: colors.background300,
                border: `1px solid ${colors.error}`,
                color: colors.textPrimary,
                '& .MuiAlert-message': { 
                  width: '100%', 
                  textAlign: 'center' 
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
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'calc(100vh - 250px)'
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 2,
                  color: colors.primary500,
                  textShadow: `0 0 10px ${colors.primary700}`,
                  fontWeight: 'bold'
                }}
              >
                Nenhum jogo encontrado
              </Typography>
              <Typography variant="body1" sx={{ color: colors.neutral600 }}>
                Tente ajustar os filtros ou pesquisa
              </Typography>
            </Box>
          )}

          {/* Grade de jogos com animação */}
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }}
            columns={{ xs: 2, sm: 8, md: 12 }}
          >
            {!loading && !error && games.map((game, index) => (
              <Fade 
                in={true} 
                timeout={500} 
                style={{ transitionDelay: `${index * 100}ms` }}
                key={game.id}
              >
                <Grid item xs={2} sm={4} md={4}>
                  <GameCard game={game} />
                </Grid>
              </Fade>
            ))}
          </Grid>

          {/* Paginação */}
          {!loading && games.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mt: 4,
              gap: 3
            }}>
              <Button
                variant="contained"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                sx={{
                  minWidth: 100
                }}
              >
                Anterior
              </Button>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: colors.textSecondary,
                  fontWeight: 'medium'
                }}
              >
                Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
              </Typography>
              
              <Button
                variant="contained"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page * pagination.limit >= pagination.total}
                sx={{
                  minWidth: 100
                }}
              >
                Próxima
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Home;