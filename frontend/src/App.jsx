import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './views/Login';
import Home from './views/Home';
import Registo from './views/Registo';
import OngDashboard from './views/OngDashboard';
import VoluntarioDashboard from './views/VoluntarioDashboard';
import DiretorioOngs from './views/DiretorioOngs';
import DetalheVaga from './views/DetalheVaga';
import PerfilOng from './views/PerfilOng';
import EditarPerfil from './views/EditarPerfil';

export default function App() {
  const [utilizador, setUtilizador] = useState(null);
  const [aCarregar, setACarregar] = useState(true);

  // Verifica se já há sessão iniciada
  useEffect(() => {
    const userGuardado = localStorage.getItem('utilizador');
    if (userGuardado) {
      setUtilizador(JSON.parse(userGuardado));
    }
    setACarregar(false); // Já verificámos o localStorage, podemos desenhar o ecrã
  }, []);

  const fazerLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilizador');
    setUtilizador(null);
    window.location.href = '/login'; 
  };

  // Evita que o React salte de ecrã enquanto procura a sessão do utilizador
  if (aCarregar) return <div style={{ textAlign: 'center', marginTop: '50px' }}>A carregar a plataforma...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal: reencaminha logo para o login se tentarem ir à raiz */}
       <Route path="/" element={<Home />} />
        <Route path="/instituicoes" element={<DiretorioOngs />} />
        <Route path="/vaga/:id" element={<DetalheVaga />} />
        {/* O nosso ecrã de Autenticação */}
        <Route path="/login" element={<Login setUtilizador={setUtilizador} />} />
<Route path="/perfil" element={<EditarPerfil />} />
        {/* Rotas Protegidas (se não for ONG, expulsa para o login) */}
        <Route 
          path="/dashboard-ong" 
          element={
            utilizador?.tipo === 'ong' 
              ? <OngDashboard fazerLogout={fazerLogout} /> 
              : <Navigate to="/login" replace />
          } 
        />
        <Route path="/registo" element={<Registo />} /> {/* NOVA ROTA */}
        {/* Rotas Protegidas (se não for Voluntário, expulsa para o login) */}
        <Route 
          path="/dashboard-voluntario" 
          element={
            utilizador?.tipo === 'voluntario' 
              ? <VoluntarioDashboard fazerLogout={fazerLogout} /> 
              : <Navigate to="/login" replace />
          } 
        />
        <Route path="/ong/:id" element={<PerfilOng />} />
      </Routes>
    </BrowserRouter>
  );
}