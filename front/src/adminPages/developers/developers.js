import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DeveloperService } from '../../services/developerService';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    CircularProgress,
    IconButton,
    ThemeProvider,
    createTheme,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormHelperText,
} from '@mui/material';
import { Add, Edit, DeleteOutline, ArrowBack, Search, Clear } from '@mui/icons-material';

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

function DevelopersAdmin() {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
    });
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cnpj: '',
        description: '',
    });
    const [errors, setErrors] = useState({
        name: false,
    });

    useEffect(() => {
        fetchDevelopers();
    }, [pagination.page, pagination.limit, searchTerm]);

    const fetchDevelopers = async () => {
        try {
            setLoading(true);
            const filters = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
            };
            const result = await DeveloperService.getDevelopers(filters);
            setDevelopers(result.data);
            setPagination(prev => ({
                ...prev,
                total: result.total,
            }));
        } catch (error) {
            console.error('Failed to fetch developers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleEditDeveloper = (developerId) => {
        navigate(`/updateDeveloper/${developerId}`);
    };

    const handleDeleteDeveloper = (developerId) => {
        navigate(`/deleteDeveloper/${developerId}`);
    };

    const handleOpenAddDialog = () => {
        setFormData({ name: '', cnpj: '', description: '' });
        setErrors({ name: false });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveDeveloper = async () => {
        if (!formData.name.trim()) {
            setErrors({ name: true });
            return;
        }

        try {
            await DeveloperService.createDeveloper(formData);
            setOpenDialog(false);
            fetchDevelopers();
        } catch (error) {
            console.error('Failed to save developer:', error);
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

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ padding: '20px', backgroundColor: darkTheme.palette.background.default, minHeight: '100vh', color: darkTheme.palette.text.primary }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <IconButton color="primary" component={Link} to="/homeadmin">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        Gerenciamento de Desenvolvedoras
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleOpenAddDialog}
                    >
                        Adicionar Desenvolvedora
                    </Button>
                </Box>

                {/* Barra de pesquisa */}
                <Box mb={3}>
                    <TextField
                        variant="outlined"
                        placeholder="Pesquisar desenvolvedoras..."
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
                ) : developers.length === 0 ? (
                    <Box textAlign="center" py={4} color={darkTheme.palette.text.secondary}>
                        <Typography variant="body1">
                            Nenhuma desenvolvedora encontrada.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={2}>
                            {developers.map((developer) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={developer.id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: darkTheme.palette.background.paper, color: darkTheme.palette.text.primary }}>
                                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                            <Typography gutterBottom variant="subtitle1" component="h3" noWrap>
                                                {developer.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                CNPJ: {developer.cnpj || 'Não informado'}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {developer.description || 'Sem descrição'}
                                            </Typography>
                                        </CardContent>
                                        <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                startIcon={<Edit />}
                                                onClick={() => handleEditDeveloper(developer.id)}
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
                                                onClick={() => handleDeleteDeveloper(developer.id)}
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

                {/* Modal para adicionar nova desenvolvedora */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle color="primary">Adicionar Desenvolvedora</DialogTitle>
                    <DialogContent>
                        <Box component="form" sx={{ mt: 2 }}>
                            <FormControl fullWidth error={errors.name} sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Nome da Desenvolvedora"
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
                                    <FormHelperText error>O nome da desenvolvedora é obrigatório</FormHelperText>
                                )}
                            </FormControl>

                            <TextField
                                fullWidth
                                label="CNPJ (Opcional)"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleFormChange}
                                variant="outlined"
                                sx={{ mb: 3 }}
                                InputProps={{
                                    style: { color: darkTheme.palette.text.primary },
                                }}
                                InputLabelProps={{
                                    style: { color: darkTheme.palette.text.secondary },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Descrição (Opcional)"
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
                        <Button onClick={handleSaveDeveloper} color="primary">
                            Salvar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}

export default DevelopersAdmin;