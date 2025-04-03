import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../userPages/home/home";
import Login from "../userPages/login/login";
import Register from "../userPages/register/register";
import Game from "../userPages/game/game";
import CreateGame from "../adminPages/games/createGame/createGame";
import Library from "../userPages/library/library";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/createGame" element={<CreateGame />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;