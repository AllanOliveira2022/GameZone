import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Typography,
  Button,
  Box,
  styled
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Criando tema personalizado
const theme = createTheme({
  palette: {
    primary: { main: "#26ff00", light: "#5dff48", dark: "#00cc00" },
    secondary: { main: "#32e514" },
    background: { default: "#101010", paper: "#1a1a1a" },
    text: { primary: "#e7ffea", secondary: "#c1ffc8" }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1a1a",
          backgroundImage: "none",
          boxShadow: "0 2px 10px rgba(38, 255, 0, 0.1)"
        }
      }
    }
  }
});

function Menu({ onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onFilter(e.target.value, selectedPlatform, selectedGenre);
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
    onFilter(searchTerm, platform, selectedGenre);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    onFilter(searchTerm, selectedPlatform, genre);
  };

  // Botão estilizado com efeito neon
  const NeonButton = styled(Button)(({ theme, active }) => ({
    backgroundColor: active ? theme.palette.primary.main : "#272727",
    color: active ? "#101010" : theme.palette.text.primary,
    border: active ? "1px solid transparent" : "1px solid rgba(38, 255, 0, 0.3)",
    fontWeight: active ? "bold" : "normal",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    textTransform: "none",
    fontSize: "0.8rem",
    padding: "4px 8px",
    minWidth: "auto",
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: "#101010",
      boxShadow: `0 0 8px ${theme.palette.primary.main}`,
    }
  }));

  // Estilo para os elementos details
  const detailsStyle = {
    width: "100%",
    margin: "8px 0",
    color: "#e7ffea",
    '&[open] summary': {
      borderBottom: "1px solid rgba(38, 255, 0, 0.3)",
      marginBottom: "8px"
    }
  };

  const summaryStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 0",
    cursor: "pointer",
    outline: "none",
    borderRadius: "4px",
    transition: "all 0.2s ease",
    '&:hover': {
      backgroundColor: "rgba(38, 255, 0, 0.1)",
    },
    '&::-webkit-details-marker': {
      display: "none"
    },
    '&:after': {
      content: '"▼"',
      color: "#26ff00",
      fontSize: "0.8rem",
      transition: "transform 0.2s",
      marginLeft: "8px"
    },
    'details[open] &::after': {
      transform: "rotate(180deg)"
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" elevation={0} sx={{ height: "auto" }}>
        <Toolbar sx={{ 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          gap: 1,
          py: 2,
          px: { xs: 2, md: 4 }
        }}>
          {/* Campo de busca - sempre visível */}
          <Box width="100%">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar jogos..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: "#272727",
                  '& fieldset': {
                    borderColor: "rgba(38, 255, 0, 0.3)",
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${theme.palette.primary.light}`
                  },
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.text.primary,
                  '&::placeholder': {
                    color: "rgba(200, 255, 200, 0.5)",
                    opacity: 1
                  }
                }
              }}
            />
          </Box>
          
          {/* Filtros por Plataforma - em accordion */}
          <details style={detailsStyle}>
            <summary style={summaryStyle}>
              <Typography 
                variant="subtitle2" 
                color="primary"
                sx={{ 
                  fontWeight: "bold",
                  textShadow: "0 0 5px rgba(38, 255, 0, 0.3)"
                }}
              >
                Plataforma
              </Typography>
            </summary>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", pt: 1 }}>
              <NeonButton
                active={selectedPlatform === "" ? 1 : 0}
                onClick={() => handlePlatformChange("")}
              >
                Todos
              </NeonButton>
              {['PC', 'Console', 'Mobile'].map((platform) => (
                <NeonButton
                  key={platform}
                  active={selectedPlatform === platform ? 1 : 0}
                  onClick={() => handlePlatformChange(platform)}
                >
                  {platform}
                </NeonButton>
              ))}
            </Box>
          </details>
          
          {/* Filtros por Gênero - em accordion */}
          <details style={detailsStyle}>
            <summary style={summaryStyle}>
              <Typography 
                variant="subtitle2" 
                color="primary"
                sx={{ 
                  fontWeight: "bold",
                  textShadow: "0 0 5px rgba(38, 255, 0, 0.3)"
                }}
              >
                Gênero
              </Typography>
            </summary>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", pt: 1 }}>
              <NeonButton
                active={selectedGenre === "" ? 1 : 0}
                onClick={() => handleGenreChange("")}
              >
                Todos
              </NeonButton>
              {['Ação', 'Aventura', 'Corrida', 'RPG', 'Estratégia', 'Esportes'].map((genre) => (
                <NeonButton
                  key={genre}
                  active={selectedGenre === genre ? 1 : 0}
                  onClick={() => handleGenreChange(genre)}
                >
                  {genre}
                </NeonButton>
              ))}
            </Box>
          </details>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default Menu;