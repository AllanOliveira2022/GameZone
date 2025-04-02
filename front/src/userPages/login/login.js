import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
  Link as MuiLink,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Definindo as cores da paleta como constantes
const colors = {
  primary500: "#26ff00",
  primary300: "#8aff63",
  primary700: "#1caa00",
  background400: "#101010",
  background300: "#1a1a1a",
  background200: "#272727",
  textPrimary: "#e7ffea",
  textSecondary: "#c2ffb0",
  error: "#ff3333",
  neutral600: "#b9b9b9"
};

// Tema personalizado para o login
const loginTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary500,
      contrastText: colors.background400
    },
    background: {
      default: colors.background400,
      paper: colors.background300
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary
    },
    error: {
      main: colors.error
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.primary700,
            },
            '&:hover fieldset': {
              borderColor: colors.primary500,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary500,
            },
            color: colors.textPrimary,
          },
          '& .MuiInputLabel-root': {
            color: colors.primary500,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: colors.primary500,
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: '1rem',
          padding: '12px 0',
          transition: 'all 0.3s ease'
        },
        contained: {
          backgroundColor: colors.primary500,
          color: colors.background400,
          '&:hover': {
            backgroundColor: colors.primary300,
            boxShadow: `0 0 15px ${colors.primary500}`
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: colors.primary500,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
            color: colors.primary300
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background300,
          border: `1px solid ${colors.primary700}`,
          boxShadow: `0 4px 20px rgba(38, 255, 0, 0.1)`
        }
      }
    }
  }
});

// Esquema de validação com Yup
const validationSchema = yup.object({
  email: yup
    .string()
    .email('Digite um e-mail válido')
    .required('E-mail é obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),
});

function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Dados do login:', values);
      // Simulando login bem-sucedido
      navigate('/home');
    },
  });

  return (
    <ThemeProvider theme={loginTheme}>
      <Container 
        component="main" 
        maxWidth="xs"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(to bottom, ${colors.background400}, ${colors.background200})`
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: '8px'
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            sx={{ 
              mb: 3,
              color: colors.primary500,
              textShadow: '0 0 8px rgba(38, 255, 0, 0.5)',
              fontWeight: 'bold'
            }}
          >
            Login
          </Typography>
          
          <Box 
            component="form" 
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
            noValidate
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2,
                mb: 3,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Entrar
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <MuiLink 
                  component={Link} 
                  to="/register" 
                  variant="body2"
                  sx={{
                    display: 'block',
                    textAlign: 'center'
                  }}
                >
                  Não tem uma conta? Cadastre-se
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default Login;