import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../userPages/home/home";
import Login from "../userPages/login/login";
import Register from "../userPages/register/register";
import Game from "../userPages/game/game";
import CreateGame from "../adminPages/games/createGame/createGame";
import Library from "../userPages/library/library";
import HomeAdmin from "../userPages/admin/homeAdmin";
import ProtectedRouteAdmin from "../components/midgame"; // ajuste o caminho se necessário


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/createGame" element={<ProtectedRouteAdmin><CreateGame/></ProtectedRouteAdmin>}/>
        <Route path="/library" element={<Library />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;