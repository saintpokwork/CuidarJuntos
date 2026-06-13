import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Appointment,
  CareData,
  CareNote,
  Document,
  DocumentCategory,
  EmergencyContact,
  FamilyMember,
  FamilyRole,
  Medication,
  MedicationForm,
  MedicationDoseStatus,
  MedicationRoute,
  MedicationUnit,
  Task,
  TaskPriority,
  TaskRecurrence,
  TaskStatus,
  caregiver,
  getInitialCareData,
} from '../data/initialData';
import translations from '../i18n/translations';
import { useAuth } from './AuthContext';
import {
  buildMedicationDoses,
  getMedicationDoseTimeline,
  getNextMedicationDose,
  getDoseStatusTiming,
} from '../lib/medicationSchedule';
import {
  getOrCreateUserProfile,
  getOrCreateDefaultCareProfile,
  loadCareDataFromSupabase,
  createMedication as sbCreateMedication,
  deleteMedication as sbDeleteMedication,
  upsertMedicationDailyLog as sbUpsertMedicationDailyLog,
  createAppointment as sbCreateAppointment,
  deleteAppointment as sbDeleteAppointment,
  createTask as sbCreateTask,
  updateTask as sbUpdateTask,
  deleteTask as sbDeleteTask,
  createDocumentRecord as sbCreateDocument,
  updateDocumentRecord as sbUpdateDocument,
  deleteDocumentRecord as sbDeleteDocument,
  createCareNote as sbCreateCareNote,
  deleteCareNote as sbDeleteCareNote,
  updateCareProfile as sbUpdateCareProfile,
  uploadCareDocumentFile,
  deleteCareDocumentFile,
  getCareDocumentSignedUrl,
  validateFileForUpload,
  getCurrentUserRole as sbGetCurrentUserRole,
  getCareProfileInvites as sbGetInvites,
  createCareProfileInvite as sbCreateInvite,
  cancelCareProfileInvite as sbCancelInvite,
  removeCareProfileMember as sbRemoveCareProfileMember,
  type PendingInvite,
} from '../lib/data/supabaseDataAdapter';
import { isSupabaseConfigured } from '../lib/supabaseClient';

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
  let cur: Record<string, unknown> = translations[lang];
  for (const p of parts) {
    if (!cur) return '';
    cur = cur[p] as Record<string, unknown>;
  }
  return typeof cur === 'string' ? cur : '';
};

const getTodayKey = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const normalizeRecurrence = (value?: TaskRecurrence | string): TaskRecurrence => {
  switch (value) {
    case 'Diariamente':
    case 'daily':
      return 'daily';
    case 'Semanalmente':
    case 'weekly':
      return 'weekly';
    case 'Mensalmente':
    case 'monthly':
      return 'monthly';
    case 'Nunca':
    case 'none':
    default:
      return 'none';
  }
};

const parseFlexibleDate = (value?: string) => {
  if (!value) return null;
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;

  const ptMatch = value.match(/^(\d{1,2}) de ([a-zç]+) de (\d{4}),?\s*(\d{1,2}):(\d{2})?/i);
  if (!ptMatch) return null;

  const months: Record<string, number> = {
    janeiro: 0,
    fevereiro: 1,
    marco: 2,
    março: 2,
    abril: 3,
    maio: 4,
    junho: 5,
    julho: 6,
    agosto: 7,
    setembro: 8,
    outubro: 9,
    novembro: 10,
    dezembro: 11,
  };
  const month = months[ptMatch[2].toLowerCase()];
  if (month === undefined) return null;
  return new Date(Number(ptMatch[3]), month, Number(ptMatch[1]), Number(ptMatch[4] || 0), Number(ptMatch[5] || 0));
};

const daysUntil = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
};

const isTaskOverdue = (task: Task) => {
  if (task.status === 'concluido') return false;
  const parsed = parseFlexibleDate(task.dataLimite);
  if (parsed) return daysUntil(parsed) < 0;
  const label = task.dataLimite.trim().toLowerCase();
  return label.includes('ontem') || label.includes('passado') || label.includes('yesterday') || label.includes('overdue');
};

const normalizeMedication = (m: Medication): Medication => {
  const todayKey = getTodayKey();
  const hasCurrentDailyState = m.doseDate === todayKey && m.dosesHoje?.length;
  const dosesHoje = hasCurrentDailyState
    ? m.dosesHoje || []
    : buildMedicationDoses(m, 'por_tomar');

  return {
    ...m,
    unidade: m.unidade || (m.dosagem.toLowerCase().includes('comprimido') ? 'comprimidos' : 'mg'),
    dataFim: m.dataFim || '',
    doseDate: todayKey,
    tomadoHoje: dosesHoje.length > 0 && dosesHoje.every((dose) => dose.status === 'tomado'),
    dosesHoje,
  };
};

const normalizeTask = (task: Task): Task => ({
  ...task,
  repetir: normalizeRecurrence(task.repetir),
  concluidoEm: task.concluidoEm || '',
  concluidoPor: task.concluidoPor || '',
});

