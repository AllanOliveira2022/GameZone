import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Button,
  Paper,
  useTheme
} from '@mui/material';
import {
  SportsEsports as GamesIcon,
  Category as GenreIcon,
  DeveloperMode as DeveloperIcon,
  Computer as PlatformIcon
} from '@mui/icons-material';

function SimpleAdminPanel() {
  const theme = useTheme();

  const adminSections = [
    {
      title: "Jogos",
      icon: <GamesIcon fontSize="large" />,
      color: theme.palette.primary.main,
      to: "/gamesadmin"
    },
    {
      title: "Gêneros",
      icon: <GenreIcon fontSize="large" />,
      color: theme.palette.secondary.main,
      to: "/genresadmin"
    },
    {
      title: "Desenvolvedores",
      icon: <DeveloperIcon fontSize="large" />,
      color: theme.palette.success.main,
      to: "/developersadmin"
    },
    {
      title: "Plataformas",
      icon: <PlatformIcon fontSize="large" />,
      color: theme.palette.warning.main,
      to: "/buysadmin"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: theme.palette.grey[100], 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          fontWeight: 'bold', 
          color: theme.palette.text.primary,
          mb: 6,
          textAlign: 'center'
        }}
      >
        Painel Administrativo
      </Typography>
      
      <Grid container spacing={4} sx={{ maxWidth: '800px' }}>
        {adminSections.map((section, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Button
              component={Link}
              to={section.to}
              fullWidth
              sx={{
                height: '200px',
                p: 3,
                backgroundColor: section.color,
                color: theme.palette.getContrastText(section.color),
                '&:hover': {
                  backgroundColor: section.color,
                  opacity: 0.9,
                  transform: 'scale(1.02)'
                },
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              {section.icon}
              <Typography variant="h5" component="span">
                {section.title}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SimpleAdminPanel;