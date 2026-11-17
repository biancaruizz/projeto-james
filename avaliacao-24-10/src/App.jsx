import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Home from "./home";
import Bijus from "./bijus";
import Clans from "./clans";
import Dojutsu from "./dojutsu";
import Invocacoes from "./invocacoes";
import Kages from "./kages";
import Modos from "./modos";
import Organizacoes from "./organizacoes";
import Vila from "./vila.jsx";
import Personagem from "./personagem";
import Private from "./private";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* acessíveis por todos */}
        <Route path="/" element={<Login />} />

        {/*Acessíveis por Cliente e Admin */}
        <Route 
          path="/home" 
          element={
            <Private>
              <Home />
            </Private>
          } 
        />

        <Route 
          path="/bijus" 
          element={
            <Private > 
              <Bijus />
            </Private>
          } 
        />

        <Route 
          path="/clans" 
          element={
            <Private>
              <Clans />
            </Private>
          } 
        />

        <Route 
          path="/dojutsu" 
          element={
            <Private>
              <Dojutsu />
            </Private>
          } 
        />

        <Route 
          path="/invocacoes" 
          element={
            <Private >
              <Invocacoes />
            </Private>
          } 
        />

        <Route 
          path="/kages" 
          element={
            <Private >
              <Kages />
            </Private>
          } 
        />

        <Route 
          path="/modos" 
          element={
            <Private>
              <Modos />
            </Private>
          } 
        />

        <Route 
          path="/organizacoes" 
          element={
            <Private>
              <Organizacoes />
            </Private>
          } 
        />

        <Route 
          path="/vila" 
          element={
            <Private>
              <Vila />
            </Private>
          } 
        />

        <Route 
          path="/personagem" 
          element={
            <Private >
              <Personagem />
            </Private>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;