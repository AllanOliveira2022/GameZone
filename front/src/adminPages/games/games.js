import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GameService } from '../../services/gameService';
import { GenreService } from '../../services/genreService';
import { PlatformService } from '../../services/platformService';
import { DeveloperService } from '../../services/developerService';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Box,
    CircularProgress,
    FormControl,
    CardMedia,
    Chip,
    MenuItem,
    InputAdornment,
    IconButton,
    ThemeProvider,
    createTheme,
    alpha
} from '@mui/material';
import { Add, Search, Clear, ArrowBack, Edit, DeleteOutline } from '@mui/icons-material';

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
        MuiSelect: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF',
                },
                icon: {
                    color: '#FFFFFF',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: '#B0B0B0',
                },
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#AEEA00',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#AEEA00',
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: alpha('#AEEA00', 0.1),
                    },
                },
            },
        },
    },
});

function GamesAdmin() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
    });
    const [filters, setFilters] = useState({
        genreID: '',
        platformID: '',
        developerID: '',
        minPrice: '',
        maxPrice: '',
    });
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [developers, setDevelopers] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [genresRes, platformsRes, developersRes] = await Promise.all([
                    GenreService.getGenres(),
                    PlatformService.getPlatforms(),
                    DeveloperService.getDevelopers(),
                ]);

                setGenres(genresRes.data);
                setPlatforms(platformsRes.data);
                setDevelopers(developersRes.data);

                fetchGames();
            } catch (err) {
                console.error('Erro ao carregar dados iniciais:', err);
                setLoading(false);
            }
        };

        const fetchGames = async () => {
            try {
                setLoading(true);
                const params = {
                    ...filters,
                    page: pagination.page,
                    limit: pagination.limit,
                    search: searchTerm,
                };

                const response = await GameService.getGames(params);

                const gamesWithNumericPrice = response.data.map((game) => ({
                    ...game,
                    price: Number(game.price) || 0,
                }));

                setGames(gamesWithNumericPrice);
                setPagination((prev) => ({
                    ...prev,
                    total: response.total,
                }));
            } catch (err) {
                console.error('Erro ao carregar jogos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [filters, pagination.page, pagination.limit, searchTerm]);

    const handleAddGame = () => {
        navigate('/createGame');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const resetFilters = () => {
        setFilters({
            genreID: '',
            platformID: '',
            developerID: '',
            minPrice: '',
            maxPrice: '',
        });
        setSearchTerm('');
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ padding: '20px', backgroundColor: darkTheme.palette.background.default, minHeight: '100vh', color: darkTheme.palette.text.primary }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <IconButton color="primary" component={Link} to="/homeadmin">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        Gerenciamento de Jogos
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddGame}
                    >
                        Adicionar Jogo
                    </Button>
                </Box>

                {/* Barra de pesquisa */}
                <Box mb={3}>
                    <TextField
                        variant="outlined"
                        placeholder="Pesquisar jogos..."
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="primary" />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton onClick={resetFilters} edge="end" color="secondary">
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                backgroundColor: darkTheme.palette.background.paper,
                                color: darkTheme.palette.text.primary,
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: darkTheme.palette.text.secondary,
                                },
                                '&:hover fieldset': {
                                    borderColor: darkTheme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: darkTheme.palette.primary.main,
                                },
                            },
                        }}
                    />
                </Box>

                {/* Filtros */}
                <Box mb={3} display="flex" gap={2} flexWrap="wrap" alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <TextField
                            select
                            label="Gênero"
                            name="genreID"
                            value={filters.genreID}
                            onChange={handleFilterChange}
                            size="small"
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            backgroundColor: darkTheme.palette.background.paper,
                                            color: darkTheme.palette.text.primary,
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {genres.map((genre) => (
                                <MenuItem key={genre.id} value={genre.id}>
                                    {genre.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <TextField
                            select
                            label="Plataforma"
                            name="platformID"
                            value={filters.platformID}
                            onChange={handleFilterChange}
                            size="small"
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            backgroundColor: darkTheme.palette.background.paper,
                                            color: darkTheme.palette.text.primary,
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="">Todas</MenuItem>
                            {platforms.map((platform) => (
                                <MenuItem key={platform.id} value={platform.id}>
                                    {platform.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <TextField
                            select
                            label="Desenvolvedor"
                            name="developerID"
                            value={filters.developerID}
                            onChange={handleFilterChange}
                            size="small"
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            backgroundColor: darkTheme.palette.background.paper,
                                            color: darkTheme.palette.text.primary,
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {developers.map((developer) => (
                                <MenuItem key={developer.id} value={developer.id}>
                                    {developer.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <Button
                        variant="outlined"
                        onClick={resetFilters}
                        startIcon={<Clear />}
                        size="small"
                        color="secondary"
                    >
                        Limpar Filtros
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : games.length === 0 ? (
                    <Box textAlign="center" py={4} color={darkTheme.palette.text.secondary}>
                        <Typography variant="body1">
                            Nenhum jogo encontrado com os filtros selecionados.
                        </Typography>
                        <Button
                            variant="text"
                            onClick={resetFilters}
                            sx={{ mt: 2, color: darkTheme.palette.primary.main }}
                        >
                            Limpar filtros
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={2}>
                            {games.map((game) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: darkTheme.palette.background.paper, color: darkTheme.palette.text.primary }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={game.imageUrl || '/placeholder-game.jpg'}
                                            alt={game.name}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                            <Typography gutterBottom variant="subtitle1" component="h3" noWrap>
                                                {game.name}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                                                {game.genre && (
                                                    <Chip label={game.genre.name} size="small" sx={{ mb: 0.5, color: darkTheme.palette.text.primary, backgroundColor: alpha(darkTheme.palette.primary.main, 0.3) }} />
                                                )}
                                                {game.platform && (
                                                    <Chip label={game.platform.name} size="small" variant="outlined" sx={{ mb: 0.5, borderColor: darkTheme.palette.secondary.main, color: darkTheme.palette.text.primary }} />
                                                )}
                                            </Box>

                                            <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                                                R$ {game.price.toFixed(2)}
                                            </Typography>
                                        </CardContent>
                                        <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                startIcon={<Edit />}
                                                onClick={() => navigate(`/updateGame/${game.id}`)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                startIcon={<DeleteOutline />}
                                                sx={{ borderColor: darkTheme.palette.error.main, color: darkTheme.palette.error.main }}
                                                onClick={() => navigate(`/deleteGame/${game.id}`)}
                                            >
                                                Excluir
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box mt={3} display="flex" justifyContent="center" alignItems="center">
                            <Button
                                disabled={pagination.page === 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                                size="small"
                                color="primary"
                            >
                                Anterior
                            </Button>
                            <Typography variant="body2" sx={{ mx: 2, color: darkTheme.palette.text.secondary }}>
                                Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
                            </Typography>
                            <Button
                                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                                onClick={() => handlePageChange(pagination.page + 1)}
                                size="small"
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

export default GamesAdmin;