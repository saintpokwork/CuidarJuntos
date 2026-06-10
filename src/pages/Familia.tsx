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
  const {
    data,
    storageMode,
    canManageMembers,
    addFamilyMember,
    removeFamilyMember,
    pendingInvites,
    createPendingInvite,
    cancelPendingInvite,
  } = useCareData();
  const { t } = useLanguage();
  const { familyMembers } = data;
  const [nome, setNome] = useState('');
  const [contacto, setContacto] = useState('');
  const [relacao, setRelacao] = useState('');
  const [funcao, setFuncao] = useState<FamilyRole>('Familiar');
  const [erro, setErro] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSimulatedInvite = (e: React.FormEvent) => {
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

  const handleCloudInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!contacto.trim()) {
      setErro(t('pages.family.emailRequired'));
      return;
    }
    setSubmitting(true);
    setErro('');
    const result = await createPendingInvite({
      invitedEmail: contacto.trim(),
      invitedName: nome.trim() || undefined,
      role: funcao,
      relationship: relacao.trim() || undefined,
    });
    if (result.success) {
      setNome('');
      setContacto('');
      setRelacao('');
      setFuncao('Familiar');
    } else {
      setErro(result.error || t('global.error'));
    }
    setSubmitting(false);
  };

  const handleRemove = (memberId: string) => {
    if (!canManageMembers) {
      setErro(t('pages.family.onlyAdminsCanManage'));
      return;
    }
    removeFamilyMember(memberId);
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/aceitar-convite?token=${token}`;
    navigator.clipboard.writeText(link).then(
      () => setErro(t('pages.family.inviteLinkCopied')),
      () => setErro(t('global.error')),
    );
    setTimeout(() => setErro(''), 3000);
  };

  const handleCancelInvite = async (inviteId: string) => {
    await cancelPendingInvite(inviteId);
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

              {/* Members section */}
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
                        <img alt={member.nome} className="w-14 h-14 rounded-full object-cover" src={member.avatar} />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-lg">
                          {member.nome.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-headline-md font-headline-md text-on-surface">{member.nome}</p>
                        <p className="text-label-md text-on-surface-variant italic">{member.relacao}</p>
                        {member.contacto && <p className="text-label-sm text-primary">{member.contacto}</p>}
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-bold ${roleStyles[member.funcao] || roleStyles.Familiar}`}>
                            {member.funcao}
                          </span>
                          <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-bold ${statusStyles[member.estado] || statusStyles['Convite pendente']}`}>
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

              {/* Pending Invites section (cloud only) */}
              {storageMode === 'cloud' && pendingInvites.length > 0 && (
                <>
                  <h3 className="text-headline-md font-headline-md text-on-surface mb-2 mt-8">{t('pages.family.pendingInvites')}</h3>
                  {pendingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-headline-md font-headline-md text-on-surface">{invite.invitedName || invite.invitedEmail}</p>
                        <p className="text-label-sm text-primary">{invite.invitedEmail}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-bold ${roleStyles[invite.role] || roleStyles.Familiar}`}>
                            {invite.role}
                          </span>
                          <span className="inline-block px-3 py-1 rounded-full text-label-sm font-bold bg-cj-terra/15 text-cj-terra">
                            {t('pages.family.invitePending')}
                          </span>
                        </div>
                        {invite.relationship && (
                          <p className="text-label-sm text-on-surface-variant mt-1">{invite.relationship}</p>
                        )}
                        <p className="text-label-sm text-on-surface-variant mt-1">
                          {t('pages.family.inviteExpiresAt')}: {new Date(invite.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(invite.token)}
                          className="px-4 py-2 bg-primary text-on-primary text-label-sm font-bold rounded-full hover:opacity-90 transition-all"
                        >
                          {t('pages.family.copyInviteLink')}
                        </button>
                        {canManageMembers && (
                          <button
                            type="button"
                            onClick={() => handleCancelInvite(invite.id)}
                            className="p-2 rounded-full hover:bg-error-container/30 text-error transition-colors"
                            aria-label={t('pages.family.cancelInvite')}
                          >
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="p-4 bg-primary-fixed/20 rounded-2xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                <p className="text-label-md text-on-surface-variant">
                  <strong className="text-on-surface">{t('pages.family.tip')}</strong>
                </p>
              </div>
            </div>

            {/* Invite form */}
            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">{t('pages.family.title')}</h3>
              <p className="text-label-md text-on-surface-variant mb-6">{t('pages.family.inviteDescription')}</p>
              {erro && (
                <p className={`text-label-sm mb-4 p-3 rounded-xl ${erro.includes('copiado') || erro.includes('copied') ? 'bg-secondary-container/30 text-on-secondary-container' : 'bg-error-container/20 text-error'}`}>
                  {erro}
                </p>
              )}
              <form className="space-y-4" onSubmit={storageMode === 'cloud' ? handleCloudInvite : handleSimulatedInvite}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.family.name')}</label>
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
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.family.relationship')}</label>
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
                  disabled={submitting}
                  className={`w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
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