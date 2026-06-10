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
  Task,
  TaskPriority,
  TaskStatus,
  caregiver,
  getInitialCareData,
} from '../data/initialData';
import translations from '../i18n/translations';
import { useAuth } from './AuthContext';
import {
  getOrCreateUserProfile,
  getOrCreateDefaultCareProfile,
  loadCareDataFromSupabase,
  createMedication as sbCreateMedication,
  deleteMedication as sbDeleteMedication,
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
    /* use initial data */
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

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------

export type StorageMode = 'demo' | 'cloud';
export type SyncStatus = 'idle' | 'loading' | 'saving' | 'error' | 'synced';

interface CareDataContextValue {
  currentUserRole: string | null;
  isCurrentUserAdmin: boolean;
  canManageMembers: boolean;
  data: CareData;
  feedback: string | null;
  storageMode: StorageMode;
  syncStatus: SyncStatus;
  syncError: string | null;
  reloadCloudData: () => Promise<void>;
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
  addDocumentWithFile: (doc: Omit<Document, 'id' | 'dataAdicao'>, file: File | null) => Promise<{ success: boolean; error?: string }>;
  getDocumentDownloadUrl: (docId: string) => Promise<string | null>;
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
  const { user } = useAuth();
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

      setData(cloudData);
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
          setData(cloudData);
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
    setTimeout(() => setFeedback(null), 3000);
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
    }

    // Cloud mode
    if (!careProfileId) return false;
    sbCreateMedication(careProfileId, {
      nome: med.nome.trim(),
      dosagem: med.dosagem.trim(),
      horario: med.horario.trim(),
      frequencia: med.frequencia.trim(),
      responsavel: med.responsavel?.trim() || caregiver.nome,
      instrucoes: med.instrucoes?.trim() || '',
    }).then((created) => {
      if (created) {
        setData((prev) => ({ ...prev, medications: [...prev.medications, created] }));
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
    setData((prev) => ({
      ...prev,
      medications: prev.medications.map((m) => (m.id === id ? { ...m, tomadoHoje } : m)),
    }));
    showFeedback(tomadoHoje ? 'feedback.medicationTaken' : 'feedback.medicationUntaken');
  }, [showFeedback]);

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
        local: apt.local.trim(),
        medico: apt.medico?.trim() || '—',
        responsavel: apt.responsavel?.trim() || caregiver.nome,
        notas: apt.notas?.trim() || '',
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
    }).then((created) => {
      if (created) {
        setData((prev) => ({ ...prev, tasks: [...prev.tasks, created] }));
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
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
      }));
      showFeedback('feedback.taskStatusUpdated');
      return;
    }
    sbUpdateTask(id, { status }).then((updated) => {
      if (updated) {
        setData((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === id ? updated : t)),
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
   * In demo mode, returns a translated message placeholder.
   * In cloud mode, creates a signed URL from Supabase Storage.
   */
  const getDocumentDownloadUrl: CareDataContextValue['getDocumentDownloadUrl'] = useCallback(
    async (docId: string) => {
      const doc = data.documents.find((d) => d.id === docId);
      if (!doc) return null;

      // Demo mode — no actual file stored
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
  // CRUD: Family Members (demo only for now)
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

  const removeFamilyMember = useCallback((id: string) => {
    setData((prev) => ({ ...prev, familyMembers: prev.familyMembers.filter((m) => m.id !== id) }));
    showFeedback('feedback.familyRemoved');
  }, [showFeedback]);

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
  // Context value
  // ---------------------------------------------------------------------------
  const value: CareDataContextValue = {
    currentUserRole,
    isCurrentUserAdmin,
    canManageMembers,
    data,
    feedback,
    storageMode,
    syncStatus,
    syncError,
    reloadCloudData,
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

export type { DocumentCategory, TaskStatus, TaskPriority, FamilyRole, CareNote, EmergencyContact };
