import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home/home";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import Game from "../pages/game/game";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;