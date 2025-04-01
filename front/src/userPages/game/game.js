import { useParams } from "react-router-dom";

function Game() {
    const { id } = useParams(); // Obtém o ID da URL

    return (
        <div>
            <h1>Detalhes do Jogo (ID: {id})</h1>
        </div>
    );
}

export default Game;
