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

const STORAGE_KEY = 'cuidarjuntos-care-data';

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
  return `Hoje, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const formatDateTime = (value: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pt-PT', {
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
  getEmergencySummary: () => string;
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

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
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
    showFeedback('Medicamento adicionado com sucesso.');
    return true;
  }, [showFeedback]);

  const removeMedication = useCallback((id: string) => {
    setData((prev) => ({ ...prev, medications: prev.medications.filter((m) => m.id !== id) }));
    showFeedback('Medicamento removido.');
  }, [showFeedback]);

  const updateMedicationTaken = useCallback((id: string, tomadoHoje: boolean) => {
    setData((prev) => ({
      ...prev,
      medications: prev.medications.map((m) => (m.id === id ? { ...m, tomadoHoje } : m)),
    }));
    showFeedback(tomadoHoje ? 'Medicamento marcado como tomado hoje.' : 'Toma do medicamento desmarcada.');
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
    showFeedback('Consulta marcada com sucesso.');
    return true;
  }, [showFeedback]);

  const removeAppointment = useCallback((id: string) => {
    setData((prev) => ({ ...prev, appointments: prev.appointments.filter((a) => a.id !== id) }));
    showFeedback('Consulta removida.');
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
    showFeedback('Tarefa criada com sucesso.');
    return true;
  }, [showFeedback]);

  const removeTask = useCallback((id: string) => {
    setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
    showFeedback('Tarefa removida.');
  }, [showFeedback]);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
    showFeedback('Estado da tarefa atualizado.');
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
    showFeedback('Documento adicionado com sucesso.');
    return true;
  }, [showFeedback]);

  const removeDocument = useCallback((id: string) => {
    setData((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));
    showFeedback('Documento removido.');
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
    showFeedback('Nota de cuidado adicionada.');
    return true;
  }, [showFeedback]);

  const removeCareNote = useCallback((id: string) => {
    setData((prev) => ({ ...prev, careNotes: prev.careNotes.filter((n) => n.id !== id) }));
    showFeedback('Nota removida.');
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
    showFeedback('Convite enviado com sucesso.');
    return true;
  }, [showFeedback]);

  const removeFamilyMember = useCallback((id: string) => {
    setData((prev) => ({ ...prev, familyMembers: prev.familyMembers.filter((m) => m.id !== id) }));
    showFeedback('Membro removido.');
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
    showFeedback('Perfil atualizado com sucesso.');
  }, [showFeedback]);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(getInitialCareData());
    showFeedback('Dados de demonstração repostos.');
  }, [showFeedback]);

  const importDemoData = useCallback((demoData: CareData) => {
    setData(demoData);
    showFeedback('Dados de demonstração importados.');
  }, [showFeedback]);

  const getEmergencySummary = useCallback(() => {
    const profile = data.careProfile;
    const meds = data.medications
      .filter((m) => m.estado === 'Ativo')
      .map((m) => `${m.nome} ${m.dosagem}`)
      .join(', ');
    const contacts = data.emergencyContacts
      .slice(0, 3)
      .map((c) => `${c.nome}: ${c.telefone}`)
      .join('\n');
    return [
      `FICHA DE EMERGÊNCIA — ${profile.nome}`,
      `Data de nascimento: ${profile.dataNascimento}`,
      `Número SNS: ${profile.numeroSNS}`,
      `Morada: ${profile.morada}`,
      `Alergias: ${profile.alergias.join(', ')}`,
      `Medicamentos: ${meds || 'Nenhum'}`,
      `Médico de família: ${profile.medicoFamilia}`,
      `Farmácia habitual: ${profile.farmaciaHabitual}`,
      `Notas importantes: ${profile.notasImportantes || 'Nenhuma'}`,
      `Contactos:\n${contacts}`,
    ].join('\n');
  }, [data.medications, data.emergencyContacts, data.careProfile]);

  const dashboardSummary = useMemo(() => {
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
    const nextMedicationTime = times[0] || 'Sem horário definido';
    const pendingTasks = data.tasks.filter((t) => t.status === 'por_fazer').length;
    const overdueTasks = data.tasks.filter((t) => {
      const date = t.dataLimite.trim().toLowerCase();
      return t.status !== 'concluido' && (date.includes('ontem') || date.includes('passado'));
    }).length;
    const aptCount = data.appointments.length;
    const aptText =
      aptCount === 0
        ? 'nenhuma consulta marcada'
        : `${aptCount} consulta${aptCount !== 1 ? 's' : ''} marcada${aptCount !== 1 ? 's' : ''}`;
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
    if (profileCompleteness < 100) suggestions.push('Complete o perfil do familiar.');
    if (medCount === 0) suggestions.push('Adicione medicamentos para acompanhar as tomas diárias.');
    if (aptCount === 0) suggestions.push('Registe a próxima consulta.');
    if (data.emergencyContacts.length === 0)
      suggestions.push('Reveja os contactos de emergência.');
    if (suggestions.length === 0) suggestions.push('Continue a usar o painel para manter tudo atualizado.');

    return {
      saudacao: `Bom dia, ${caregiver.nome}`,
      resumo: `Hoje há ${medCount} medicamento${medCount !== 1 ? 's' : ''}, ${pendingTasks} tarefa${pendingTasks !== 1 ? 's' : ''} pendente${pendingTasks !== 1 ? 's' : ''} e ${aptText}.`,
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
