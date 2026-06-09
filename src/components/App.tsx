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
import Mais from '../pages/Mais';
import Privacidade from '../pages/Privacidade';
import Termos from '../pages/Termos';
import NotFound from '../pages/NotFound';
import FeedbackMessage from './FeedbackMessage';
import { useCareData } from '../context/CareDataContext';

const AppRoutes: React.FC = () => {
  const { feedback } = useCareData();
  return (
    <>
      <FeedbackMessage message={feedback} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/mais" element={<Mais />} />
        <Route path="/dashboard/perfil" element={<Perfil />} />
        <Route path="/dashboard/medicamentos" element={<Medicamentos />} />
        <Route path="/dashboard/consultas" element={<Consultas />} />
        <Route path="/dashboard/tarefas" element={<Tarefas />} />
        <Route path="/dashboard/documentos" element={<Documentos />} />
        <Route path="/dashboard/emergencia" element={<Emergencia />} />
        <Route path="/dashboard/familia" element={<Familia />} />
        <Route path="/dashboard/notas" element={<Notas />} />
        <Route path="/dashboard/definicoes" element={<Definicoes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => <AppRoutes />;

export default App;
