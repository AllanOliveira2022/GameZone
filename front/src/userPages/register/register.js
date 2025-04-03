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
  VisibilityOff,
  Phone,
  Email,
  Home,
  Person
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Esquema de validação
const validationSchema = yup.object({
  nome: yup.string().required('Nome completo é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  dataNascimento: yup.string().required('Data de nascimento é obrigatória'),
  telefone: yup.string()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido')
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
        window.location.href = '/'; // Redireciona para a página de login
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

  const formatPhone = (value) => {
    if (!value) return value;
    
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 2) return `(${nums}`;
    if (nums.length <= 6) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
    if (nums.length <= 10) return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`;
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7,11)}`;
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 2 }}>
      <Paper elevation={3} sx={{ 
        p: { xs: 2, sm: 3 },
        mx: { xs: 1, sm: 2 },
        my: 2
      }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ mb: 2 }}>
          Cadastro
        </Typography>
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={1.5}>
            {/* Nome Completo */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                id="nome"
                name="nome"
                label="Nome Completo"
                value={formik.values.nome}
                onChange={formik.handleChange}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 0.5 }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                id="email"
                name="email"
                label="E-mail"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 0.5 }}
              />
            </Grid>

            {/* Data de Nascimento */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                id="dateBirth"
                name="dataNascimento"
                label="Data de Nascimento"
                InputLabelProps={{ shrink: true }}
                value={formik.values.dateBirth}
                onChange={formik.handleChange}
                error={formik.touched.dateBirth && Boolean(formik.errors.dateBirth)}
                helperText={formik.touched.dateBirth && formik.errors.dateBirth}
                sx={{ mb: 0.5 }}
              />
            </Grid>

            {/* Telefone */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                id="phone"
                name="telefone"
                label="Telefone"
                value={formik.values.phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  formik.setFieldValue('phone', formatted);
                }}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 0.5 }}
              />
            </Grid>

            {/* Endereço */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                id="address"
                name="endereco"
                label="Endereço Completo"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 0.5 }}
              />
            </Grid>

            {/* Senha */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 0.5 }}>
                <InputLabel htmlFor="senha">Senha</InputLabel>
                <OutlinedInput
                  id="password"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Senha"
                />
                <FormHelperText error>
                  {formik.touched.senha && formik.errors.senha}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Confirmar Senha */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 0.5 }}>
                <InputLabel htmlFor="confirmarSenha">Confirmar Senha</InputLabel>
                <OutlinedInput
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.confirmarSenha}
                  onChange={formik.handleChange}
                  error={formik.touched.confirmarSenha && Boolean(formik.errors.confirmarSenha)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirmar Senha"
                />
                <FormHelperText error>
                  {formik.touched.confirmarSenha && formik.errors.confirmarSenha}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Botão de Cadastro */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="medium"
                sx={{ 
                  mt: 1,
                  mb: 1,
                  py: 1,
                  fontSize: '0.875rem'
                }}
              >
                Cadastrar
              </Button>
            </Grid>

            {/* Link para Login */}
            <Grid item xs={12}>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, fontSize: '0.875rem' }}>
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