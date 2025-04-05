import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GameService } from '../../../services/gameService';
import { GenreService } from '../../../services/genreService';
import { PlatformService } from '../../../services/platformService';
import { DeveloperService } from '../../../services/developerService';

function CreateGame() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    genreID: '',
    platformID: '',
    developerID: '',
    createdAt: ''
  });
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const loadOptions = async () => {
    setOptionsLoading(true);
    try {
      // Carrega gêneros usando GenreService
      const genresResponse = await GenreService.getGenres({ limit: 100 });
      setGenres(genresResponse.data);

      // Carrega plataformas usando PlatformService
      const platformsResponse = await PlatformService.getPlatforms({ limit: 100 });
      setPlatforms(platformsResponse.data);

      // Carrega desenvolvedores usando DeveloperService
      const developersResponse = await DeveloperService.getDevelopers({ limit: 100 });
      setDevelopers(developersResponse.data);
    } catch (error) {
      console.error("Erro ao carregar opções:", error);
      setError('Erro ao carregar opções. Tente recarregar a página.');
    } finally {
      setOptionsLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
  
    try {
      const response = await GameService.createGame(formData);
      
      if (response.success) {
        setSuccessMessage(response.message);
        
        // Verifica se o game e id existem antes de navegar
        if (response.game && response.game.id) {
          setTimeout(() => {
            navigate(`/gamesAdmin/${response.game.id}`);
          }, 1500);
        } else {
          // Se não tiver id, apenas mostra mensagem de sucesso
          console.warn('Jogo criado, mas ID não retornado na resposta:', response);
        }
      } else {
        setError(response.message || 'Erro ao criar jogo');
      }
    } catch (err) {
      console.error('Erro ao criar jogo:', err);
      setError(err.response?.data?.message || 'Erro ao criar jogo. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      padding: 3,
      backgroundColor: '#101010',
      minHeight: '100vh',
      color: '#e7ffea'
    }}>
      <h2 style={{ 
        color: '#26ff00',
        textAlign: 'center',
        marginBottom: '2rem',
        textShadow: '0 0 5px #26ff00'
      }}>Criar Jogo</h2>
      
      {successMessage && (
        <Alert severity="success" sx={{ 
          backgroundColor: '#1a1a1a',
          color: '#e7ffea',
          border: '1px solid #26ff00',
          marginBottom: '1rem'
        }}>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ 
          backgroundColor: '#1a1a1a',
          color: '#e7ffea',
          border: '1px solid #ff3e3e',
          marginBottom: '1rem'
        }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                  borderColor: '#32e514',
              },
              '&:hover fieldset': {
                  borderColor: '#26ff00',
              },
              '&.Mui-focused fieldset': {
                  borderColor: '#26ff00',
              },
              color: '#e7ffea',
            },
            '& .MuiInputLabel-root': {
              color: '#32e514',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#26ff00',
            }
          }}
        />
        
        <TextField
          label="Descrição"
          variant="outlined"
          fullWidth
          margin="normal"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          rows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                  borderColor: '#32e514',
              },
              '&:hover fieldset': {
                  borderColor: '#26ff00',
              },
              '&.Mui-focused fieldset': {
                  borderColor: '#26ff00',
              },
              color: '#e7ffea',
            },
            '& .MuiInputLabel-root': {
              color: '#32e514',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#26ff00',
            }
          }}
        />
        
        <TextField
          label="Preço"
          variant="outlined"
          fullWidth
          margin="normal"
          name="price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                  borderColor: '#32e514',
              },
              '&:hover fieldset': {
                  borderColor: '#26ff00',
              },
              '&.Mui-focused fieldset': {
                  borderColor: '#26ff00',
              },
              color: '#e7ffea',
            },
            '& .MuiInputLabel-root': {
              color: '#32e514',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#26ff00',
            }
          }}
        />
        
        <FormControl fullWidth margin="normal" required sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#32e514',
            },
            '&:hover fieldset': {
                borderColor: '#26ff00',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#26ff00',
            },
            color: '#e7ffea',
          },
          '& .MuiInputLabel-root': {
            color: '#32e514',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#26ff00',
          }
        }}>
          <InputLabel>Gênero</InputLabel>
          <Select
            name="genreID"
            value={formData.genreID}
            onChange={handleChange}
            label="Gênero"
            disabled={optionsLoading}
          >
            {genres.map((genre) => (
              <MenuItem 
                key={genre.id} 
                value={genre.id}
                sx={{
                  backgroundColor: '#1a1a1a',
                  color: '#e7ffea',
                  '&:hover': {
                    backgroundColor: '#272727',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#1fcc00',
                    color: '#101010'
                  }
                }}
              >
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#32e514',
            },
            '&:hover fieldset': {
                borderColor: '#26ff00',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#26ff00',
            },
            color: '#e7ffea',
          },
          '& .MuiInputLabel-root': {
            color: '#32e514',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#26ff00',
          }
        }}>
          <InputLabel>Plataforma</InputLabel>
          <Select
            name="platformID"
            value={formData.platformID}
            onChange={handleChange}
            label="Plataforma"
            disabled={optionsLoading}
          >
            {platforms.map((platform) => (
              <MenuItem 
                key={platform.id} 
                value={platform.id}
                sx={{
                  backgroundColor: '#1a1a1a',
                  color: '#e7ffea',
                  '&:hover': {
                    backgroundColor: '#272727',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#1fcc00',
                    color: '#101010'
                  }
                }}
              >
                {platform.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#32e514',
            },
            '&:hover fieldset': {
                borderColor: '#26ff00',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#26ff00',
            },
            color: '#e7ffea',
          },
          '& .MuiInputLabel-root': {
            color: '#32e514',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#26ff00',
          }
        }}>
          <InputLabel>Desenvolvedor</InputLabel>
          <Select
            name="developerID"
            value={formData.developerID}
            onChange={handleChange}
            label="Desenvolvedor"
            disabled={optionsLoading}
          >
            {developers.map((developer) => (
              <MenuItem 
                key={developer.id} 
                value={developer.id}
                sx={{
                  backgroundColor: '#1a1a1a',
                  color: '#e7ffea',
                  '&:hover': {
                    backgroundColor: '#272727',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#1fcc00',
                    color: '#101010'
                  }
                }}
              >
                {developer.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Data de Criação"
          variant="outlined"
          fullWidth
          margin="normal"
          name="createdAt"
          value={formData.createdAt}
          onChange={handleChange}
          type="date"
          required
          InputLabelProps={{
            shrink: true
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                  borderColor: '#32e514',
              },
              '&:hover fieldset': {
                  borderColor: '#26ff00',
              },
              '&.Mui-focused fieldset': {
                  borderColor: '#26ff00',
              },
              color: '#e7ffea',
            },
            '& .MuiInputLabel-root': {
              color: '#32e514',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#26ff00',
            }
          }}
        />

        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          sx={{ 
            mt: 2,
            backgroundColor: '#1fcc00',
            color: '#101010',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#26ff00',
              boxShadow: '0 0 10px #26ff00'
            },
            padding: '12px 0',
            fontSize: '1rem'
          }} 
          disabled={loading || optionsLoading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#101010' }} /> : 'Criar Jogo'}
        </Button>
      </form>
    </Box>
  );
}

export default CreateGame;