import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GenreService } from '../../services/genreService';
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
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormHelperText,
    InputAdornment,
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
    },
});

function GenresAdmin() {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [errors, setErrors] = useState({
        name: false,
    });

    useEffect(() => {
        fetchGenres();
    }, [pagination.page, pagination.limit, searchTerm]);

    const fetchGenres = async () => {
        try {
            setLoading(true);
            const filters = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
            };

            const result = await GenreService.getGenres(filters);
            setGenres(result.data);
            setPagination((prev) => ({
                ...prev,
                total: result.total,
            }));
        } catch (error) {
            console.error('Failed to fetch genres:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setFormData({ name: '', description: '' });
        setErrors({ name: false });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveGenre = async () => {
        if (!formData.name.trim()) {
            setErrors({ name: true });
            return;
        }

        try {
            await GenreService.createGenre(formData);
            setOpenDialog(false);
            fetchGenres();
        } catch (error) {
            console.error('Failed to save genre:', error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'name' && errors.name) {
            setErrors({ name: false });
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleResetSearch = () => {
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
                        Gerenciamento de Gêneros
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleOpenAddDialog}
                    >
                        Adicionar Gênero
                    </Button>
                </Box>

                {/* Barra de pesquisa */}
                <Box mb={3}>
                    <TextField
                        variant="outlined"
                        placeholder="Pesquisar gêneros..."
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
                                    <IconButton onClick={handleResetSearch} edge="end" color="secondary">
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

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : genres.length === 0 ? (
                    <Box textAlign="center" py={4} color={darkTheme.palette.text.secondary}>
                        <Typography variant="body1">
                            Nenhum gênero encontrado.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={2}>
                            {genres.map((genre) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={genre.id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: darkTheme.palette.background.paper, color: darkTheme.palette.text.primary }}>
                                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                            <Typography gutterBottom variant="subtitle1" component="h3" noWrap>
                                                {genre.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {genre.description || 'Sem descrição'}
                                            </Typography>
                                        </CardContent>
                                        <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                startIcon={<Edit />}
                                                onClick={() => navigate(`/updateGenre/${genre.id}`)}
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
                                                onClick={() => navigate(`/deleteGenre/${genre.id}`)}
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

                {/* Modal para adicionar novo gênero */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle color="primary">Adicionar Gênero</DialogTitle>
                    <DialogContent>
                        <Box component="form" sx={{ mt: 2 }}>
                            <FormControl fullWidth error={errors.name} sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Nome do Gênero"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    error={errors.name}
                                    variant="outlined"
                                    InputProps={{
                                        style: { color: darkTheme.palette.text.primary },
                                    }}
                                    InputLabelProps={{
                                        style: { color: darkTheme.palette.text.secondary },
                                    }}
                                />
                                {errors.name && (
                                    <FormHelperText error>O nome do gênero é obrigatório</FormHelperText>
                                )}
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Descrição"
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                multiline
                                rows={4}
                                variant="outlined"
                                InputProps={{
                                    style: { color: darkTheme.palette.text.primary },
                                }}
                                InputLabelProps={{
                                    style: { color: darkTheme.palette.text.secondary },
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveGenre} color="primary">
                            Salvar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}

export default GenresAdmin;