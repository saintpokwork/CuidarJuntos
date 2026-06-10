import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { useCareData } from '../context/CareDataContext';

const Perfil: React.FC = () => {
  const { data, updateCareProfile } = useCareData();
  const { careProfile } = data;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    nome: careProfile.nome,
    dataNascimento: careProfile.dataNascimento,
    morada: careProfile.morada,
    numeroSNS: careProfile.numeroSNS,
    alergias: careProfile.alergias.join(', '),
    condicoes: careProfile.condicoes.join(', '),
    medicoFamilia: careProfile.medicoFamilia,
    farmaciaHabitual: careProfile.farmaciaHabitual,
    notasImportantes: careProfile.notasImportantes,
  });

  useEffect(() => {
    setForm({
      nome: careProfile.nome,
      dataNascimento: careProfile.dataNascimento,
      morada: careProfile.morada,
      numeroSNS: careProfile.numeroSNS,
      alergias: careProfile.alergias.join(', '),
      condicoes: careProfile.condicoes.join(', '),
      medicoFamilia: careProfile.medicoFamilia,
      farmaciaHabitual: careProfile.farmaciaHabitual,
      notasImportantes: careProfile.notasImportantes,
    });
  }, [careProfile]);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!form.nome.trim()) return;
    updateCareProfile({
      nome: form.nome.trim(),
      dataNascimento: form.dataNascimento.trim(),
      morada: form.morada.trim(),
      numeroSNS: form.numeroSNS.trim(),
      alergias: form.alergias
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      condicoes: form.condicoes
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      medicoFamilia: form.medicoFamilia.trim(),
      farmaciaHabitual: form.farmaciaHabitual.trim(),
      notasImportantes: form.notasImportantes.trim(),
    });
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      nome: careProfile.nome,
      dataNascimento: careProfile.dataNascimento,
      morada: careProfile.morada,
      numeroSNS: careProfile.numeroSNS,
      alergias: careProfile.alergias.join(', '),
      condicoes: careProfile.condicoes.join(', '),
      medicoFamilia: careProfile.medicoFamilia,
      farmaciaHabitual: careProfile.farmaciaHabitual,
      notasImportantes: careProfile.notasImportantes,
    });
  };

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader title="Perfil do familiar" showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <div className="glass-card rounded-[24px] p-8 soft-shadow border border-white/40 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined text-5xl">elderly</span>
                </div>
                <div>
                  <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1">
                    {careProfile.nome}
                  </h2>
                  <p className="text-body-md text-on-surface-variant">Familiar ao cuidado</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {editMode ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-3 bg-surface-container-high text-on-surface rounded-full font-bold hover:bg-surface-container-hover transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-5 py-3 bg-primary text-on-primary rounded-full font-bold hover:opacity-90 transition-all"
                    >
                      Guardar alterações
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="px-5 py-3 bg-primary text-on-primary rounded-full font-bold hover:opacity-90 transition-all"
                  >
                    Editar perfil
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-label-sm font-bold text-on-surface block">Nome *</label>
                <input
                  disabled={!editMode}
                  value={form.nome}
                  onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
                  className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none disabled:cursor-not-allowed"
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-3">
                <label className="text-label-sm font-bold text-on-surface block">Data de nascimento</label>
                <input
                  disabled={!editMode}
                  value={form.dataNascimento}
                  onChange={(e) => setForm((prev) => ({ ...prev, dataNascimento: e.target.value }))}
                  className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none disabled:cursor-not-allowed"
                  placeholder="Ex: 12 de março de 1948"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-label-sm font-bold text-on-surface block">Morada</label>
                <input
                  disabled={!editMode}
                  value={form.morada}
                  onChange={(e) => setForm((prev) => ({ ...prev, morada: e.target.value }))}
                  className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none disabled:cursor-not-allowed"
                  placeholder="Rua, número, localidade"
                />
              </div>
              <div className="space-y-3">
                <label className="text-label-sm font-bold text-on-surface block">Número SNS</label>
                <input
                  disabled={!editMode}
                  value={form.numeroSNS}
                  onChange={(e) => setForm((prev) => ({ ...prev, numeroSNS: e.target.value }))}
                  className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none disabled:cursor-not-allowed"
                  placeholder="123 456 789"
                />
              </div>
              <div className="space-y-3">
                <label className="text-label-sm font-bold text-on-surface block">Médico de família</label>
                <input
                  disabled={!editMode}
                  value={form.medicoFamilia}
                  onChange={(e) => setForm((prev) => ({ ...prev, medicoFamilia: e.target.value }))}
                  className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none disabled:cursor-not-allowed"
                  placeholder="Nome do médico e unidade"
                />
              </div>
              <div className="space-y-3">
                <label className="text-label-sm font-bold text-on-surface block">Farmácia habitual</label>
                <input
                  disabled={!editMode}
                  value={form.farmaciaHabitual}
                  onChange={(e) => setForm((prev) => ({ ...prev, farmaciaHabitual: e.target.value }))}
                  className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none disabled:cursor-not-allowed"
                  placeholder="Nome da farmácia"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-label-sm font-bold text-on-surface block">Alergias</label>
                <input
                  disabled={!editMode}
                  value={form.alergias}
                  onChange={(e) => setForm((prev) => ({ ...prev, alergias: e.target.value }))}
                  className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none disabled:cursor-not-allowed"
                  placeholder="Separe com vírgulas"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-label-sm font-bold text-on-surface block">Condições importantes</label>
                <input
                  disabled={!editMode}
                  value={form.condicoes}
                  onChange={(e) => setForm((prev) => ({ ...prev, condicoes: e.target.value }))}
                  className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none disabled:cursor-not-allowed"
                  placeholder="Separe com vírgulas"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-label-sm font-bold text-on-surface block">Notas importantes</label>
                <textarea
                  disabled={!editMode}
                  value={form.notasImportantes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notasImportantes: e.target.value }))}
                  className="w-full px-4 py-4 bg-surface border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none disabled:cursor-not-allowed resize-none"
                  rows={4}
                  placeholder="Notas relevantes sobre o familiar"
                />
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-error text-2xl">warning</span>
                <h3 className="text-headline-md font-headline-md text-on-surface">Alergias</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {careProfile.alergias.map((alergia) => (
                  <span
                    key={alergia}
                    className="px-4 py-2 bg-error-container/30 text-on-error-container rounded-full text-label-md font-medium"
                  >
                    {alergia}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">health_and_safety</span>
                <h3 className="text-headline-md font-headline-md text-on-surface">Condições importantes</h3>
              </div>
              <ul className="space-y-2">
                {careProfile.condicoes.map((condicao) => (
                  <li key={condicao} className="flex items-center gap-2 text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                    {condicao}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">contacts</span>
              <h3 className="text-headline-md font-headline-md text-on-surface">Contactos principais</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {careProfile.contactosPrincipais.map((contacto) => (
                <div
                  key={contacto.nome}
                  className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
                    {contacto.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">{contacto.nome}</p>
                    <p className="text-label-sm text-on-surface-variant">{contacto.relacao}</p>
                    <p className="text-label-sm text-primary">{contacto.telefone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Perfil;
