import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <header className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-stack-md max-w-[1200px] mx-auto bg-background">
          <div className="lg:hidden">
            <span className="text-headline-md font-headline-md font-bold text-primary">CuidarJuntos</span>
          </div>
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-label-md w-full placeholder-on-surface-variant"
              placeholder="Procurar medicamentos, tarefas..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all"
            >
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all"
            >
              <span className="material-symbols-outlined text-on-surface-variant">help</span>
            </button>
            <img
              alt="Ana Silva"
              className="w-10 h-10 rounded-full object-cover lg:hidden"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCDnVybTrO6mTIvJLMl6MInsemM7oWvnN3PONRYsMgSkYUxeLLx419FoiPt-R5MNSQ4jEXIZQ5qNEgKfmByUxDidDJUem8av1LlIhehwpAuAPXQuIhxq60VhCf2N-mvQqijGHSnpxR6xXowkL9sc_J7DTf5CN0MqCdn5s-wFvKeiw9u4vzq7-BVzW1y2EnMXI95h0K2GhFBkErsFE588LlbPeNWpTxDN9G3qZ2rsG4lmighZ_W_FPvyZ39YfGHFVstQIP46XmDfna1"
            />
          </div>
        </header>

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <section className="mb-stack-lg">
            <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2">Bom dia, Ana</h1>
            <p className="text-body-lg text-on-surface-variant">
              Hoje há 2 medicamentos, 1 tarefa pendente e nenhuma consulta marcada.
            </p>
          </section>

          <section className="mb-stack-lg">
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-4 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:opacity-90 transition-all scale-100 active:scale-95"
              >
                <span className="material-symbols-outlined">add_circle</span>
                <span className="text-label-md">Adicionar medicamento</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-4 bg-secondary text-on-secondary rounded-full font-bold shadow-lg hover:opacity-90 transition-all scale-100 active:scale-95"
              >
                <span className="material-symbols-outlined">event</span>
                <span className="text-label-md">Marcar consulta</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-4 bg-surface-container-high text-primary rounded-full font-bold hover:bg-surface-container-highest transition-all"
              >
                <span className="material-symbols-outlined">playlist_add</span>
                <span className="text-label-md">Criar tarefa</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-4 bg-surface-container-high text-primary rounded-full font-bold hover:bg-surface-container-highest transition-all"
              >
                <span className="material-symbols-outlined">upload_file</span>
                <span className="text-label-md">Enviar documento</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-4 bg-error-container text-on-error-container rounded-full font-bold hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined">medical_services</span>
                <span className="text-label-md">Ficha de emergência</span>
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">Medicamentos</h3>
                  <p className="text-label-sm text-on-surface-variant">Próximas tomas para hoje</p>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl">pill</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-primary-fixed/20 rounded-xl">
                  <div className="bg-primary text-on-primary p-2 rounded-lg mr-3">
                    <span className="material-symbols-outlined">alarm</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-label-md font-bold">Aspirina 100mg</p>
                    <p className="text-label-sm text-on-surface-variant">09:00 • Após o pequeno-almoço</p>
                  </div>
                  <input
                    className="w-6 h-6 rounded-lg text-primary border-outline-variant focus:ring-primary"
                    type="checkbox"
                  />
                </div>
                <div className="flex items-center p-3 bg-surface-container rounded-xl">
                  <div className="bg-outline-variant text-on-surface-variant p-2 rounded-lg mr-3">
                    <span className="material-symbols-outlined">alarm</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-label-md font-bold">Multivitamínico</p>
                    <p className="text-label-sm text-on-surface-variant">13:00 • Durante o almoço</p>
                  </div>
                  <input
                    className="w-6 h-6 rounded-lg text-primary border-outline-variant focus:ring-primary"
                    type="checkbox"
                  />
                </div>
              </div>
              <button
                type="button"
                className="mt-6 w-full text-center text-primary font-bold text-label-md py-2 hover:bg-primary-fixed/10 rounded-lg transition-colors"
              >
                Ver plano completo
              </button>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">Consultas</h3>
                  <p className="text-label-sm text-on-surface-variant">Agenda da semana</p>
                </div>
                <span className="material-symbols-outlined text-secondary text-3xl">calendar_today</span>
              </div>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-secondary-container/30 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-secondary text-2xl">event_busy</span>
                </div>
                <p className="text-label-md font-semibold text-on-surface">Sem consultas marcadas</p>
                <p className="text-label-sm text-on-surface-variant mt-1">
                  Aproveite para descansar ou organizar tarefas pendentes.
                </p>
              </div>
              <button
                type="button"
                className="mt-6 w-full text-center text-secondary font-bold text-label-md py-2 hover:bg-secondary-fixed/10 rounded-lg transition-colors"
              >
                Agendar nova consulta
              </button>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">Tarefas</h3>
                  <p className="text-label-sm text-on-surface-variant">1 pendente</p>
                </div>
                <span className="material-symbols-outlined text-tertiary text-3xl">assignment</span>
              </div>
              <div className="space-y-4">
                <div className="group flex items-start p-4 border border-outline-variant rounded-xl hover:border-primary transition-colors cursor-pointer">
                  <div className="bg-tertiary-container/10 text-tertiary p-2 rounded-lg mr-4">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-label-md font-bold group-hover:text-primary">Comprar gaze e álcool</p>
                    <p className="text-label-sm text-on-surface-variant">Farmácia Central • Urgente</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="mt-6 w-full text-center text-on-surface-variant font-bold text-label-md py-2 hover:bg-surface-container-highest rounded-lg transition-colors"
              >
                Ver todas as tarefas
              </button>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40 lg:col-span-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">Documentos</h3>
                  <p className="text-label-sm text-on-surface-variant">Recentes</p>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl">description</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-label-md font-medium truncate">Análises_Julho_2024.pdf</p>
                    <p className="text-[10px] text-on-surface-variant">Adicionado há 2 dias</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-primary">description</span>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-label-md font-medium truncate">Receita_Dra_Marta.jpg</p>
                    <p className="text-[10px] text-on-surface-variant">Adicionado há 1 semana</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">Contactos</h3>
                  <p className="text-label-sm text-on-surface-variant">Emergência rápida</p>
                </div>
                <span className="material-symbols-outlined text-error text-3xl">emergency</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-error-container/10 rounded-2xl flex flex-col items-center text-center">
                  <img
                    alt="Dr. Roberto"
                    className="w-12 h-12 rounded-full mb-2 object-cover border-2 border-white"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzLuUldVxFr6oTpwHfCR_cVjegacX1rcjLvifvyX6Et7c2Rbb87al0JjVPLYWFXOl2EyfzCcyGitnRz4IBMTZRlH6rQ7A1DJfVZh8HAkAZVgx5jOC64U7abkiPm05ErRwzFvAS2eY2Btzu2ZL_-cJxoQRi22zEPQf6AzWc-lMIXpMg5iSk6R4n2yhssg2Gzz_Ty032HmkrUC1YBVpRFsIBtVupeWk-zhrWvx-sCA532QDre749A_tpID_x2wzpawCbdAnxUmp6MAIO"
                  />
                  <p className="text-label-sm font-bold truncate w-full">Dr. Roberto</p>
                  <p className="text-[10px] text-on-surface-variant">Cardiologista</p>
                </div>
                <div className="p-3 bg-secondary-container/10 rounded-2xl flex flex-col items-center text-center">
                  <img
                    alt="Enf. Maria"
                    className="w-12 h-12 rounded-full mb-2 object-cover border-2 border-white"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUyZABvFDj4v2v_L2kF80wk7dfsTqaSxi7fGRONoUqMKf7tYECWk22U2YE19y18YwtOXu0G47n7ys9iYMOeS1WMqZ8Ay1ZM17gUvC087UqCVZKCDFAmE12c3VLA9HS7lTKVSktfSL3cnbKXQLvbkhe0XR6VSR--BhEUCP-hPR_z5vpfcUfSwrvA8WlCD8_AmHeTmIn-EM5mimVypWa6aWQIyzDxUY-xehaKvrAEcEIEBrGyQG2HwsGXn8u5n2d8V2BBnVfWAZYgReL"
                  />
                  <p className="text-label-sm font-bold truncate w-full">Enf. Maria</p>
                  <p className="text-[10px] text-on-surface-variant">Cuidados 24h</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">Notas</h3>
                  <p className="text-label-sm text-on-surface-variant">Lembretes de cuidado</p>
                </div>
                <span className="material-symbols-outlined text-tertiary text-3xl">event_note</span>
              </div>
              <div className="bg-tertiary-fixed/30 p-4 rounded-xl rotate-1">
                <p className="text-body-md italic text-on-tertiary-fixed-variant">
                  &ldquo;Lembrar de medir a tensão arterial amanhã de manhã antes da medicação. O paciente
                  sentiu-se um pouco tonto hoje à tarde.&rdquo;
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="text-primary font-bold text-label-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span> Editar nota
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
