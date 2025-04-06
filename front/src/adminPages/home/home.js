import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Button,
    useTheme,
    ThemeProvider,
    createTheme,
    AppBar,
    Toolbar,
    Paper
} from '@mui/material';
import {
    SportsEsports as GamesIcon,
    Category as GenreIcon,
    DeveloperMode as DeveloperIcon,
    Computer as PlatformIcon,
    ShoppingCart as BuyIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';

function SimpleAdminPanel() {
    const customTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#aeea00',
                dark: '#99cc00',
                contrastText: '#000000',
            },
            secondary: {
                main: '#64dd17',
                contrastText: '#000000',
            },
            success: {
                main: '#00e676',
                contrastText: '#000000',
            },
            warning: {
                main: '#ffea00',
                contrastText: '#000000',
            },
            info: {
                main: '#00e5ff',
                contrastText: '#000000',
            },
            error: {
                main: '#ff1744',
            },
            background: {
                default: '#121212',
                paper: '#1e1e1e',
            },
            text: {
                primary: '#ffffff',
                secondary: '#b3b3b3',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h4: {
                fontWeight: 700,
            },
            h6: {
                fontWeight: 600,
            },
        },
    });

    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('name');
        setUserName(name || 'Administrador');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        navigate('/');
    };

    const adminSections = [
        {
            title: "Jogos",
            icon: <GamesIcon fontSize="large" />,
            color: customTheme.palette.secondary.main,
            to: "/gamesadmin"
        },
        {
            title: "Gêneros",
            icon: <GenreIcon fontSize="large" />,
            color: customTheme.palette.success.main,
            to: "/genresadmin"
        },
        {
            title: "Desenvolvedores",
            icon: <DeveloperIcon fontSize="large" />,
            color: customTheme.palette.warning.main,
            to: "/developersadmin"
        },
        {
            title: "Plataformas",
            icon: <PlatformIcon fontSize="large" />,
            color: customTheme.palette.info.main,
            to: "/platformsadmin"
        },
        {
            title: "Compras",
            icon: <BuyIcon fontSize="large" />,
            color: customTheme.palette.error.main,
            to: "/buysadmin"
        }
    ];

    return (
        <ThemeProvider theme={customTheme}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: customTheme.palette.background.default
            }}>
                <AppBar position="static" sx={{ backgroundColor: '#000000', borderBottom: '1px solid #aeea00' }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 'bold',
                                color: '#aeea00',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            Sistema de Administração
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1" sx={{ color: '#ffffff' }}>
                                Olá, <strong style={{ color: '#aeea00' }}>{userName}</strong>
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#aeea00',
                                    color: '#000000',
                                    '&:hover': {
                                        backgroundColor: '#99cc00',
                                    }
                                }}
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                size="small"
                            >
                                Sair
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box sx={{
                    flexGrow: 1,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            color: '#aeea00',
                            mb: 5,
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                        }}
                    >
                        Painel Administrativo
                    </Typography>

                    <Paper elevation={4} sx={{
                        p: 4,
                        mb: 5,
                        width: '100%',
                        maxWidth: '800px',
                        backgroundColor: '#1e1e1e',
                        borderRadius: 2,
                        border: '1px solid #333333',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                        <Typography variant="h5" gutterBottom sx={{ color: '#aeea00', fontWeight: 'bold' }}>
                            Bem-vindo(a), {userName}!
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ color: '#ffffff' }}>
                            Selecione uma das opções abaixo para gerenciar o sistema.
                        </Typography>
                    </Paper>

                    <Grid container spacing={3} sx={{ maxWidth: '900px' }}>
                        {adminSections.map((section, index) => (
                            <Grid item xs={12} sm={6} md={index < 2 ? 6 : 4} key={index}>
                                <Button
                                    component={Link}
                                    to={section.to}
                                    fullWidth
                                    sx={{
                                        height: '170px',
                                        p: 3,
                                        backgroundColor: '#1e1e1e',
                                        color: section.color,
                                        border: `2px solid ${section.color}`,
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: section.color,
                                            color: '#000000',
                                            transform: 'translateY(-5px)',
                                            boxShadow: `0 10px 15px rgba(0,0,0,0.3), 0 0 10px ${section.color}40`
                                        },
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    <Box sx={{
                                        p: 1.5,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        mb: 1
                                    }}>
                                        {section.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        component="span"
                                        textAlign="center"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {section.title}
                                    </Typography>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box
                    component="footer"
                    sx={{
                        py: 2,
                        textAlign: 'center',
                        borderTop: '1px solid #333333',
                        mt: 'auto'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Sistema de Administração. Todos os direitos reservados.
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default SimpleAdminPanel;