const normalizeCareData = (raw: CareData): CareData => ({
  ...raw,
  medications: raw.medications.map(normalizeMedication),
  tasks: raw.tasks.map(normalizeTask),
  appointments: raw.appointments.map((apt) => ({
    ...apt,
    dataHoraIso: apt.dataHoraIso || parseFlexibleDate(apt.dataHora)?.toISOString() || '',
    notasPreConsulta: apt.notasPreConsulta || '',
    resultadoConsulta: apt.resultadoConsulta || '',
  })),
  emergencyContacts: raw.emergencyContacts.map((contact) => ({
    ...contact,
    relacao: contact.relacao || contact.funcao,
  })),
});

const loadFromStorage = (): CareData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<CareData>;
      const initial = getInitialCareData();
      return normalizeCareData({
        ...initial,
        ...parsed,
        medications: parsed.medications ?? initial.medications,
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
      });
    }
  } catch {
    /* use initial data */
  }
  return normalizeCareData(getInitialCareData());
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

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------

export type StorageMode = 'demo' | 'cloud';
export type SyncStatus = 'idle' | 'loading' | 'saving' | 'error' | 'synced';

export interface CareNotification {
  id: string;
  type: 'doseDue' | 'doseOverdue' | 'missedDose' | 'appointmentTomorrow' | 'taskOverdue' | 'documentExpiring';
  title: string;
  body: string;
  path: string;
  actionLabel?: string;
}

export interface ActivityEvent {
  id: string;
  icon: string;
  text: string;
  when: string;
  path: string;
}

