import { useNavigate } from "react-router-dom";

function HomeAdmin() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Painel Administrativo</h1>
      <button 
        onClick={() => navigate("/createGame")} 
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginTop: "20px"
        }}
      >
        Cadastrar Jogo
      </button>
    </div>
  );
}

export default HomeAdmin;
