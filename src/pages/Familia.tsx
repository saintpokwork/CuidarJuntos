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

const statusStyles: Record<string, string> = {
  Ativo: 'bg-secondary-container/50 text-on-secondary-container',
  'Convite pendente': 'bg-cj-terra/15 text-cj-terra',
  'Convite enviado': 'bg-cj-terra/15 text-cj-terra',
  Removido: 'bg-error-container/30 text-error',
};

const Familia: React.FC = () => {
  const { data, storageMode, currentUserRole, isCurrentUserAdmin, canManageMembers, addFamilyMember, removeFamilyMember } = useCareData();
  const { t } = useLanguage();
  const { familyMembers } = data;
  const [nome, setNome] = useState('');
  const [contacto, setContacto] = useState('');
  const [relacao, setRelacao] = useState('');
  const [funcao, setFuncao] = useState<FamilyRole>('Familiar');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !contacto.trim() || !relacao.trim()) {
      setErro(t('pages.family.emailRequired') || 'Preencha nome/contacto e relação.');
      return;
    }
    const ok = addFamilyMember({ nome: nome.trim(), contacto: contacto.trim(), relacao: relacao.trim(), funcao });
    if (!ok) {
      setErro(t('global.error'));
      return;
    }
    setErro('');
    setNome('');
    setContacto('');
    setRelacao('');
    setFuncao('Familiar');
  };

  const handleRemove = (memberId: string) => {
    if (!canManageMembers) {
      setErro(t('pages.family.onlyAdminsCanManage'));
      return;
    }
    removeFamilyMember(memberId);
  };

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader title={t('pages.family.title')} showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <HelpTip text={t('pages.family.help') || t('home.whoFor.item2')} />

          {/* Mode-specific notices */}
          {storageMode === 'demo' && (
            <div className="p-4 bg-cj-terra/10 rounded-2xl flex items-start gap-3 mb-stack-lg">
              <span className="material-symbols-outlined text-cj-terra">info</span>
              <p className="text-label-md text-cj-terra">{t('pages.family.demoInviteNote')}</p>
            </div>
          )}
          {storageMode === 'cloud' && (
            <div className="p-4 bg-primary-fixed/20 rounded-2xl flex items-start gap-3 mb-stack-lg">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-label-md text-on-surface-variant">{t('pages.family.cloudInviteNote')}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">{t('pages.family.members')}</h3>
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
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-label-sm font-bold ${
                              roleStyles[member.funcao] || roleStyles.Familiar
                            }`}
                          >
                            {member.funcao}
                          </span>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-label-sm font-bold ${
                              statusStyles[member.estado] || statusStyles['Convite pendente']
                            }`}
                          >
                            {member.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {canManageMembers && (
                        <button
                          type="button"
                          onClick={() => handleRemove(member.id)}
                          className="p-2 rounded-full hover:bg-error-container/30 text-error transition-colors"
                          aria-label={t('pages.family.removeMember')}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

              <div className="p-4 bg-primary-fixed/20 rounded-2xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                <p className="text-label-md text-on-surface-variant">
                  <strong className="text-on-surface">{t('pages.family.tip')}</strong>
                </p>
              </div>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">{t('pages.family.title')}</h3>
              <p className="text-label-md text-on-surface-variant mb-6">{t('pages.family.inviteDescription')}</p>
              {erro && (
                <p className="text-label-sm text-error mb-4 p-3 bg-error-container/20 rounded-xl">{erro}</p>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.family.name')} *</label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder={t('pages.family.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.family.email')} *</label>
                  <input
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder={t('pages.family.emailPlaceholder')}
                    type="email"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.family.relationship')} *</label>
                  <input
                    value={relacao}
                    onChange={(e) => setRelacao(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder={t('pages.family.relationshipPlaceholder')}
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.family.role')}</label>
                  <select
                    value={funcao}
                    onChange={(e) => setFuncao(e.target.value as FamilyRole)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="Administrador">{t('pages.family.roleAdmin')}</option>
                    <option value="Familiar">{t('pages.family.roleFamily')}</option>
                    <option value="Cuidador">{t('pages.family.roleCaregiver')}</option>
                    <option value="Apenas leitura">{t('pages.family.roleViewer')}</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">send</span>
                  {storageMode === 'cloud'
                    ? t('pages.family.savePendingInvite')
                    : t('pages.family.simulateInvite')}
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