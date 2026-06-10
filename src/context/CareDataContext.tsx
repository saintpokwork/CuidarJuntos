import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Appointment,
  CareData,
  CareNote,
  Document,
  DocumentCategory,
  FamilyMember,
  FamilyRole,
  Medication,
  Task,
  TaskPriority,
  TaskStatus,
  caregiver,
  getInitialCareData,
} from '../data/initialData';
import translations from '../i18n/translations';

const STORAGE_KEY = 'cuidarjuntos-care-data';

const getCurrentLang = (): 'pt' | 'en' => {
  try {
    const stored = localStorage.getItem('cuidarjuntos-language');
    return stored === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
};

const tt = (path: string): string => {
  const lang = getCurrentLang();
  const parts = path.split('.');
  let cur: any = translations[lang];
  for (const p of parts) {
    if (!cur) return '';
    cur = cur[p];
  }
  return typeof cur === 'string' ? cur : '';
};

const loadFromStorage = (): CareData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<CareData>;
      const initial = getInitialCareData();
      return {
        ...initial,
        ...parsed,
        medications: (parsed.medications ?? initial.medications).map((m) => ({
          ...m,
          tomadoHoje: m?.tomadoHoje ?? false,
        })),
        appointments: parsed.appointments ?? initial.appointments,
        tasks: parsed.tasks ?? initial.tasks,
        documents: parsed.documents ?? initial.documents,
        careNotes: parsed.careNotes ?? initial.careNotes,
        familyMembers: parsed.familyMembers ?? initial.familyMembers,
        emergencyContacts: parsed.emergencyContacts ?? initial.emergencyContacts,
        careProfile: {
          ...initial.careProfile,
          ...(parsed.careProfile ?? {}),
        },
      };
    }
  } catch {
    /* usar dados iniciais */
  }
  return getInitialCareData();
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const formatNow = () => {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const lang = getCurrentLang();
  const today = lang === 'en' ? 'Today' : 'Hoje';
  return `${today}, ${hh}:${mm}`;
};

const formatDateTime = (value: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const lang = getCurrentLang();
  const locale = lang === 'en' ? 'en-GB' : 'pt-PT';
  return date.toLocaleString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface CareDataContextValue {
  data: CareData;
  feedback: string | null;
  showFeedback: (message: string) => void;
  addMedication: (med: Omit<Medication, 'id' | 'estado' | 'instrucoes' | 'responsavel'> & { responsavel?: string; instrucoes?: string }) => boolean;
  removeMedication: (id: string) => void;
  updateMedicationTaken: (id: string, tomadoHoje: boolean) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'estado' | 'dataHora' | 'medico' | 'responsavel' | 'notas'> & { dataHora: string; medico?: string; responsavel?: string; notas?: string }) => boolean;
  removeAppointment: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'status'> & { status?: TaskStatus }) => boolean;
  removeTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addDocument: (doc: Omit<Document, 'id' | 'dataAdicao'>) => boolean;
  removeDocument: (id: string) => void;
  addCareNote: (texto: string) => boolean;
  removeCareNote: (id: string) => void;
  addFamilyMember: (member: { nome: string; contacto: string; relacao: string; funcao: FamilyRole }) => boolean;
  removeFamilyMember: (id: string) => void;
  updateCareProfile: (profile: Partial<CareData['careProfile']>) => void;
  importDemoData: (data: CareData) => void;
  resetDemoData: () => void;
  getEmergencySummary: (lang?: 'pt' | 'en') => string;
  dashboardSummary: {
    saudacao: string;
    resumo: string;
    totalMedicamentosHoje: number;
    medicamentosTomadosHoje: number;
    proximaConsulta: string;
    tarefasAtraso: number;
    perfilCompletude: number;
    sugestoes: string[];
  };
}

const CareDataContext = createContext<CareDataContextValue | null>(null);

