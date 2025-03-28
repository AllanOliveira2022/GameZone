import React from "react";
import GameCard from "../../components/gameCard/gameCard";

function Home() {
    const sampleGame = {
        id: 1,
        name: "Cyberpunk 2077",
        description: "Um RPG de ação em mundo aberto ambientado em Night City.",
        genreId: 1,
        platformId: 2,
        developerId: 4,
        price: "199.99",
        createdAt: "2020-12-25",
        image: "teste"
    };

    return(
        <div>
            <h1>Home</h1>
            <GameCard game={sampleGame} />
        </div>
    )
}

export default Home;