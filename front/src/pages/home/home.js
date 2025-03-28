import React, { useState, useEffect } from "react";
import { 
  Box, 
  ThemeProvider, 
  CircularProgress, 
  Alert,
  Typography,
  Grid,
  Fade
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import GameCard from "../../components/gameCard/gameCard";
import Menu from "../../components/menu/menu";
import { GameService } from '../../services/gameService';

// Tema personalizado com paleta neon verde
const theme = createTheme({
  palette: {
    primary: {
      main: "#26ff00",
      light: "#5dff48",
      dark: "#00cc00"
    },
    secondary: {
      main: "#32e514",
    },
    background: {
      default: "#101010",
      paper: "#1a1a1a"
    },
    text: {
      primary: "#e7ffea",
      secondary: "#c1ffc8"
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(38, 255, 0, 0.1)",
          transition: "all 0.3s ease",
          '&:hover': {
            transform: "translateY(-4px)",
            boxShadow: "0 4px 20px rgba(38, 255, 0, 0.15)"
          }
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

  // Função para carregar jogos da API
  const loadGames = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const gamesData = await GameService.getGames(filters);
      setGames(gamesData);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      setError("Erro ao carregar jogos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com filtros do Menu
  const handleFilter = (searchTerm, platform, genre) => {
    const newFilters = {};
    if (searchTerm) newFilters.search = searchTerm;
    if (platform) newFilters.platform = platform;
    if (genre) newFilters.genre = genre;
    
    setFilters(newFilters);
    loadGames(newFilters);
  };

  // Carrega os jogos inicialmente
  useEffect(() => {
    loadGames();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* Menu fixo no topo - agora com handler de filtro */}
      <Menu onFilter={handleFilter} />
      
      {/* Conteúdo principal com padding ajustado */}
      <Box 
        component="main"
        sx={{
          pt: { xs: 20, sm: 25, md: 27 },
          pb: 4,
          minHeight: "100vh",
          backgroundColor: "background.default",
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Box principal com largura controlada */}
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
              />
            </Box>
          )}

          {/* Mensagem de erro */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2, 
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
                variant="h5" 
                color="textSecondary"
                sx={{ 
                  mb: 2,
                  color: 'primary.main',
                  textShadow: '0 0 10px rgba(38, 255, 0, 0.3)'
                }}
              >
                Nenhum jogo encontrado
              </Typography>
              <Typography variant="body1" color="textSecondary">
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
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Home;