interface CareDataContextValue {
  currentUserRole: string | null;
  isCurrentUserAdmin: boolean;
  canManageMembers: boolean;
  pendingInvites: PendingInvite[];
  createPendingInvite: (input: { invitedEmail: string; invitedName?: string; role: string; relationship?: string }) => Promise<{ success: boolean; error?: string; emailSent?: boolean }>;
  cancelPendingInvite: (inviteId: string) => Promise<boolean>;
  reloadInvites: () => Promise<void>;
  data: CareData;
  notifications: CareNotification[];
  activityEvents: ActivityEvent[];
  feedback: string | null;
  storageMode: StorageMode;
  syncStatus: SyncStatus;
  syncError: string | null;
  reloadCloudData: () => Promise<void>;
  showFeedback: (message: string) => void;
  addMedication: (med: Omit<Medication, 'id' | 'estado' | 'instrucoes' | 'responsavel' | 'dosesHoje' | 'tomadoHoje'> & { responsavel?: string; instrucoes?: string; forma?: MedicationForm; via?: MedicationRoute }) => boolean;
  removeMedication: (id: string) => void;
  updateMedicationTaken: (id: string, tomadoHoje: boolean) => void;
  updateMedicationDoseStatus: (medicationId: string, doseId: string, status: MedicationDoseStatus) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'estado' | 'dataHora' | 'medico' | 'responsavel' | 'notas'> & { dataHora: string; medico?: string; responsavel?: string; notas?: string; notasPreConsulta?: string; resultadoConsulta?: string }) => boolean;
  removeAppointment: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'status'> & { status?: TaskStatus; repetir?: TaskRecurrence }) => boolean;
  removeTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addDocument: (doc: Omit<Document, 'id' | 'dataAdicao'>) => boolean;
  removeDocument: (id: string) => void;
  addDocumentWithFile: (doc: Omit<Document, 'id' | 'dataAdicao'>, file: File | null) => Promise<{ success: boolean; error?: string }>;
  getDocumentDownloadUrl: (docId: string) => Promise<string | null>;
  addCareNote: (texto: string) => boolean;
  removeCareNote: (id: string) => void;
  addFamilyMember: (member: { nome: string; contacto: string; relacao: string; funcao: FamilyRole }) => boolean;
  removeFamilyMember: (id: string) => Promise<boolean>;
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
  const { user, session } = useAuth();
  const [data, setData] = useState<CareData>(loadFromStorage);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [storageMode, setStorageMode] = useState<StorageMode>('demo');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [careProfileId, setCareProfileId] = useState<string | null>(null);
  const cloudLoadAttempted = useRef(false);

  // ---------------------------------------------------------------------------
  // Persist to localStorage in demo mode
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (storageMode === 'demo') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, storageMode]);

  // ---------------------------------------------------------------------------
  // Cloud data loading on login
  // ---------------------------------------------------------------------------
  const loadCloudData = useCallback(async () => {
    if (!user || !isSupabaseConfigured) return;

    setSyncStatus('loading');
    setSyncError(null);

    try {
      // Ensure user profile exists
      await getOrCreateUserProfile(user);

      // Get or create default care profile (seeds data on first login)
      const profileId = await getOrCreateDefaultCareProfile(user);
      if (!profileId) {
        throw new Error('Could not load or create care profile');
      }

      setCareProfileId(profileId);

      // Load all data from Supabase
      const cloudData = await loadCareDataFromSupabase(profileId);
      if (!cloudData) {
        throw new Error('Could not load care data');
      }

      setData(normalizeCareData(cloudData));
      setStorageMode('cloud');
      setSyncStatus('synced');
    } catch (err) {
      console.error('[CareDataContext] Cloud load error:', err);
      setSyncStatus('error');
      setSyncError(tt('demo.syncError'));
    }
  }, [user]);

  useEffect(() => {
    if (user && isSupabaseConfigured && !cloudLoadAttempted.current) {
      cloudLoadAttempted.current = true;
      loadCloudData();
    }

    if (!user && cloudLoadAttempted.current) {
      // Logged out — fallback to demo data
      cloudLoadAttempted.current = false;
      setCareProfileId(null);
      setStorageMode('demo');
      setSyncStatus('idle');
      setSyncError(null);
      setData(loadFromStorage());
    }
  }, [user, loadCloudData]);

  // ---------------------------------------------------------------------------
  // Reload cloud data (manual refresh)
  // ---------------------------------------------------------------------------
  const reloadCloudData = useCallback(async () => {
    if (!user || !isSupabaseConfigured || storageMode !== 'cloud') return;
    setSyncStatus('loading');
    try {
      if (careProfileId) {
        const cloudData = await loadCareDataFromSupabase(careProfileId);
        if (cloudData) {
          setData(normalizeCareData(cloudData));
          setSyncStatus('synced');
          setSyncError(null);
        }
      }
    } catch {
      setSyncStatus('error');
    }
  }, [user, careProfileId, storageMode]);

  // ---------------------------------------------------------------------------
  // Feedback
  // ---------------------------------------------------------------------------
  const showFeedback = useCallback((msgKey: string) => {
    const msg = tt(msgKey) || msgKey;
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  }, []);

  // ---------------------------------------------------------------------------
  // Helper: run cloud operation then update local state
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // CRUD: Medications
  // ---------------------------------------------------------------------------
  const addMedication: CareDataContextValue['addMedication'] = useCallback((med) => {
    if (!med.nome.trim() || !med.dosagem.trim() || !med.horario.trim() || !med.frequencia.trim()) {
      return false;
    }

    // Demo mode
    if (storageMode === 'demo') {
      const id = generateId();
      const todayKey = getTodayKey();
      const novo: Medication = {
        id,
        nome: med.nome.trim(),
        dosagem: med.dosagem.trim(),
        unidade: med.unidade,
        forma: med.forma,
        via: med.via,
        horario: med.horario.trim(),
        frequencia: med.frequencia.trim(),
        responsavel: med.responsavel?.trim() || caregiver.nome,
        estado: 'Ativo',
        instrucoes: med.instrucoes?.trim() || '',
        tomadoHoje: false,
        dataFim: med.dataFim?.trim() || '',
        doseDate: todayKey,
        dosesHoje: buildMedicationDoses({ ...med, id } as Medication, 'por_tomar'),
      };
      setData((prev) => ({ ...prev, medications: [...prev.medications, novo] }));
      showFeedback('feedback.medicationAdded');
      return true;
    }

    // Cloud mode
    if (!careProfileId) return false;
    sbCreateMedication(careProfileId, {
      nome: med.nome.trim(),
      dosagem: med.dosagem.trim(),
      unidade: med.unidade,
      forma: med.forma,
      via: med.via,
      horario: med.horario.trim(),
      frequencia: med.frequencia.trim(),
      responsavel: med.responsavel?.trim() || caregiver.nome,
      instrucoes: med.instrucoes?.trim() || '',
      dataFim: med.dataFim?.trim() || '',
    }).then((created) => {
      if (created) {
        setData((prev) => ({ ...prev, medications: [...prev.medications, normalizeMedication(created)] }));
        showFeedback('feedback.medicationAdded');
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    });
    return true; // Optimistic return for UI responsiveness
  }, [storageMode, careProfileId, showFeedback]);

  const removeMedication = useCallback((id: string) => {
    if (storageMode === 'demo') {
      setData((prev) => ({ ...prev, medications: prev.medications.filter((m) => m.id !== id) }));
      showFeedback('feedback.medicationRemoved');
      return;
    }
    sbDeleteMedication(id).then((ok) => {
      if (ok) {
        setData((prev) => ({ ...prev, medications: prev.medications.filter((m) => m.id !== id) }));
        showFeedback('feedback.medicationRemoved');
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    });
  }, [storageMode, showFeedback]);

  const updateMedicationTaken = useCallback((id: string, tomadoHoje: boolean) => {
    const currentMedication = data.medications.find((m) => m.id === id);
    if (!currentMedication) return;
    const updatedMedication: Medication = {
      ...currentMedication,
      doseDate: getTodayKey(),
      tomadoHoje,
      dosesHoje: (currentMedication.dosesHoje || []).map((dose) => ({
        ...dose,
        status: tomadoHoje ? 'tomado' : 'por_tomar',
        markedAt: tomadoHoje ? formatNow() : undefined,
        markedBy: tomadoHoje ? caregiver.nome : undefined,
      })),
    };

    setData((prev) => ({
      ...prev,
      medications: prev.medications.map((m) => (m.id === id ? updatedMedication : m)),
    }));
    showFeedback(tomadoHoje ? 'feedback.medicationTaken' : 'feedback.medicationUntaken');
    if (storageMode === 'cloud' && careProfileId) {
      sbUpsertMedicationDailyLog(careProfileId, updatedMedication).then((ok) => {
        setSyncStatus(ok ? 'synced' : 'error');
      });
    }
  }, [data.medications, storageMode, careProfileId, showFeedback]);

  const updateMedicationDoseStatus = useCallback((medicationId: string, doseId: string, status: MedicationDoseStatus) => {
    const markedAt = formatNow();
    const currentMedication = data.medications.find((med) => med.id === medicationId);
    if (!currentMedication) return;
    const dosesHoje = (currentMedication.dosesHoje || []).map((dose) =>
      dose.id === doseId
        ? {
            ...dose,
            status,
            markedAt: status === 'tomado' ? markedAt : undefined,
            markedBy: status === 'tomado' ? caregiver.nome : undefined,
          }
        : dose,
    );
    const tomadoHoje = dosesHoje.length > 0 && dosesHoje.every((dose) => dose.status === 'tomado');
    const updatedMedication: Medication = { ...currentMedication, doseDate: getTodayKey(), dosesHoje, tomadoHoje };

    setData((prev) => ({
      ...prev,
      medications: prev.medications.map((med) => (med.id === medicationId ? updatedMedication : med)),
    }));
    showFeedback(status === 'tomado' ? 'feedback.medicationTaken' : 'feedback.medicationUntaken');
    if (storageMode === 'cloud' && careProfileId) {
      sbUpsertMedicationDailyLog(careProfileId, updatedMedication).then((ok) => {
        setSyncStatus(ok ? 'synced' : 'error');
      });
    }
  }, [data.medications, storageMode, careProfileId, showFeedback]);

  // ---------------------------------------------------------------------------
  // CRUD: Appointments
  // ---------------------------------------------------------------------------
  const addAppointment: CareDataContextValue['addAppointment'] = useCallback((apt) => {
    if (!apt.tipo.trim() || !apt.dataHora.trim() || !apt.local.trim()) return false;

    if (storageMode === 'demo') {
      const novo: Appointment = {
        id: generateId(),
        tipo: apt.tipo.trim(),
        dataHora: formatDateTime(apt.dataHora),
        dataHoraIso: new Date(apt.dataHora).toISOString(),
        local: apt.local.trim(),
        medico: apt.medico?.trim() || '—',
        responsavel: apt.responsavel?.trim() || caregiver.nome,
        notas: apt.notas?.trim() || '',
        notasPreConsulta: apt.notasPreConsulta?.trim() || '',
        resultadoConsulta: apt.resultadoConsulta?.trim() || '',
        estado: 'Agendada',
      };
      setData((prev) => ({ ...prev, appointments: [...prev.appointments, novo] }));
      showFeedback('feedback.appointmentAdded');
      return true;
    }

    if (!careProfileId) return false;
    sbCreateAppointment(careProfileId, {
      tipo: apt.tipo.trim(),
      dataHora: apt.dataHora,
      local: apt.local.trim(),
      medico: apt.medico?.trim(),
      responsavel: apt.responsavel?.trim(),
      notas: apt.notas?.trim(),
      notasPreConsulta: apt.notasPreConsulta?.trim(),
      resultadoConsulta: apt.resultadoConsulta?.trim(),
    }).then((created) => {
      if (created) {
        setData((prev) => ({ ...prev, appointments: [...prev.appointments, created] }));
        showFeedback('feedback.appointmentAdded');
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    });
    return true;
  }, [storageMode, careProfileId, showFeedback]);

  const removeAppointment = useCallback((id: string) => {
    if (storageMode === 'demo') {
      setData((prev) => ({ ...prev, appointments: prev.appointments.filter((a) => a.id !== id) }));
      showFeedback('feedback.appointmentRemoved');
      return;
    }
    sbDeleteAppointment(id).then((ok) => {
      if (ok) {
        setData((prev) => ({ ...prev, appointments: prev.appointments.filter((a) => a.id !== id) }));
        showFeedback('feedback.appointmentRemoved');
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    });
  }, [storageMode, showFeedback]);

  // ---------------------------------------------------------------------------
  // CRUD: Tasks
  // ---------------------------------------------------------------------------
  const addTask: CareDataContextValue['addTask'] = useCallback((task) => {
    if (!task.titulo.trim()) return false;

    if (storageMode === 'demo') {
      const novo: Task = {
        id: generateId(),
        titulo: task.titulo.trim(),
        responsavel: task.responsavel?.trim() || caregiver.nome,
        prioridade: task.prioridade || 'Média',
        dataLimite: task.dataLimite?.trim() || 'Sem data',
        status: task.status || 'por_fazer',
        local: task.local?.trim() || '',
        repetir: normalizeRecurrence(task.repetir),
        concluidoEm: task.status === 'concluido' ? formatNow() : '',
        concluidoPor: task.status === 'concluido' ? task.responsavel?.trim() || caregiver.nome : '',
      };
      setData((prev) => ({ ...prev, tasks: [...prev.tasks, novo] }));
      showFeedback('feedback.taskAdded');
      return true;
    }

    if (!careProfileId) return false;
    sbCreateTask(careProfileId, {
      titulo: task.titulo.trim(),
      responsavel: task.responsavel?.trim() || caregiver.nome,
      prioridade: task.prioridade || 'Média',
      dataLimite: task.dataLimite?.trim() || 'Sem data',
        status: task.status || 'por_fazer',
        local: task.local?.trim() || '',
        repetir: normalizeRecurrence(task.repetir),
      }).then((created) => {
      if (created) {
        setData((prev) => ({ ...prev, tasks: [...prev.tasks, normalizeTask(created)] }));
        showFeedback('feedback.taskAdded');
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    });
    return true;
  }, [storageMode, careProfileId, showFeedback]);

  const removeTask = useCallback((id: string) => {
    if (storageMode === 'demo') {
      setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
      showFeedback('feedback.taskRemoved');
      return;
    }
    sbDeleteTask(id).then((ok) => {
      if (ok) {
        setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
        showFeedback('feedback.taskRemoved');
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    });
  }, [storageMode, showFeedback]);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    if (storageMode === 'demo') {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (
          t.id === id
            ? {
                ...t,
                status,
                concluidoEm: status === 'concluido' ? formatNow() : '',
                concluidoPor: status === 'concluido' ? t.responsavel || caregiver.nome : '',
              }
            : t
        )),
      }));
      showFeedback('feedback.taskStatusUpdated');
      return;
    }
    const completedAt = status === 'concluido' ? formatNow() : '';
    sbUpdateTask(id, {
      status,
      concluidoEm: completedAt,
      concluidoPor: status === 'concluido' ? caregiver.nome : '',
    }).then((updated) => {
      if (updated) {
        setData((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (
            t.id === id
              ? normalizeTask({
                  ...updated,
                  concluidoEm: status === 'concluido' ? updated.concluidoEm || completedAt : '',
                  concluidoPor: status === 'concluido' ? updated.concluidoPor || t.responsavel || caregiver.nome : '',
                })
              : t
          )),
        }));
        showFeedback('feedback.taskStatusUpdated');
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    });
  }, [storageMode, showFeedback]);

  // ---------------------------------------------------------------------------
  // CRUD: Documents
  // ---------------------------------------------------------------------------
  const addDocument: CareDataContextValue['addDocument'] = useCallback((doc) => {
    if (!doc.titulo.trim()) return false;

    if (storageMode === 'demo') {
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
    }

    if (!careProfileId) return false;
    sbCreateDocument(careProfileId, {
      titulo: doc.titulo.trim(),
      categoria: doc.categoria,
      dataValidade: doc.dataValidade?.trim() || '',
      notas: doc.notas?.trim() || '',
    }).then((created) => {
      if (created) {
        setData((prev) => ({ ...prev, documents: [...prev.documents, created] }));
        showFeedback('feedback.documentAdded');
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    });
    return true;
  }, [storageMode, careProfileId, showFeedback]);

  const removeDocument = useCallback((id: string) => {
    if (storageMode === 'demo') {
      setData((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));
      showFeedback('feedback.documentRemoved');
      return;
    }
    // In cloud mode, first delete storage file if it exists, then delete metadata
    const doc = data.documents.find((d) => d.id === id);
    const deleteFilePromise = doc?.filePath
      ? deleteCareDocumentFile(doc.filePath).catch((err) => {
          console.error('[CareDataContext] Failed to delete storage file:', err);
        })
      : Promise.resolve();

    deleteFilePromise.then(() => {
      sbDeleteDocument(id).then((ok) => {
        if (ok) {
          setData((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));
          showFeedback('feedback.documentRemoved');
          setSyncStatus('synced');
        } else {
          setSyncStatus('error');
        }
      });
    });
  }, [storageMode, showFeedback, data.documents]);

  /**
   * Add a document with an optional file upload.
   * In demo mode, stores metadata only (no actual upload).
   * In cloud mode, creates metadata row, uploads file, then updates row with file info.
   */
  const addDocumentWithFile: CareDataContextValue['addDocumentWithFile'] = useCallback(
    async (doc, file) => {
      if (!doc.titulo.trim()) return { success: false, error: 'Title is required' };

      // Demo mode — no actual upload, just simulate metadata
      if (storageMode === 'demo') {
        const novo: Document = {
          id: generateId(),
          titulo: doc.titulo.trim(),
          categoria: doc.categoria,
          dataAdicao: 'Agora',
          dataValidade: doc.dataValidade?.trim() || '',
          notas: doc.notas?.trim() || '',
          fileName: file?.name || undefined,
        };
        setData((prev) => ({ ...prev, documents: [...prev.documents, novo] }));
        showFeedback('feedback.documentAdded');
        return { success: true };
      }

      // Cloud mode
      if (!careProfileId) return { success: false, error: 'No care profile' };

      // Validate file if provided
      if (file) {
        const validationError = validateFileForUpload(file);
        if (validationError) return { success: false, error: validationError };
      }

      try {
        // Step 1: Create metadata row
        const created = await sbCreateDocument(careProfileId, {
          titulo: doc.titulo.trim(),
          categoria: doc.categoria,
          dataValidade: doc.dataValidade?.trim() || '',
          notas: doc.notas?.trim() || '',
        });

        if (!created) return { success: false, error: 'Failed to create document metadata' };

        // Step 2: Upload file if provided
        if (file) {
          const filePath = await uploadCareDocumentFile(careProfileId, created.id, file);
          if (!filePath) {
            // Upload failed — clean up the metadata row we just created
            await sbDeleteDocument(created.id).catch(() => {});
            return { success: false, error: 'Failed to upload file' };
          }

          // Step 3: Update metadata row with file info
          const updated = await sbUpdateDocument(created.id, {
            filePath,
            fileName: file.name,
          });

          if (updated) {
            setData((prev) => ({ ...prev, documents: [...prev.documents, updated] }));
          } else {
            // Update failed — clean up storage and metadata
            await deleteCareDocumentFile(filePath).catch(() => {});
            await sbDeleteDocument(created.id).catch(() => {});
            return { success: false, error: 'Failed to update document with file info' };
          }
        } else {
          // No file — just add the metadata to local state
          setData((prev) => ({ ...prev, documents: [...prev.documents, created] }));
        }

        showFeedback('feedback.documentAdded');
        setSyncStatus('synced');
        return { success: true };
      } catch (err) {
        console.error('[CareDataContext] addDocumentWithFile error:', err);
        return { success: false, error: 'Unexpected error' };
      }
    },
    [storageMode, careProfileId, showFeedback],
  );

  /**
   * Get a download/opening URL for a document.
   * Local sample data does not include stored document files.
   * In cloud mode, creates a signed URL from Supabase Storage.
   */
  const getDocumentDownloadUrl: CareDataContextValue['getDocumentDownloadUrl'] = useCallback(
    async (docId: string) => {
      const doc = data.documents.find((d) => d.id === docId);
      if (!doc) return null;

      // Local sample data — no actual file stored
      if (storageMode === 'demo' || !doc.filePath) {
        return null;
      }

      // Cloud mode — get signed URL
      try {
        const signedUrl = await getCareDocumentSignedUrl(doc.filePath);
        return signedUrl;
      } catch (err) {
        console.error('[CareDataContext] getDocumentDownloadUrl error:', err);
        return null;
      }
    },
    [storageMode, data.documents],
  );

  // ---------------------------------------------------------------------------
  // CRUD: Care Notes
  // ---------------------------------------------------------------------------
  const addCareNote = useCallback((texto: string) => {
    if (!texto.trim()) return false;

    if (storageMode === 'demo') {
      const novo: CareNote = {
        id: generateId(),
        nota: texto.trim(),
        autor: caregiver.nome,
        dataHora: formatNow(),
      };
      setData((prev) => ({ ...prev, careNotes: [novo, ...prev.careNotes] }));
      showFeedback('feedback.noteAdded');
      return true;
    }

    if (!careProfileId) return false;
    sbCreateCareNote(careProfileId, texto.trim()).then((created) => {
      if (created) {
        setData((prev) => ({ ...prev, careNotes: [created, ...prev.careNotes] }));
        showFeedback('feedback.noteAdded');
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    });
    return true;
  }, [storageMode, careProfileId, showFeedback]);

  const removeCareNote = useCallback((id: string) => {
    if (storageMode === 'demo') {
      setData((prev) => ({ ...prev, careNotes: prev.careNotes.filter((n) => n.id !== id) }));
      showFeedback('feedback.noteRemoved');
      return;
    }
    sbDeleteCareNote(id).then((ok) => {
      if (ok) {
        setData((prev) => ({ ...prev, careNotes: prev.careNotes.filter((n) => n.id !== id) }));
        showFeedback('feedback.noteRemoved');
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    });
  }, [storageMode, showFeedback]);

  // ---------------------------------------------------------------------------
  // Current user role within the care profile
  // ---------------------------------------------------------------------------
  const currentUserRoleRef = useRef<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

  useEffect(() => {
    if (storageMode === 'cloud' && user && careProfileId) {
      sbGetCurrentUserRole(careProfileId, user.id).then((result) => {
        if (result) {
          setCurrentUserRole(result.role);
          setIsCurrentUserAdmin(result.isAdmin);
          currentUserRoleRef.current = result.role;
        }
      });
    } else {
      setCurrentUserRole(null);
      setIsCurrentUserAdmin(false);
    }
  }, [storageMode, user, careProfileId]);

  const canManageMembers = storageMode !== 'cloud' || isCurrentUserAdmin;

  // ---------------------------------------------------------------------------
  // CRUD: Family Members
  // ---------------------------------------------------------------------------
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

  const removeFamilyMember: CareDataContextValue['removeFamilyMember'] = useCallback(async (id) => {
    if (storageMode === 'cloud') {
      if (!isCurrentUserAdmin) {
        showFeedback('pages.family.onlyAdminsCanManage');
        return false;
      }

      setSyncStatus('saving');
      const ok = await sbRemoveCareProfileMember(id);
      if (!ok) {
        setSyncStatus('error');
        showFeedback('pages.family.failedRemoveMember');
        return false;
      }
      setSyncStatus('synced');
    }

    setData((prev) => ({ ...prev, familyMembers: prev.familyMembers.filter((m) => m.id !== id) }));
    showFeedback('feedback.familyRemoved');
    return true;
  }, [storageMode, isCurrentUserAdmin, showFeedback]);

  // ---------------------------------------------------------------------------
  // CRUD: Emergency Contacts
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Care Profile update
  // ---------------------------------------------------------------------------
  const updateCareProfileFn = useCallback((profile: Partial<CareData['careProfile']>) => {
    if (storageMode === 'demo') {
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
      return;
    }

    // Cloud mode: write to Supabase then update local
    if (careProfileId) {
      sbUpdateCareProfile(careProfileId, profile).then((ok) => {
        if (ok) {
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
          setSyncStatus('synced');
        } else {
          setSyncStatus('error');
        }
      });
    }
  }, [storageMode, careProfileId, showFeedback]);

  // ---------------------------------------------------------------------------
  // Demo mode actions
  // ---------------------------------------------------------------------------
  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(getInitialCareData());
    showFeedback('feedback.demoReset');
  }, [showFeedback]);

  const importDemoData = useCallback((demoData: CareData) => {
    setData(demoData);
    showFeedback('feedback.demoImported');
  }, [showFeedback]);

  // ---------------------------------------------------------------------------
  // Emergency summary
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Dashboard summary
  // ---------------------------------------------------------------------------
  const dashboardSummary = React.useMemo(() => {
    const lang = getCurrentLang();
    const medsAtivos = data.medications.filter((m) => m.estado === 'Ativo');
    const todayDoses = getMedicationDoseTimeline(medsAtivos);
    const medCount = todayDoses.length;
    const takenToday = todayDoses.filter((item) => item.dose.status === 'tomado').length;
    const nextDose = getNextMedicationDose(medsAtivos);
    const nextMedicationTime = nextDose?.dose.horario || (lang === 'en' ? 'No time set' : 'Sem horário definido');
    const pendingTasks = data.tasks.filter((t) => t.status === 'por_fazer').length;
    const overdueTasks = data.tasks.filter(isTaskOverdue).length;
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
      saudacao: `${greeting}, ${data.careProfile.nome || caregiver.nome}`,
      resumo: `${lang === 'en' ? 'Today there are' : 'Hoje há'} ${medCount} ${medLabel}${medCount !== 1 ? (lang === 'en' ? 's' : 's') : ''}, ${pendingTasks} ${taskLabel}${pendingTasks !== 1 ? (lang === 'en' ? 's' : 's') : ''} ${pendLabel}${pendingTasks !== 1 ? (lang === 'en' ? '' : 's') : ''} ${lang === 'en' ? 'and' : 'e'} ${aptText}.`,
      totalMedicamentosHoje: medCount,
      medicamentosTomadosHoje: takenToday,
      proximaConsulta: nextMedicationTime,
      tarefasAtraso: overdueTasks,
      perfilCompletude: profileCompleteness,
      sugestoes: suggestions,
    };
  }, [data.medications, data.tasks, data.appointments, data.emergencyContacts, data.careProfile]);

  // ---------------------------------------------------------------------------
  // Pending invites state (cloud mode only)
  // ---------------------------------------------------------------------------
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);

  const reloadInvites: CareDataContextValue['reloadInvites'] = useCallback(async () => {
    if (storageMode !== 'cloud' || !careProfileId) {
      setPendingInvites([]);
      return;
    }
    const invites = await sbGetInvites(careProfileId);
    setPendingInvites(invites);
  }, [storageMode, careProfileId]);

  const createPendingInvite: CareDataContextValue['createPendingInvite'] = useCallback(
    async (input) => {
      if (!input.invitedEmail.trim()) {
        return { success: false, error: tt('pages.family.emailRequired') };
      }
      if (storageMode !== 'cloud' || !careProfileId || !user) {
        return { success: false, error: tt('pages.family.onlyAdminsCanManage') };
      }
      if (!isCurrentUserAdmin) {
        return { success: false, error: tt('pages.family.onlyAdminsCanManage') };
      }
      const created = await sbCreateInvite(careProfileId, {
        invitedEmail: input.invitedEmail.trim(),
        invitedName: input.invitedName?.trim(),
        role: input.role,
        relationship: input.relationship?.trim(),
        invitedBy: user.id,
      });
      if (!created) {
        return { success: false, error: tt('pages.family.failedCreateInvite') };
      }
      setPendingInvites((prev) => [created, ...prev]);
      let emailSent = false;
      if (session?.access_token) {
        try {
          const response = await fetch('/api/send-invite', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              careProfileId,
              invitedEmail: created.invitedEmail,
              invitedName: created.invitedName,
              relationship: created.relationship,
              role: created.role,
              token: created.token,
            }),
          });
          emailSent = response.ok;
        } catch {
          emailSent = false;
        }
      }

      showFeedback(emailSent ? 'pages.family.inviteEmailSent' : 'pages.family.inviteSavedPending');
      return { success: true, emailSent };
    },
    [storageMode, careProfileId, user, session, isCurrentUserAdmin, showFeedback],
  );

  const cancelPendingInvite: CareDataContextValue['cancelPendingInvite'] = useCallback(
    async (inviteId) => {
      if (storageMode !== 'cloud') return false;
      const ok = await sbCancelInvite(inviteId);
      if (ok) {
        setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId));
        showFeedback('pages.family.inviteCancelled');
      } else {
        showFeedback('pages.family.failedCancelInvite');
      }
      return ok;
    },
    [storageMode, showFeedback],
  );

  // Load invites on cloud mode
  useEffect(() => {
    if (storageMode === 'cloud' && careProfileId) {
      reloadInvites();
    } else {
      setPendingInvites([]);
    }
  }, [storageMode, careProfileId, reloadInvites]);

  const notifications = React.useMemo<CareNotification[]>(() => {
    const medicationAlerts = data.medications
      .filter((med) => med.estado === 'Ativo' || med.estado === 'Em falta')
      .flatMap((med) =>
        (med.dosesHoje || []).map((dose) => {
          const timing = med.estado === 'Em falta' ? 'missed' : getDoseStatusTiming(dose.horario, dose.status);
          if (!['due', 'overdue', 'missed'].includes(timing)) return null;

          const title =
            timing === 'due'
              ? tt('notifications.doseDueTitle')
              : timing === 'overdue'
                ? tt('notifications.doseOverdueTitle')
                : tt('notifications.missedDoseTitle');
          return {
            id: `dose-${timing}-${med.id}-${dose.id}`,
            type: timing === 'due' ? ('doseDue' as const) : timing === 'overdue' ? ('doseOverdue' as const) : ('missedDose' as const),
            title,
            body: `${med.nome} ${med.dosagem} · ${dose.horario}${med.instrucoes ? ` · ${med.instrucoes}` : ''}`,
            path: '/dashboard/medicamentos',
            actionLabel: tt('notifications.openMedication'),
          };
        }),
      )
      .filter((item): item is CareNotification => Boolean(item))
      .sort((a, b) => {
        const priority: Record<CareNotification['type'], number> = {
          missedDose: 0,
          doseOverdue: 1,
          doseDue: 2,
          taskOverdue: 3,
          documentExpiring: 4,
          appointmentTomorrow: 5,
        };
        return priority[a.type] - priority[b.type];
      });

    const taskAlerts = data.tasks
      .filter(isTaskOverdue)
      .map((task) => ({
        id: `task-${task.id}`,
        type: 'taskOverdue' as const,
        title: tt('notifications.taskOverdueTitle'),
        body: task.titulo,
        path: '/dashboard/tarefas',
      }));

    const documentAlerts = data.documents
      .filter((doc) => {
        const expiryDate = parseFlexibleDate(doc.dataValidade);
        return expiryDate ? daysUntil(expiryDate) <= 60 : false;
      })
      .slice(0, 2)
      .map((doc) => ({
        id: `doc-${doc.id}`,
        type: 'documentExpiring' as const,
        title: tt('notifications.documentExpiringTitle'),
        body: doc.titulo,
        path: '/dashboard/documentos',
      }));

    return [...medicationAlerts, ...taskAlerts, ...documentAlerts].slice(0, 8);
  }, [data.medications, data.tasks, data.documents]);

  const activityEvents = React.useMemo<ActivityEvent[]>(() => [
    ...data.medications.filter((med) => med.tomadoHoje).map((med) => ({
      id: `activity-med-${med.id}`,
      icon: 'check_circle',
      text: tt('activity.medicationTaken').replace('{name}', med.nome).replace('{person}', med.responsavel || caregiver.nome),
      when: tt('activity.today'),
      path: '/dashboard/medicamentos',
    })),
    ...data.tasks.filter((task) => task.status === 'concluido').slice(0, 5).map((task) => ({
      id: `activity-task-${task.id}`,
      icon: 'task_alt',
      text: tt('activity.taskCompleted').replace('{name}', task.titulo).replace('{person}', task.concluidoPor || task.responsavel),
      when: task.concluidoEm || tt('activity.recently'),
      path: '/dashboard/tarefas',
    })),
    ...data.careNotes.slice(0, 3).map((note) => ({
      id: `activity-note-${note.id}`,
      icon: 'edit_note',
      text: tt('activity.noteAdded').replace('{person}', note.autor),
      when: note.dataHora,
      path: '/dashboard/notas',
    })),
  ].slice(0, 7), [data.medications, data.tasks, data.careNotes]);

  // ---------------------------------------------------------------------------
  // Context value
  // ---------------------------------------------------------------------------
  const value: CareDataContextValue = {
    currentUserRole,
    isCurrentUserAdmin,
    canManageMembers,
    pendingInvites,
    createPendingInvite,
    cancelPendingInvite,
    reloadInvites,
    data,
    notifications,
    activityEvents,
    feedback,
    storageMode,
    syncStatus,
    syncError,
    reloadCloudData,
    showFeedback,
    addMedication,
    removeMedication,
    updateMedicationTaken,
    updateMedicationDoseStatus,
    addAppointment,
    removeAppointment,
    addTask,
    removeTask,
    updateTaskStatus,
    addDocument,
    removeDocument,
    addDocumentWithFile,
    getDocumentDownloadUrl,
    addCareNote,
    removeCareNote,
    addFamilyMember,
    removeFamilyMember,
    updateCareProfile: updateCareProfileFn,
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

export type {
  DocumentCategory,
  TaskStatus,
  TaskPriority,
  TaskRecurrence,
  FamilyRole,
  CareNote,
  EmergencyContact,
  MedicationDoseStatus,
  MedicationForm,
  MedicationRoute,
  MedicationUnit,
};
