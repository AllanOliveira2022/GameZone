import React from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../services/userService';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import '../../styles/auth/auth.css';

// Esquema de validação
const validationSchema = yup.object({
  nome: yup.string().required('Nome completo é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  dataNascimento: yup.string().required('Data de nascimento é obrigatória'),
  telefone: yup.string()
  .matches(/^\d{10,11}$/, 'Telefone inválido')
  .required('Telefone é obrigatório'),
  endereco: yup.string().required('Endereço é obrigatório'),
  senha: yup.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .required('Senha é obrigatória'),
  confirmarSenha: yup.string()
    .oneOf([yup.ref('senha'), null], 'As senhas devem coincidir')
    .required('Confirmação de senha é obrigatória')
});

function Register() {
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      nome: '',
      email: '',
      dataNascimento: '',
      telefone: '',
      endereco: '',
      senha: '',
      confirmarSenha: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await UserService.signup({
          name: values.nome,
          email: values.email,
          address: values.endereco,
          dateBirth: values.dataNascimento,
          phone: values.telefone,
          password: values.senha
        });
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        window.location.href = '/';
      } catch (error) {
        setErrors({ email: error.message || 'Erro ao cadastrar usuário' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container component="main" maxWidth="xs" className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Typography component="h1" variant="h5" align="center" className="auth-title">
          Cadastro
        </Typography>

        <form onSubmit={formik.handleSubmit} className="auth-form">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="nome"
                name="nome"
                label="Nome Completo"
                value={formik.values.nome}
                onChange={formik.handleChange}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="E-mail"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                label="Data de Nascimento"
                InputLabelProps={{ shrink: true }}
                value={formik.values.dataNascimento}
                onChange={formik.handleChange}
                error={formik.touched.dataNascimento && Boolean(formik.errors.dataNascimento)}
                helperText={formik.touched.dataNascimento && formik.errors.dataNascimento}
              />
            </Grid>

            <Grid item xs={12}>
            <TextField
              fullWidth
              id="telefone"
              name="telefone"
              label="Telefone"
              value={formik.values.telefone}
              onChange={formik.handleChange}
              error={formik.touched.telefone && Boolean(formik.errors.telefone)}
              helperText={formik.touched.telefone && formik.errors.telefone}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="endereco"
                name="endereco"
                label="Endereço Completo"
                value={formik.values.endereco}
                onChange={formik.handleChange}
                error={formik.touched.endereco && Boolean(formik.errors.endereco)}
                helperText={formik.touched.endereco && formik.errors.endereco}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.senha && Boolean(formik.errors.senha)}>
                <InputLabel htmlFor="senha">Senha</InputLabel>
                <OutlinedInput
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.senha}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Senha"
                />
                <FormHelperText>{formik.touched.senha && formik.errors.senha}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.confirmarSenha && Boolean(formik.errors.confirmarSenha)}>
                <InputLabel htmlFor="confirmarSenha">Confirmar Senha</InputLabel>
                <OutlinedInput
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.confirmarSenha}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirmar Senha"
                />
                <FormHelperText>{formik.touched.confirmarSenha && formik.errors.confirmarSenha}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" className="auth-button">
                Cadastrar
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" align="center">
                Já tem uma conta?{' '}
                <MuiLink component={Link} to="/" underline="hover">
                  Faça login
                </MuiLink>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default Register;
