import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.id}`); // Redireciona para a página do jogo
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        m: 2,
        backgroundColor: "var(--background-color2)", 
        color: "var(--text-color)", 
        cursor: "pointer", 
        transition: "0.3s",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Sombra
        borderRadius: "8px", // Borda arredondada
        "&:hover": { 
          backgroundColor: "var(--background-color3)", // Fundo um pouco escuro ao passar o mouse
          boxShadow: "7px 7px 7px 0px rgba(38, 255, 0, 0.5)" // Sombra suave e neon ao passar o mouse
        } 
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="140"
        image={game.image || "https://via.placeholder.com/140"} // Placeholder se não houver imagem
        alt={game.name}
      />
      <CardContent sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ color: "var(--primary-color)", fontWeight: 'bold' }}>
            {game.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--secondary-color)", fontWeight: 'bold' }}>
            {game.platformId} {/* Adicionando a plataforma */}
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--text-color)"}}>
            {game.description}
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--accent-color)" }}>
            R$ {parseFloat(game.price).toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GameCard;
