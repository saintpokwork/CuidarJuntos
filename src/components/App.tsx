import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Perfil from '../pages/Perfil';
import Medicamentos from '../pages/Medicamentos';
import Consultas from '../pages/Consultas';
import Tarefas from '../pages/Tarefas';
import Documentos from '../pages/Documentos';
import Emergencia from '../pages/Emergencia';
import Familia from '../pages/Familia';
import Notas from '../pages/Notas';
import Definicoes from '../pages/Definicoes';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/perfil" element={<Perfil />} />
      <Route path="/dashboard/medicamentos" element={<Medicamentos />} />
      <Route path="/dashboard/consultas" element={<Consultas />} />
      <Route path="/dashboard/tarefas" element={<Tarefas />} />
      <Route path="/dashboard/documentos" element={<Documentos />} />
      <Route path="/dashboard/emergencia" element={<Emergencia />} />
      <Route path="/dashboard/familia" element={<Familia />} />
      <Route path="/dashboard/notas" element={<Notas />} />
      <Route path="/dashboard/definicoes" element={<Definicoes />} />
    </Routes>
  );
};

export default App;
