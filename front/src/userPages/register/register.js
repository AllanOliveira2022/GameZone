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
import { 
  Visibility, 
  VisibilityOff
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import '../../styles/auth.css';

// Esquema de validação
const validationSchema = yup.object({
  nome: yup.string().required('Nome completo é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  dataNascimento: yup.string().required('Data de nascimento é obrigatória'),
  telefone: yup.string()
    .matches(/\(\d{2}\) \d{4,5}-\d{4}/, 'Telefone inválido')
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
      name: "",
      email: "",
      address: "",
      dateBirth: "",
      phone: "",
      password: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await UserService.signup(values.name, values.email, values.address, values.dateBirth, values.phone, values.password);
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        window.location.href = '/';
      } catch (error) {
        setErrors({ email: error.message || 'Erro ao cadastrar usuário' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
                id="dateBirth"
                name="dataNascimento"
                label="Data de Nascimento"
                InputLabelProps={{ shrink: true }}
                value={formik.values.dateBirth}
                onChange={formik.handleChange}
                error={formik.touched.dateBirth && Boolean(formik.errors.dateBirth)}
                helperText={formik.touched.dateBirth && formik.errors.dateBirth}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="phone"
                name="telefone"
                label="Telefone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="endereco"
                label="Endereço Completo"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="senha">Senha</InputLabel>
                <OutlinedInput
                  id="password"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
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
              <Button type="submit" fullWidth variant="contained" className="auth-button">
                Cadastrar
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" align="center">
                Já tem uma conta? {' '}
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