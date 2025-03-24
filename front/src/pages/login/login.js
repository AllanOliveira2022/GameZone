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
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

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
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center">
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
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          
          <Grid container justifyContent="flex-end">
            <Grid item>
              <MuiLink 
                component={Link} 
                to="/register" 
                variant="body2"
              >
                Não tem uma conta? Cadastre-se
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;