import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import '../../styles/homeAdmin/homeAdmin.css';

const sections = [
  {
    title: 'Gerenciamento de Jogos',
    baseRoute: 'Game',
    items: [
      { label: 'Adicionar Jogo', description: 'Cadastre um novo jogo no sistema', action: 'create' },
      { label: 'Editar Jogo', description: 'Atualize informações de jogos existentes', action: 'update' },
      { label: 'Remover Jogo', description: 'Exclua jogos do catálogo', action: 'delete' }
    ]
  },
  {
    title: 'Gerenciamento de Gêneros',
    baseRoute: 'Genre',
    items: [
      { label: 'Adicionar Gênero', description: 'Crie um novo gênero de jogos', action: 'create' },
      { label: 'Editar Gênero', description: 'Atualize informações de gêneros', action: 'update' },
      { label: 'Remover Gênero', description: 'Exclua gêneros existentes', action: 'delete' }
    ]
  }
];

function AdminCard({ label, description, link }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Link to={`/${link}`} style={{ textDecoration: 'none' }}>
        <Card sx={{ backgroundColor: 'var(--background-color2)', '&:hover': { backgroundColor: 'var(--background-color3)' } }}>
          <CardContent>
            <Typography variant="h6" color="text.primary" gutterBottom>{label}</Typography>
            <Typography variant="body2" color="text.secondary">{description}</Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

function HomeAdmin() {
  return (
    <div className="home-admin-container">
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <Typography variant="h3" color="text.primary" gutterBottom>Painel Administrativo</Typography>

        {sections.map((section, index) => (
          <Box
            key={index}
            sx={{ backgroundColor: 'var(--background-color3)', borderRadius: 2, boxShadow: 3, marginBottom: 4 }}
          >
            <Box sx={{ backgroundColor: 'var(--primary-color)', padding: 2, borderRadius: '8px 8px 0 0' }}>
              <Typography variant="h4" sx={{ color: 'black' }} fontWeight="bold">
                {section.title}
              </Typography>
            </Box>
            <Grid container spacing={3} padding={3}>
              {section.items.map((item, idx) => (
                <AdminCard
                  key={idx}
                  label={item.label}
                  description={item.description}
                  link={`${item.action}${section.baseRoute}`}
                />
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </div>
  );
}

export default HomeAdmin;
