import React, { useState, useEffect } from "react";
import {
  Drawer,
  TextField,
  Typography,
  Button,
  Box,
  styled,
  Divider,
  IconButton
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// Criando tema personalizado
const theme = createTheme({
  palette: {
    primary: { main: "#26ff00", light: "#5dff48", dark: "#00cc00" },
    secondary: { main: "#32e514" },
    background: { default: "#101010", paper: "#1a1a1a" },
    text: { primary: "#e7ffea", secondary: "#c1ffc8" }
  }
});

// Largura do menu quando aberto
const drawerWidth = 280;

function Menu({ onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Ajusta o layout do conteúdo principal quando o menu é aberto/fechado
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      if (open) {
        // Em telas médias e grandes, ajustar o margin-left para acomodar o menu
        mainContent.style.marginLeft = `${drawerWidth}px`;
        mainContent.style.width = `calc(100% - ${drawerWidth}px)`;
      } else {
        // Quando o menu estiver fechado, utilizar toda a largura disponível
        mainContent.style.marginLeft = '0';
        mainContent.style.width = '100%';
      }
      // Adicionar transição para suavizar a mudança
      mainContent.style.transition = 'margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1), width 225ms cubic-bezier(0.4, 0, 0.6, 1)';
    }
  }, [open]);

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

  return (
    <ThemeProvider theme={theme}>
      {/* Botão para abrir/fechar o menu em telas pequenas */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        edge="start"
        sx={{
          position: 'fixed',
          left: 16,
          top: 16,
          zIndex: 1201,
          backgroundColor: '#1a1a1a',
          '&:hover': {
            backgroundColor: '#2a2a2a',
          },
          display: { xs: 'flex', md: open ? 'none' : 'flex' }
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer (menu lateral) */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1a1a1a',
            borderRight: '1px solid rgba(38, 255, 0, 0.1)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            // Quando fechado em telas pequenas, esconde completamente
            transform: open ? 'translateX(0)' : 'translateX(-100%)',
          },
          // Em telas pequenas, sempre mostra por cima (position: fixed)
          // Em telas médias e grandes, usa position: relative para empurrar o conteúdo
          position: { xs: 'fixed', md: 'relative' },
          display: 'block',
          zIndex: 1200
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon sx={{ color: '#26ff00' }} />
          </IconButton>
        </Box>
        
        <Box sx={{ p: 2 }}>
          {/* Campo de busca */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar jogos..."
            sx={{
              mb: 3,
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

          {/* Filtros por Plataforma */}
          <Typography 
            variant="subtitle2" 
            color="primary"
            sx={{ 
              fontWeight: "bold",
              textShadow: "0 0 5px rgba(38, 255, 0, 0.3)",
              mb: 1
            }}
          >
            Plataforma
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
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

          <Divider sx={{ borderColor: 'rgba(38, 255, 0, 0.1)', my: 2 }} />

          {/* Filtros por Gênero */}
          <Typography 
            variant="subtitle2" 
            color="primary"
            sx={{ 
              fontWeight: "bold",
              textShadow: "0 0 5px rgba(38, 255, 0, 0.3)",
              mb: 1
            }}
          >
            Gênero
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}

export default Menu;