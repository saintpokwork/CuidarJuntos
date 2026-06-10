import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../i18n/LanguageContext';
import { useCareData, FamilyRole } from '../context/CareDataContext';
import HelpTip from '../components/HelpTip';

const roleStyles: Record<string, string> = {
  Administrador: 'bg-primary-fixed text-primary',
  Familiar: 'bg-secondary-container text-on-secondary-container',
  Cuidador: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  'Apenas leitura': 'bg-surface-container-high text-on-surface-variant',
};

const Familia: React.FC = () => {
  const { data, addFamilyMember, removeFamilyMember } = useCareData();
  const { t } = useLanguage();
  const { familyMembers } = data;
  const [nome, setNome] = useState('');
  const [contacto, setContacto] = useState('');
  const [relacao, setRelacao] = useState('');
  const [funcao, setFuncao] = useState<FamilyRole>('Familiar');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = addFamilyMember({ nome, contacto, relacao, funcao });
    if (!ok) {
      setErro('Preencha nome/contacto e relação.');
      return;
    }
    setErro('');
    setNome('');
    setContacto('');
    setRelacao('');
    setFuncao('Familiar');
  };

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader title={t('pages.family.title')} showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <HelpTip text={t('home.whoFor.item2')} />
          <p className="text-body-lg text-on-surface-variant mb-stack-lg">{t('home.whoFor.item1')}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Membros convidados</h3>
              {familyMembers.length === 0 ? (
                <EmptyState message={t('pages.family.empty')} icon="group" />
              ) : (
                familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {member.avatar ? (
                        <img
                          alt={member.nome}
                          className="w-14 h-14 rounded-full object-cover"
                          src={member.avatar}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-lg">
                          {member.nome.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-headline-md font-headline-md text-on-surface">{member.nome}</p>
                        <p className="text-label-md text-on-surface-variant italic">{member.relacao}</p>
                        {member.contacto && (
                          <p className="text-label-sm text-primary">{member.contacto}</p>
                        )}
                        <span
                          className={`inline-block mt-1 px-3 py-1 rounded-full text-label-sm font-bold ${
                            roleStyles[member.funcao]
                          }`}
                        >
                          {member.funcao}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-label-sm font-bold ${
                          member.estado === 'Ativo'
                            ? 'bg-secondary-container/50 text-on-secondary-container'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {member.estado}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFamilyMember(member.id)}
                        className="p-2 rounded-full hover:bg-error-container/30 text-error transition-colors"
                        aria-label="Remover membro"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}

              <div className="p-4 bg-primary-fixed/20 rounded-2xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                <p className="text-label-md text-on-surface-variant">
                  <strong className="text-on-surface">Dica:</strong> Dividir as tarefas reduz o stress do
                  cuidador principal em até 40%.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">{t('pages.family.title')}</h3>
              <p className="text-label-md text-on-surface-variant mb-6">{t('home.whoFor.item2')}</p>
              {erro && (
                <p className="text-label-sm text-error mb-4 p-3 bg-error-container/20 rounded-xl">{erro}</p>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Nome *</label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Carlos Mendes"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Contacto *</label>
                  <input
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="E-mail ou telefone"
                    type="text"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Relação *</label>
                  <input
                    value={relacao}
                    onChange={(e) => setRelacao(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Irmão, Cuidador profissional"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Função</label>
                  <select
                    value={funcao}
                    onChange={(e) => setFuncao(e.target.value as FamilyRole)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option>Administrador</option>
                    <option>Familiar</option>
                    <option>Cuidador</option>
                    <option>Apenas leitura</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">send</span>
                  {t('global.continue')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Familia;