export const CareDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CareData>(loadFromStorage);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const showFeedback = useCallback((msgKey: string) => {
    const msg = tt(msgKey) || msgKey;
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  }, []);

  const addMedication: CareDataContextValue['addMedication'] = useCallback((med) => {
    if (!med.nome.trim() || !med.dosagem.trim() || !med.horario.trim() || !med.frequencia.trim()) {
      return false;
    }
    const novo: Medication = {
      id: generateId(),
      nome: med.nome.trim(),
      dosagem: med.dosagem.trim(),
      horario: med.horario.trim(),
      frequencia: med.frequencia.trim(),
      responsavel: med.responsavel?.trim() || caregiver.nome,
      estado: 'Ativo',
      instrucoes: med.instrucoes?.trim() || '',
      tomadoHoje: false,
    };
    setData((prev) => ({ ...prev, medications: [...prev.medications, novo] }));
    showFeedback('feedback.medicationAdded');
    return true;
  }, [showFeedback]);

  const removeMedication = useCallback((id: string) => {
    setData((prev) => ({ ...prev, medications: prev.medications.filter((m) => m.id !== id) }));
    showFeedback('feedback.medicationRemoved');
  }, [showFeedback]);

  const updateMedicationTaken = useCallback((id: string, tomadoHoje: boolean) => {
    setData((prev) => ({
      ...prev,
      medications: prev.medications.map((m) => (m.id === id ? { ...m, tomadoHoje } : m)),
    }));
    showFeedback(tomadoHoje ? 'feedback.medicationTaken' : 'feedback.medicationUntaken');
  }, [showFeedback]);

  const addAppointment: CareDataContextValue['addAppointment'] = useCallback((apt) => {
    if (!apt.tipo.trim() || !apt.dataHora.trim() || !apt.local.trim()) return false;
    const novo: Appointment = {
      id: generateId(),
      tipo: apt.tipo.trim(),
      dataHora: formatDateTime(apt.dataHora),
      local: apt.local.trim(),
      medico: apt.medico?.trim() || '—',
      responsavel: apt.responsavel?.trim() || caregiver.nome,
      notas: apt.notas?.trim() || '',
      estado: 'Agendada',
    };
    setData((prev) => ({ ...prev, appointments: [...prev.appointments, novo] }));
    showFeedback('feedback.appointmentAdded');
    return true;
  }, [showFeedback]);

  const removeAppointment = useCallback((id: string) => {
    setData((prev) => ({ ...prev, appointments: prev.appointments.filter((a) => a.id !== id) }));
    showFeedback('feedback.appointmentRemoved');
  }, [showFeedback]);

  const addTask: CareDataContextValue['addTask'] = useCallback((task) => {
    if (!task.titulo.trim()) return false;
    const novo: Task = {
      id: generateId(),
      titulo: task.titulo.trim(),
      responsavel: task.responsavel?.trim() || caregiver.nome,
      prioridade: task.prioridade || 'Média',
      dataLimite: task.dataLimite?.trim() || 'Sem data',
      status: task.status || 'por_fazer',
      local: task.local?.trim() || '',
    };
    setData((prev) => ({ ...prev, tasks: [...prev.tasks, novo] }));
    showFeedback('feedback.taskAdded');
    return true;
  }, [showFeedback]);

  const removeTask = useCallback((id: string) => {
    setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
    showFeedback('feedback.taskRemoved');
  }, [showFeedback]);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
    showFeedback('feedback.taskStatusUpdated');
  }, [showFeedback]);

  const addDocument: CareDataContextValue['addDocument'] = useCallback((doc) => {
    if (!doc.titulo.trim()) return false;
    const novo: Document = {
      id: generateId(),
      titulo: doc.titulo.trim(),
      categoria: doc.categoria,
      dataAdicao: 'Agora',
      dataValidade: doc.dataValidade?.trim() || '',
      notas: doc.notas?.trim() || '',
    };
    setData((prev) => ({ ...prev, documents: [...prev.documents, novo] }));
    showFeedback('feedback.documentAdded');
    return true;
  }, [showFeedback]);

  const removeDocument = useCallback((id: string) => {
    setData((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));
    showFeedback('feedback.documentRemoved');
  }, [showFeedback]);

  const addCareNote = useCallback((texto: string) => {
    if (!texto.trim()) return false;
    const novo: CareNote = {
      id: generateId(),
      nota: texto.trim(),
      autor: caregiver.nome,
      dataHora: formatNow(),
    };
    setData((prev) => ({ ...prev, careNotes: [novo, ...prev.careNotes] }));
    showFeedback('feedback.noteAdded');
    return true;
  }, [showFeedback]);

  const removeCareNote = useCallback((id: string) => {
    setData((prev) => ({ ...prev, careNotes: prev.careNotes.filter((n) => n.id !== id) }));
    showFeedback('feedback.noteRemoved');
  }, [showFeedback]);

  const addFamilyMember: CareDataContextValue['addFamilyMember'] = useCallback((member) => {
    if (!member.nome.trim() || !member.contacto.trim() || !member.relacao.trim()) return false;
    const novo: FamilyMember = {
      id: generateId(),
      nome: member.nome.trim(),
      relacao: member.relacao.trim(),
      funcao: member.funcao,
      estado: 'Convite enviado',
      avatar: '',
      contacto: member.contacto.trim(),
    };
    setData((prev) => ({ ...prev, familyMembers: [...prev.familyMembers, novo] }));
    showFeedback('feedback.familyInvited');
    return true;
  }, [showFeedback]);

  const removeFamilyMember = useCallback((id: string) => {
    setData((prev) => ({ ...prev, familyMembers: prev.familyMembers.filter((m) => m.id !== id) }));
    showFeedback('feedback.familyRemoved');
  }, [showFeedback]);

  const updateCareProfile = useCallback((profile: Partial<CareData['careProfile']>) => {
    setData((prev) => ({
      ...prev,
      careProfile: {
        ...prev.careProfile,
        ...profile,
        atualizadoEm: new Date().toLocaleDateString('pt-PT', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      },
    }));
    showFeedback('feedback.profileUpdated');
  }, [showFeedback]);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(getInitialCareData());
    showFeedback('feedback.demoReset');
  }, [showFeedback]);

  const importDemoData = useCallback((demoData: CareData) => {
    setData(demoData);
    showFeedback('feedback.demoImported');
  }, [showFeedback]);

  const getEmergencySummary = useCallback((langOverride?: 'pt' | 'en') => {
    const lang = langOverride || getCurrentLang();
    const profile = data.careProfile;
    const meds = data.medications
      .filter((m) => m.estado === 'Ativo')
      .map((m) => `${m.nome} ${m.dosagem}`)
      .join(', ');
    const contacts = data.emergencyContacts
      .slice(0, 3)
      .map((c) => `${c.nome}: ${c.telefone}`)
      .join('\n');
    const header = lang === 'en' ? 'EMERGENCY CARD' : 'FICHA DE EMERGÊNCIA';
    const dobLabel = lang === 'en' ? 'Date of birth' : 'Data de nascimento';
    const snsLabel = lang === 'en' ? 'NHS number' : 'Número SNS';
    const addressLabel = lang === 'en' ? 'Address' : 'Morada';
    const allergiesLabel = lang === 'en' ? 'Allergies' : 'Alergias';
    const medsLabel = lang === 'en' ? 'Medications' : 'Medicamentos';
    const doctorLabel = lang === 'en' ? 'Family doctor' : 'Médico de família';
    const pharmacyLabel = lang === 'en' ? 'Usual pharmacy' : 'Farmácia habitual';
    const notesLabel = lang === 'en' ? 'Important notes' : 'Notas importantes';
    const contactsLabel = lang === 'en' ? 'Contacts' : 'Contactos';
    const noneLabel = lang === 'en' ? 'None' : 'Nenhum';
    const noneLabel2 = lang === 'en' ? 'None' : 'Nenhuma';
    return [
      `${header} — ${profile.nome}`,
      `${dobLabel}: ${profile.dataNascimento}`,
      `${snsLabel}: ${profile.numeroSNS}`,
      `${addressLabel}: ${profile.morada}`,
      `${allergiesLabel}: ${profile.alergias.join(', ')}`,
      `${medsLabel}: ${meds || noneLabel}`,
      `${doctorLabel}: ${profile.medicoFamilia}`,
      `${pharmacyLabel}: ${profile.farmaciaHabitual}`,
      `${notesLabel}: ${profile.notasImportantes || noneLabel2}`,
      `${contactsLabel}:\n${contacts}`,
    ].join('\n');
  }, [data.medications, data.emergencyContacts, data.careProfile]);

  const dashboardSummary = useMemo(() => {
    const lang = getCurrentLang();
    const medCount = data.medications.filter((m) => m.estado === 'Ativo').length;
    const medsAtivos = data.medications.filter((m) => m.estado === 'Ativo');
    const takenToday = medsAtivos.filter((m) => m.tomadoHoje).length;
    const times = medsAtivos
      .filter((m) => !m.tomadoHoje)
      .flatMap((m) => m.horario.split(',').map((item) => item.trim()))
      .map((time) => {
        const match = time.match(/^(\d{2}:\d{2})$/);
        return match ? match[1] : null;
      })
      .filter((value): value is string => !!value)
      .sort();
    const nextMedicationTime = times[0] || (lang === 'en' ? 'No time set' : 'Sem horário definido');
    const pendingTasks = data.tasks.filter((t) => t.status === 'por_fazer').length;
    const overdueTasks = data.tasks.filter((t) => {
      const date = t.dataLimite.trim().toLowerCase();
      return t.status !== 'concluido' && (date.includes('ontem') || date.includes('passado') || date.includes('yesterday') || date.includes('overdue'));
    }).length;
    const aptCount = data.appointments.length;
    const aptText =
      aptCount === 0
        ? (lang === 'en' ? 'no appointments scheduled' : 'nenhuma consulta marcada')
        : `${aptCount} ${lang === 'en' ? 'appointment' : 'consulta'}${aptCount !== 1 ? (lang === 'en' ? 's' : 's') : ''} ${lang === 'en' ? 'scheduled' : 'marcada'}${aptCount !== 1 ? (lang === 'en' ? '' : 's') : ''}`;
    const profile = data.careProfile;
    const filledFields = [
      profile.nome,
      profile.dataNascimento,
      profile.morada,
      profile.numeroSNS,
      profile.alergias.length ? 'x' : '',
      profile.condicoes.length ? 'x' : '',
      profile.medicoFamilia,
      profile.farmaciaHabitual,
      profile.notasImportantes,
    ].filter(Boolean).length;
    const profileCompleteness = Math.round((filledFields / 9) * 100);
    const suggestions: string[] = [];
    const completeProfileTip = lang === 'en' ? 'Complete the care recipient profile.' : 'Complete o perfil do familiar.';
    const addMedsTip = lang === 'en' ? 'Add medications to track daily doses.' : 'Adicione medicamentos para acompanhar as tomas diárias.';
    const addAptTip = lang === 'en' ? 'Schedule the next appointment.' : 'Registe a próxima consulta.';
    const checkContactsTip = lang === 'en' ? 'Review emergency contacts.' : 'Reveja os contactos de emergência.';
    const keepUpTip = lang === 'en' ? 'Continue using the dashboard to keep everything up to date.' : 'Continue a usar o painel para manter tudo atualizado.';
    if (profileCompleteness < 100) suggestions.push(completeProfileTip);
    if (medCount === 0) suggestions.push(addMedsTip);
    if (aptCount === 0) suggestions.push(addAptTip);
    if (data.emergencyContacts.length === 0) suggestions.push(checkContactsTip);
    if (suggestions.length === 0) suggestions.push(keepUpTip);

    const greeting = (lang === 'en' ? 'Good morning' : 'Bom dia');
    const medLabel = lang === 'en' ? 'medication' : 'medicamento';
    const taskLabel = lang === 'en' ? 'task' : 'tarefa';
    const pendLabel = lang === 'en' ? 'pending' : 'pendente';

    return {
      saudacao: `${greeting}, ${caregiver.nome}`,
      resumo: `${lang === 'en' ? 'Today there are' : 'Hoje há'} ${medCount} ${medLabel}${medCount !== 1 ? (lang === 'en' ? 's' : 's') : ''}, ${pendingTasks} ${taskLabel}${pendingTasks !== 1 ? (lang === 'en' ? 's' : 's') : ''} ${pendLabel}${pendingTasks !== 1 ? (lang === 'en' ? '' : 's') : ''} ${lang === 'en' ? 'and' : 'e'} ${aptText}.`,
      totalMedicamentosHoje: medCount,
      medicamentosTomadosHoje: takenToday,
      proximaConsulta: nextMedicationTime,
      tarefasAtraso: overdueTasks,
      perfilCompletude: profileCompleteness,
      sugestoes: suggestions,
    };
  }, [data.medications, data.tasks, data.appointments, data.emergencyContacts, data.careProfile]);

  const value: CareDataContextValue = {
    data,
    feedback,
    showFeedback,
    addMedication,
    removeMedication,
    updateMedicationTaken,
    addAppointment,
    removeAppointment,
    addTask,
    removeTask,
    updateTaskStatus,
    addDocument,
    removeDocument,
    addCareNote,
    removeCareNote,
    addFamilyMember,
    removeFamilyMember,
    updateCareProfile,
    importDemoData,
    resetDemoData,
    getEmergencySummary,
    dashboardSummary,
  };

  return <CareDataContext.Provider value={value}>{children}</CareDataContext.Provider>;
};

export const useCareData = (): CareDataContextValue => {
  const ctx = useContext(CareDataContext);
  if (!ctx) throw new Error('useCareData deve ser usado dentro de CareDataProvider');
  return ctx;
};

export type { DocumentCategory, TaskStatus, TaskPriority, FamilyRole };