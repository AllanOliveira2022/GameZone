import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../userPages/home/home";
import Login from "../userPages/login/login";
import Register from "../userPages/register/register";
import Game from "../userPages/game/game";
import Library from "../userPages/library/library";
import HomeAdmin from "../adminPages/home/home";
import ProtectedRouteAdmin from "../components/midgame"; // ajuste o caminho se necessário

import CreateGame from "../adminPages/games/createGame/createGame";
import UpdateGame from "../adminPages/games/updateGame/updateGame";
import DeleteGame from "../adminPages/games/deleteGame/deleteGame";

import CreateGenre from "../adminPages/genres/createGenre/createGenre";
import UpdateGenre from "../adminPages/genres/updateGenre/updateGenre";
import DeleteGenre from "../adminPages/genres/deleteGenre/deleteGenre";

import CreateDeveloper from "../adminPages/developers/createDeveloper/createDeveloper";
import UpdateDeveloper from "../adminPages/developers/updateDeveloper/updateDeveloper";
import DeleteDeveloper from "../adminPages/developers/deleteDeveloper/deleteDeveloper";

import CreatePlatform from "../adminPages/platforms/createPlatform/createPlatform";
import UpdatePlatform from "../adminPages/platforms/updatePlatform/updatePlatform";
import DeletePlatform from "../adminPages/platforms/deletePlatform/deletePlatform";

import GamesAdmin from "../adminPages/games/games";
import GenresAdmin from "../adminPages/genres/genres";
import DevelopersAdmin from "../adminPages/developers/developers";
import PlatformsAdmin from "../adminPages/platforms/platforms";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/library" element={<Library />} />

        <Route path="/createGame" element={<ProtectedRouteAdmin><CreateGame/></ProtectedRouteAdmin>}/>
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/updateGame/:id" element={<UpdateGame />} />
        <Route path="/deleteGame/:id" element={<DeleteGame />} />

        <Route path="/createGenre" element={<CreateGenre />} />
        <Route path="/updateGenre/:id" element={<UpdateGenre />} />
        <Route path="/deleteGenre/:id" element={<DeleteGenre />} />

        <Route path="/createDeveloper" element={<CreateDeveloper />} />
        <Route path="/updateDeveloper/:id" element={<UpdateDeveloper />} />
        <Route path="/deleteDeveloper/:id" element={<DeleteDeveloper />} />

        <Route path="/createPlatform" element={<CreatePlatform />} />
        <Route path="/updatePlatform/:id" element={<UpdatePlatform />} />
        <Route path="/deletePlatform/:id" element={<DeletePlatform />} />

        <Route path="/gamesAdmin" element={<GamesAdmin/>}/>
        <Route path="/genresAdmin" element={<GenresAdmin/>}/>
        <Route path="/developersAdmin" element={<DevelopersAdmin/>}/>
        <Route path="/platformsAdmin" element={<PlatformsAdmin/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;