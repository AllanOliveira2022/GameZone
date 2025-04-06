import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Box,
    CircularProgress,
    IconButton,
    ThemeProvider,
    createTheme,
    InputAdornment
} from '@mui/material';
import { Add, Search, ArrowBack, Edit, Delete } from '@mui/icons-material';
import { PlatformService } from '../../services/platformService';

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
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1A1A1A',
                    borderRadius: 12,
                },
            },
        },
    },
});

function PlatformsAdmin() {
    const navigate = useNavigate();
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
    });

    useEffect(() => {
        fetchPlatforms();
    }, [pagination.page, pagination.limit, searchTerm]);

    const fetchPlatforms = async () => {
        try {
            setLoading(true);
            const filters = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
            };
            const result = await PlatformService.getPlatforms(filters);
            setPlatforms(result.data);
            setPagination((prev) => ({
                ...prev,
                total: result.total,
            }));
        } catch (error) {
            console.error('Failed to fetch platforms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPlatform = () => {
        navigate('/createPlatform');
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleEditPlatform = (platformId) => {
        navigate(`/updatePlatform/${platformId}`);
    };

    const handleDeletePlatform = (platformId) => {
        navigate(`/deletePlatform/${platformId}`);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ padding: '20px', backgroundColor: darkTheme.palette.background.default, minHeight: '100vh', color: darkTheme.palette.text.primary }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <IconButton color="primary" component={Link} to="/homeadmin">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        Gerenciamento de Plataformas
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddPlatform}
                    >
                        Adicionar Plataforma
                    </Button>
                </Box>

                <Box mb={3}>
                    <TextField
                        variant="outlined"
                        placeholder="Pesquisar plataformas..."
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: darkTheme.palette.primary.main }} />
                                </InputAdornment>
                            ),
                            sx: {
                                backgroundColor: darkTheme.palette.background.paper,
                                color: darkTheme.palette.text.primary,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: darkTheme.palette.text.secondary,
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: darkTheme.palette.primary.main,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: darkTheme.palette.primary.main,
                                },
                            },
                        }}
                    />
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {platforms.map((platform) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={platform.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="textPrimary">
                                                {platform.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {platform.description || 'Sem descrição'}
                                            </Typography>
                                            <Box mt={2} display="flex" gap={1}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<Edit />}
                                                    onClick={() => handleEditPlatform(platform.id)}
                                                    size="small"
                                                    sx={{ color: '#FFFFFF' }} // <- Nome "Editar" em branco
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<Delete />}
                                                    onClick={() => handleDeletePlatform(platform.id)}
                                                    size="small"
                                                >
                                                    Deletar
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box mt={3} display="flex" justifyContent="center" alignItems="center">
                            <Button
                                disabled={pagination.page === 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                                color="primary"
                            >
                                Anterior
                            </Button>
                            <Typography style={{ margin: '0 16px', alignSelf: 'center', color: darkTheme.palette.text.secondary }}>
                                Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
                            </Typography>
                            <Button
                                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                                onClick={() => handlePageChange(pagination.page + 1)}
                                color="primary"
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

export default PlatformsAdmin;
