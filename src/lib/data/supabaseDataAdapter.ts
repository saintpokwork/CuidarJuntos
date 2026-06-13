/**
 * Supabase Data Adapter — CuidarJuntos
 *
 * Maps between the app's camelCase/Portuguese data shapes and the
 * Supabase snake_case/English table columns. All writes respect RLS.
 */
import { supabase } from '../supabaseClient';
import type {
  CareData,
  CareProfile,
  Medication,
  Appointment,
  Task,
  Document,
  CareNote,
  EmergencyContact,
  FamilyMember,
  FamilyRole,
  MemberStatus,
} from './types';

// ---------------------------------------------------------------------------
// Types for Supabase rows (subset we use)
// ---------------------------------------------------------------------------

interface DbCareProfile {
  id: string;
  created_by: string | null;
  full_name: string;
  date_of_birth: string | null;
  address: string | null;
  sns_number: string | null;
  allergies: string | null;
  conditions: string | null;
  doctor_name: string | null;
  pharmacy_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface DbMedication {
  id: string;
  care_profile_id: string;
  name: string;
  dosage: string | null;
  unit: Medication['unidade'] | null;
  frequency: string | null;
  time: string | null;
  instructions: string | null;
  responsible_user_id: string | null;
  active: boolean;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

interface DbMedicationLog {
  id: string;
  medication_id: string;
  care_profile_id: string;
  taken_by: string | null;
  taken_date: string;
  status: 'taken' | 'skipped' | 'pending';
  notes: string | null;
  created_at: string;
}

interface DbAppointment {
  id: string;
  care_profile_id: string;
  title: string;
  appointment_at: string | null;
  location: string | null;
  doctor_or_service: string | null;
  responsible_user_id: string | null;
  notes: string | null;
  pre_visit_notes: string | null;
  result_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface DbTask {
  id: string;
  care_profile_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  due_date: string | null;
  status: string;
  priority: string;
  recurrence: Task['repetir'] | null;
  completed_at: string | null;
  completed_by_name: string | null;
  created_at: string;
  updated_at: string;
}

interface DbDocument {
  id: string;
  care_profile_id: string;
  title: string;
  category: string | null;
  expiry_date: string | null;
  notes: string | null;
  file_path: string | null;
  file_name: string | null;
  created_at: string;
  updated_at: string;
}

interface DbCareNote {
  id: string;
  care_profile_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
}

interface DbEmergencyContact {
  id: string;
  care_profile_id: string;
  name: string;
  relationship: string | null;
  phone: string | null;
  email: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

// Member joined with profile for display name
interface DbMemberWithProfile {
  id: string;
  care_profile_id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles: { full_name: string; email: string } | null;
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

// Task status: app ↔ Supabase
const statusToDb: Record<string, string> = {
  por_fazer: 'todo',
  em_progresso: 'in_progress',
  concluido: 'done',
};
const statusFromDb: Record<string, string> = {
  todo: 'por_fazer',
  in_progress: 'em_progresso',
  done: 'concluido',
};

// Priority: app ↔ Supabase
const priorityToDb: Record<string, string> = {
  'Baixa': 'low',
  'Média': 'normal',
  'Urgente': 'urgent',
};
const priorityFromDb: Record<string, string> = {
  low: 'Baixa',
  normal: 'Média',
  urgent: 'Urgente',
};

// Medication estado ↔ active flag
const estadoFromActive = (active: boolean): 'Ativo' | 'Em falta' =>
  active ? 'Ativo' : 'Em falta';

// Member role: DB → app (Portuguese display)
const roleFromDb: Record<string, FamilyRole> = {
  admin: 'Administrador',
  family: 'Familiar',
  caregiver: 'Cuidador',
  viewer: 'Apenas leitura',
};

// Member role: app → DB
const roleToDb: Record<string, string> = {
  Administrador: 'admin',
  Familiar: 'family',
  Cuidador: 'caregiver',
  'Apenas leitura': 'viewer',
};

// Member status: DB → app
const memberStatusFromDb: Record<string, MemberStatus> = {
  active: 'Ativo',
  invited: 'Convite pendente',
  removed: 'Removido',
};

// Member status: app → DB
const memberStatusToDb: Record<string, string> = {
  'Ativo': 'active',
  'Convite pendente': 'invited',
  'Convite enviado': 'invited',
  'Removido': 'removed',
};

// ---------------------------------------------------------------------------
// Row → App mappers
// ---------------------------------------------------------------------------

const parseMedicationLogNotes = (notes: string | null): Pick<Medication, 'dosesHoje' | 'tomadoHoje' | 'doseDate'> => {
  if (!notes) return {};
  try {
    const parsed = JSON.parse(notes) as Pick<Medication, 'dosesHoje' | 'tomadoHoje' | 'doseDate'>;
    return {
      dosesHoje: Array.isArray(parsed.dosesHoje) ? parsed.dosesHoje : undefined,
      tomadoHoje: typeof parsed.tomadoHoje === 'boolean' ? parsed.tomadoHoje : undefined,
      doseDate: typeof parsed.doseDate === 'string' ? parsed.doseDate : undefined,
    };
  } catch {
    return {};
  }
};

const mapMedication = (row: DbMedication, log?: DbMedicationLog): Medication => {
  const logState = parseMedicationLogNotes(log?.notes || null);
  const logTakenToday = log ? log.status === 'taken' : false;
  return {
    id: row.id,
    nome: row.name,
    dosagem: row.dosage || '',
    unidade: row.unit || undefined,
    horario: row.time || '',
    frequencia: row.frequency || '',
    responsavel: '', // We don't join profiles for display name in v1
    estado: estadoFromActive(row.active),
    instrucoes: row.instructions || '',
    dataFim: row.end_date || '',
    doseDate: logState.doseDate || log?.taken_date || undefined,
    dosesHoje: logState.dosesHoje,
    tomadoHoje: logState.tomadoHoje ?? logTakenToday,
  };
};

const mapAppointment = (row: DbAppointment): Appointment => {
  let dataHora = '';
  if (row.appointment_at) {
    try {
      const d = new Date(row.appointment_at);
      const locale = 'pt-PT';
      dataHora = d.toLocaleString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      dataHora = row.appointment_at;
    }
  }
  return {
    id: row.id,
    tipo: row.title,
    dataHora,
    dataHoraIso: row.appointment_at || '',
    local: row.location || '',
    medico: row.doctor_or_service || '—',
    responsavel: '',
    notas: row.notes || '',
    notasPreConsulta: row.pre_visit_notes || '',
    resultadoConsulta: row.result_notes || '',
    estado: 'Agendada',
  };
};

const mapTask = (row: DbTask): Task => ({
  id: row.id,
  titulo: row.title,
  responsavel: '',
  prioridade: (priorityFromDb[row.priority] as Task['prioridade']) || 'Média',
  dataLimite: row.due_date || 'Sem data',
  status: (statusFromDb[row.status] as Task['status']) || 'por_fazer',
  local: row.description || '', // description used as local in app
  repetir: row.recurrence || 'none',
  concluidoEm: row.completed_at || '',
  concluidoPor: row.completed_by_name || '',
});

const mapDocument = (row: DbDocument): Document => ({
  id: row.id,
  titulo: row.file_name || row.title, // prefer stored file name if available
  categoria: (row.category as Document['categoria']) || 'Outros',
  dataAdicao: row.created_at ? new Date(row.created_at).toLocaleDateString('pt-PT') : '',
  dataValidade: row.expiry_date || '',
  notas: row.notes || '',
  filePath: row.file_path || undefined,
  fileName: row.file_name || undefined,
});

const mapCareNote = (row: DbCareNote): CareNote => ({
  id: row.id,
  nota: row.note,
  autor: '', // Will be populated if needed
  dataHora: row.created_at
    ? new Date(row.created_at).toLocaleString('pt-PT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '',
});

const mapEmergencyContact = (row: DbEmergencyContact): EmergencyContact => ({
  id: row.id,
  nome: row.name,
  funcao: row.relationship || '',
  telefone: row.phone || '',
  avatar: '',
});

const mapCareProfile = (row: DbCareProfile): CareProfile => {
  const parseList = (val: string | null): string[] => {
    if (!val) return [];
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  };
  return {
    nome: row.full_name,
    dataNascimento: row.date_of_birth || '',
    morada: row.address || '',
    numeroSNS: row.sns_number || '',
    alergias: parseList(row.allergies),
    condicoes: parseList(row.conditions),
    medicoFamilia: row.doctor_name || '',
    farmaciaHabitual: row.pharmacy_name || '',
    notasImportantes: row.notes || '',
    contactosPrincipais: [],
    atualizadoEm: row.updated_at || row.created_at,
  };
};

const mapFamilyMember = (row: DbMemberWithProfile): FamilyMember => ({
  id: row.id,
  nome: row.profiles?.full_name || row.user_id.slice(0, 8),
  relacao: '',
  funcao: roleFromDb[row.role] || 'Familiar',
  estado: memberStatusFromDb[row.status] || 'Convite pendente',
  avatar: '',
  contacto: row.profiles?.email || '',
});

// ---------------------------------------------------------------------------
// App → DB mappers
// ---------------------------------------------------------------------------

const medicationToDb = (
  med: Omit<Medication, 'id' | 'estado' | 'instrucoes' | 'responsavel'> & {
    responsavel?: string;
    instrucoes?: string;
    id?: string;
  },
  careProfileId: string,
) => ({
  care_profile_id: careProfileId,
  name: med.nome,
  dosage: med.dosagem,
  unit: med.unidade || null,
  frequency: med.frequencia,
  time: med.horario,
  instructions: med.instrucoes || '',
  end_date: med.dataFim || null,
  active: true,
});

const appointmentToDb = (
  apt: {
    tipo: string;
    dataHora?: string;
    local?: string;
    medico?: string;
    responsavel?: string;
    notas?: string;
    notasPreConsulta?: string;
    resultadoConsulta?: string;
    id?: string;
  },
  careProfileId: string,
) => ({
  care_profile_id: careProfileId,
  title: apt.tipo,
  appointment_at: apt.dataHora || null,
  location: apt.local,
  doctor_or_service: apt.medico || null,
  notes: apt.notas || null,
  pre_visit_notes: apt.notasPreConsulta || null,
  result_notes: apt.resultadoConsulta || null,
});

const taskToDb = (
  task: Omit<Task, 'id'> & { id?: string },
  careProfileId: string,
) => ({
  care_profile_id: careProfileId,
  title: task.titulo,
  description: task.local || null,
  due_date: task.dataLimite === 'Sem data' ? null : task.dataLimite,
  status: statusToDb[task.status] || 'todo',
  priority: priorityToDb[task.prioridade] || 'normal',
  recurrence: task.repetir || 'none',
  completed_at: task.concluidoEm || null,
  completed_by_name: task.concluidoPor || null,
});

const documentToDb = (
  doc: Omit<Document, 'id' | 'dataAdicao'> & { id?: string },
  careProfileId: string,
) => ({
  care_profile_id: careProfileId,
  title: doc.titulo,
  category: doc.categoria,
  expiry_date: doc.dataValidade || null,
  notes: doc.notas || null,
});

const careNoteToDb = (note: string, careProfileId: string) => ({
  care_profile_id: careProfileId,
  note,
});

const emergencyContactToDb = (
  contact: Omit<EmergencyContact, 'id' | 'avatar'> & { id?: string },
  careProfileId: string,
) => ({
  care_profile_id: careProfileId,
  name: contact.nome,
  relationship: contact.funcao || null,
  phone: contact.telefone || null,
});

// ---------------------------------------------------------------------------
// Profile helpers
// ---------------------------------------------------------------------------

export const getOrCreateUserProfile = async (
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> },
): Promise<{ id: string } | null> => {
  // Try to fetch existing profile
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) return existing;

  // Insert new profile (RLS allows insert where auth.uid() = id)
  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    full_name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || '',
    email: user.email || '',
    language: 'pt',
  });

  if (error) {
    console.error('[supabaseDataAdapter] Failed to create profile:', error);
    return null;
  }

  return { id: user.id };
};

// ---------------------------------------------------------------------------
// Care profile helpers
// ---------------------------------------------------------------------------

export const getCareProfilesForUser = async (
  userId: string,
): Promise<DbCareProfile[]> => {
  // First get care_profile_ids the user is a member of
  const { data: memberships, error: memErr } = await supabase
    .from('care_profile_members')
    .select('care_profile_id')
    .eq('user_id', userId)
    .eq('status', 'active');

  if (memErr || !memberships || memberships.length === 0) return [];

  const ids = memberships.map((m) => m.care_profile_id);

  const { data: profiles, error: profErr } = await supabase
    .from('care_profiles')
    .select('*')
    .in('id', ids);

  if (profErr || !profiles) return [];
  return profiles as DbCareProfile[];
};

export const getOrCreateDefaultCareProfile = async (
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> },
): Promise<string | null> => {
  const ensureCareProfileViaServer = async (): Promise<string | null> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) return null;

    const response = await fetch('/api/ensure-care-profile', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[supabaseDataAdapter] ensure care profile API failed:', errorText);
      return null;
    }

    const body = await response.json();
    return body.careProfileId || null;
  };

  const ensuredId = await ensureCareProfileViaServer();
  if (ensuredId) return ensuredId;

  const existing = await getCareProfilesForUser(user.id);
  if (existing.length > 0) return existing[0].id;

  const { data: profile, error: profErr } = await supabase
    .from('care_profiles')
    .insert({
      full_name: 'Familiar cuidado',
      created_by: user.id,
      date_of_birth: null,
      address: null,
      sns_number: null,
      allergies: null,
      conditions: null,
      doctor_name: null,
      pharmacy_name: null,
      notes: null,
    })
    .select('id')
    .single();

  if (profErr || !profile) {
    console.error('[supabaseDataAdapter] Failed to create care profile:', profErr);
    return ensureCareProfileViaServer();
  }

  // Create membership
  const { error: memErr } = await supabase.from('care_profile_members').insert({
    care_profile_id: profile.id,
    user_id: user.id,
    role: 'admin',
    status: 'active',
  });

  if (memErr) {
    console.error('[supabaseDataAdapter] Failed to create membership:', memErr);
    // Clean up orphaned profile to prevent duplicates on next login
    await supabase.from('care_profiles').delete().eq('id', profile.id);
    return ensureCareProfileViaServer();
  }

  return profile.id;
};

// ---------------------------------------------------------------------------
// Seed starter data (only once, when profile is first created)
// ---------------------------------------------------------------------------

const seedStarterData = async (careProfileId: string) => {
  // Medications
  const meds = [
    {
      care_profile_id: careProfileId,
      name: 'Metformina',
      dosage: '500mg',
      frequency: 'Diariamente',
      time: '08:00, 20:00',
      instructions: 'Após as refeições',
      active: true,
    },
    {
      care_profile_id: careProfileId,
      name: 'Aspirina',
      dosage: '100mg',
      frequency: 'Diariamente',
      time: '09:00',
      instructions: 'Após o pequeno-almoço',
      active: true,
    },
    {
      care_profile_id: careProfileId,
      name: 'Losartan',
      dosage: '50mg',
      frequency: 'Diariamente',
      time: '08:00',
      instructions: 'Em jejum',
      active: true,
    },
  ];

  await supabase.from('medications').insert(meds);

  // Appointments
  await supabase.from('appointments').insert({
    care_profile_id: careProfileId,
    title: 'Consulta de cardiologia',
    location: 'Hospital de Santa Maria — Piso 3',
    doctor_or_service: 'Dr. Roberto Santos',
    notes: 'Levar últimas análises de colesterol',
  });

  // Tasks
  const tasks = [
    {
      care_profile_id: careProfileId,
      title: 'Comprar gaze e álcool',
      description: 'Farmácia Central do Chiado',
      due_date: new Date().toISOString().slice(0, 10),
      status: 'todo',
      priority: 'urgent',
    },
    {
      care_profile_id: careProfileId,
      title: 'Marcar consulta de oftalmologia',
      description: 'USF Campo de Ourique',
      status: 'todo',
      priority: 'normal',
    },
  ];

  await supabase.from('tasks').insert(tasks);

  // Emergency contacts
  const contacts = [
    {
      care_profile_id: careProfileId,
      name: 'Dr. Roberto Santos',
      relationship: 'Cardiologista',
      phone: '+351 213 456 789',
      priority: 1,
    },
    {
      care_profile_id: careProfileId,
      name: 'Ana Silva',
      relationship: 'Filha / Contacto principal',
      phone: '+351 912 345 678',
      priority: 2,
    },
  ];

  await supabase.from('emergency_contacts').insert(contacts);

  // Care notes
  await supabase.from('care_notes').insert({
    care_profile_id: careProfileId,
    note: 'Lembrar de medir a tensão arterial amanhã de manhã antes da medicação.',
  });

  // Document metadata only
  await supabase.from('documents').insert({
    care_profile_id: careProfileId,
    title: 'Análises_Julho_2024.pdf',
    category: 'Exames',
    expiry_date: '2025-12-31',
    notes: 'Resultados de rotina',
  });
};

// ---------------------------------------------------------------------------
// Load all care data from Supabase
// ---------------------------------------------------------------------------

export const loadCareDataFromSupabase = async (
  careProfileId: string,
): Promise<CareData | null> => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const [medsRes, medLogsRes, aptsRes, tasksRes, docsRes, notesRes, ecRes, cpRes] =
    await Promise.all([
      supabase.from('medications').select('*').eq('care_profile_id', careProfileId),
      supabase.from('medication_logs').select('*').eq('care_profile_id', careProfileId).eq('taken_date', todayKey),
      supabase.from('appointments').select('*').eq('care_profile_id', careProfileId).order('appointment_at', { ascending: true }),
      supabase.from('tasks').select('*').eq('care_profile_id', careProfileId).order('created_at', { ascending: false }),
      supabase.from('documents').select('*').eq('care_profile_id', careProfileId).order('created_at', { ascending: false }),
      supabase.from('care_notes').select('*').eq('care_profile_id', careProfileId).order('created_at', { ascending: false }),
      supabase.from('emergency_contacts').select('*').eq('care_profile_id', careProfileId).order('priority', { ascending: true }),
      supabase.from('care_profiles').select('*').eq('id', careProfileId).single(),
    ]);

  // Log errors but don't crash
  if (medsRes.error) console.error('[load] medications error:', medsRes.error);
  if (medLogsRes.error) console.error('[load] medication_logs error:', medLogsRes.error);
  if (aptsRes.error) console.error('[load] appointments error:', aptsRes.error);
  if (tasksRes.error) console.error('[load] tasks error:', tasksRes.error);
  if (docsRes.error) console.error('[load] documents error:', docsRes.error);
  if (notesRes.error) console.error('[load] care_notes error:', notesRes.error);
  if (ecRes.error) console.error('[load] emergency_contacts error:', ecRes.error);
  if (cpRes.error) console.error('[load] care_profiles error:', cpRes.error);

  if (cpRes.error || !cpRes.data) return null;

  const medicationLogsByMedication = new Map(
    ((medLogsRes.data || []) as DbMedicationLog[]).map((log) => [log.medication_id, log]),
  );

  return {
    medications: (medsRes.data || []).map((med) => mapMedication(med as DbMedication, medicationLogsByMedication.get(med.id))),
    appointments: (aptsRes.data || []).map(mapAppointment),
    tasks: (tasksRes.data || []).map(mapTask),
    documents: (docsRes.data || []).map(mapDocument),
    careNotes: (notesRes.data || []).map(mapCareNote),
    emergencyContacts: (ecRes.data || []).map(mapEmergencyContact),
    careProfile: mapCareProfile(cpRes.data),
    familyMembers: [],
  };
};

// ---------------------------------------------------------------------------
// CRUD: Medications
// ---------------------------------------------------------------------------

export const createMedication = async (
  careProfileId: string,
  med: Omit<Medication, 'id' | 'estado' | 'instrucoes' | 'responsavel'> & {
    responsavel?: string;
    instrucoes?: string;
  },
): Promise<Medication | null> => {
  const row = medicationToDb(med, careProfileId);
  const { data, error } = await supabase
    .from('medications')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] createMedication error:', error);
    return null;
  }
  return mapMedication(data as DbMedication);
};

export const updateMedication = async (
  id: string,
  updates: Partial<Pick<Medication, 'nome' | 'dosagem' | 'unidade' | 'horario' | 'frequencia' | 'instrucoes' | 'estado' | 'dataFim'>>,
): Promise<Medication | null> => {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.nome !== undefined) dbUpdates.name = updates.nome;
  if (updates.dosagem !== undefined) dbUpdates.dosage = updates.dosagem;
  if (updates.unidade !== undefined) dbUpdates.unit = updates.unidade || null;
  if (updates.horario !== undefined) dbUpdates.time = updates.horario;
  if (updates.frequencia !== undefined) dbUpdates.frequency = updates.frequencia;
  if (updates.instrucoes !== undefined) dbUpdates.instructions = updates.instrucoes;
  if (updates.estado !== undefined) dbUpdates.active = updates.estado === 'Ativo';
  if (updates.dataFim !== undefined) dbUpdates.end_date = updates.dataFim || null;

  const { data, error } = await supabase
    .from('medications')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] updateMedication error:', error);
    return null;
  }
  return mapMedication(data as DbMedication);
};

export const deleteMedication = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('medications').delete().eq('id', id);
  if (error) {
    console.error('[supabaseDataAdapter] deleteMedication error:', error);
    return false;
  }
  return true;
};

export const upsertMedicationDailyLog = async (
  careProfileId: string,
  medication: Pick<Medication, 'id' | 'doseDate' | 'dosesHoje' | 'tomadoHoje'>,
): Promise<boolean> => {
  const doseDate = medication.doseDate || new Date().toISOString().slice(0, 10);
  const doses = medication.dosesHoje || [];
  const hasSkippedDose = doses.some((dose) => dose.status === 'em_falta');
  const hasTakenDose = doses.some((dose) => dose.status === 'tomado');
  const status = hasSkippedDose ? 'skipped' : hasTakenDose || medication.tomadoHoje ? 'taken' : 'pending';

  const { error } = await supabase
    .from('medication_logs')
    .upsert(
      {
        medication_id: medication.id,
        care_profile_id: careProfileId,
        taken_date: doseDate,
        status,
        notes: JSON.stringify({
          doseDate,
          tomadoHoje: Boolean(medication.tomadoHoje),
          dosesHoje: doses,
        }),
      },
      { onConflict: 'medication_id,taken_date' },
    );

  if (error) {
    console.error('[supabaseDataAdapter] upsertMedicationDailyLog error:', error);
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// CRUD: Appointments
// ---------------------------------------------------------------------------

export const createAppointment = async (
  careProfileId: string,
  apt: Omit<Appointment, 'id' | 'estado' | 'dataHora' | 'medico' | 'responsavel' | 'notas'> & {
    dataHora: string;
    medico?: string;
    responsavel?: string;
    notas?: string;
    notasPreConsulta?: string;
    resultadoConsulta?: string;
  },
): Promise<Appointment | null> => {
  const row = appointmentToDb(apt, careProfileId);
  const { data, error } = await supabase
    .from('appointments')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] createAppointment error:', error);
    return null;
  }
  return mapAppointment(data as DbAppointment);
};

export const updateAppointment = async (
  id: string,
  updates: Partial<Pick<Appointment, 'tipo' | 'dataHora' | 'local' | 'medico' | 'notas' | 'notasPreConsulta' | 'resultadoConsulta'>>,
): Promise<Appointment | null> => {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.tipo !== undefined) dbUpdates.title = updates.tipo;
  if (updates.dataHora !== undefined) dbUpdates.appointment_at = updates.dataHora;
  if (updates.local !== undefined) dbUpdates.location = updates.local;
  if (updates.medico !== undefined) dbUpdates.doctor_or_service = updates.medico;
  if (updates.notas !== undefined) dbUpdates.notes = updates.notas;
  if (updates.notasPreConsulta !== undefined) dbUpdates.pre_visit_notes = updates.notasPreConsulta || null;
  if (updates.resultadoConsulta !== undefined) dbUpdates.result_notes = updates.resultadoConsulta || null;

  const { data, error } = await supabase
    .from('appointments')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] updateAppointment error:', error);
    return null;
  }
  return mapAppointment(data as DbAppointment);
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) {
    console.error('[supabaseDataAdapter] deleteAppointment error:', error);
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// CRUD: Tasks
// ---------------------------------------------------------------------------

export const createTask = async (
  careProfileId: string,
  task: Omit<Task, 'id' | 'status'> & { status?: Task['status'] },
): Promise<Task | null> => {
  const row = taskToDb(
    { ...task, status: task.status || 'por_fazer' },
    careProfileId,
  );
  const { data, error } = await supabase
    .from('tasks')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] createTask error:', error);
    return null;
  }
  return mapTask(data as DbTask);
};

export const updateTask = async (
  id: string,
  updates: Partial<Pick<Task, 'titulo' | 'responsavel' | 'prioridade' | 'dataLimite' | 'status' | 'local' | 'repetir' | 'concluidoEm' | 'concluidoPor'>>,
): Promise<Task | null> => {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.titulo !== undefined) dbUpdates.title = updates.titulo;
  if (updates.local !== undefined) dbUpdates.description = updates.local;
  if (updates.dataLimite !== undefined)
    dbUpdates.due_date = updates.dataLimite === 'Sem data' ? null : updates.dataLimite;
  if (updates.status !== undefined) dbUpdates.status = statusToDb[updates.status] || 'todo';
  if (updates.prioridade !== undefined) dbUpdates.priority = priorityToDb[updates.prioridade] || 'normal';
  if (updates.repetir !== undefined) dbUpdates.recurrence = updates.repetir || 'none';
  if (updates.concluidoEm !== undefined) dbUpdates.completed_at = updates.concluidoEm || null;
  if (updates.concluidoPor !== undefined) dbUpdates.completed_by_name = updates.concluidoPor || null;

  const { data, error } = await supabase
    .from('tasks')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] updateTask error:', error);
    return null;
  }
  return mapTask(data as DbTask);
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) {
    console.error('[supabaseDataAdapter] deleteTask error:', error);
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// CRUD: Documents (metadata only — no file uploads)
// ---------------------------------------------------------------------------

export const createDocumentRecord = async (
  careProfileId: string,
  doc: Omit<Document, 'id' | 'dataAdicao'>,
): Promise<Document | null> => {
  const row = documentToDb(doc, careProfileId);
  const { data, error } = await supabase
    .from('documents')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] createDocumentRecord error:', error);
    return null;
  }
  return mapDocument(data as DbDocument);
};

export const updateDocumentRecord = async (
  id: string,
  updates: Partial<Pick<Document, 'titulo' | 'categoria' | 'dataValidade' | 'notas' | 'filePath' | 'fileName'>>,
): Promise<Document | null> => {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.titulo !== undefined) dbUpdates.title = updates.titulo;
  if (updates.categoria !== undefined) dbUpdates.category = updates.categoria;
  if (updates.dataValidade !== undefined) dbUpdates.expiry_date = updates.dataValidade || null;
  if (updates.notas !== undefined) dbUpdates.notes = updates.notas;
  if (updates.filePath !== undefined) dbUpdates.file_path = updates.filePath;
  if (updates.fileName !== undefined) dbUpdates.file_name = updates.fileName;

  const { data, error } = await supabase
    .from('documents')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] updateDocumentRecord error:', error);
    return null;
  }
  return mapDocument(data as DbDocument);
};

export const deleteDocumentRecord = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) {
    console.error('[supabaseDataAdapter] deleteDocumentRecord error:', error);
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// CRUD: Care Notes
// ---------------------------------------------------------------------------

export const createCareNote = async (
  careProfileId: string,
  note: string,
): Promise<CareNote | null> => {
  const row = careNoteToDb(note, careProfileId);
  const { data, error } = await supabase
    .from('care_notes')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] createCareNote error:', error);
    return null;
  }
  return mapCareNote(data as DbCareNote);
};

export const deleteCareNote = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('care_notes').delete().eq('id', id);
  if (error) {
    console.error('[supabaseDataAdapter] deleteCareNote error:', error);
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// CRUD: Emergency Contacts
// ---------------------------------------------------------------------------

export const createEmergencyContact = async (
  careProfileId: string,
  contact: Omit<EmergencyContact, 'id' | 'avatar'>,
): Promise<EmergencyContact | null> => {
  const row = emergencyContactToDb(contact, careProfileId);
  const { data, error } = await supabase
    .from('emergency_contacts')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] createEmergencyContact error:', error);
    return null;
  }
  return mapEmergencyContact(data as DbEmergencyContact);
};

export const updateEmergencyContact = async (
  id: string,
  updates: Partial<Pick<EmergencyContact, 'nome' | 'funcao' | 'telefone'>>,
): Promise<EmergencyContact | null> => {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.nome !== undefined) dbUpdates.name = updates.nome;
  if (updates.funcao !== undefined) dbUpdates.relationship = updates.funcao;
  if (updates.telefone !== undefined) dbUpdates.phone = updates.telefone;

  const { data, error } = await supabase
    .from('emergency_contacts')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] updateEmergencyContact error:', error);
    return null;
  }
  return mapEmergencyContact(data as DbEmergencyContact);
};

export const deleteEmergencyContact = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('emergency_contacts').delete().eq('id', id);
  if (error) {
    console.error('[supabaseDataAdapter] deleteEmergencyContact error:', error);
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// CRUD: Care Profile Members (Stage 1)
// ---------------------------------------------------------------------------

/**
 * Get all members of a care profile, joined with user profile data.
 */
export const getCareProfileMembers = async (
  careProfileId: string,
): Promise<FamilyMember[]> => {
  const { data, error } = await supabase
    .from('care_profile_members')
    .select('*')
    .eq('care_profile_id', careProfileId);

  if (error) {
    console.error('[supabaseDataAdapter] getCareProfileMembers error:', error);
    return [];
  }

  return (data || []).map(mapFamilyMember);
};

/**
 * Add a member to a care profile.
 * NOTE: This writes direct memberships for an existing user_id.
 * Email invitation tokens are handled outside this adapter.
 */
export const addCareProfileMember = async (
  careProfileId: string,
  userId: string,
  role: string,
): Promise<FamilyMember | null> => {
  const dbRole = roleToDb[role] || 'family';
  const { data, error } = await supabase
    .from('care_profile_members')
    .insert({
      care_profile_id: careProfileId,
      user_id: userId,
      role: dbRole,
      status: 'active',
    })
    .select('*, profiles:user_id(full_name, email)')
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] addCareProfileMember error:', error);
    return null;
  }

  return mapFamilyMember(data as unknown as DbMemberWithProfile);
};

/**
 * Update a member's role or status.
 */
export const updateCareProfileMember = async (
  memberId: string,
  updates: { role?: string; status?: string },
): Promise<boolean> => {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.role !== undefined) dbUpdates.role = roleToDb[updates.role] || updates.role;
  if (updates.status !== undefined) dbUpdates.status = memberStatusToDb[updates.status] || updates.status;

  const { error } = await supabase
    .from('care_profile_members')
    .update(dbUpdates)
    .eq('id', memberId);

  if (error) {
    console.error('[supabaseDataAdapter] updateCareProfileMember error:', error);
    return false;
  }
  return true;
};

/**
 * Remove a member from a care profile (delete their membership).
 */
export const removeCareProfileMember = async (memberId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('care_profile_members')
    .delete()
    .eq('id', memberId);

  if (error) {
    console.error('[supabaseDataAdapter] removeCareProfileMember error:', error);
    return false;
  }
  return true;
};

/**
 * Get the current user's role for a care profile.
 */
export const getCurrentUserRole = async (
  careProfileId: string,
  userId: string,
): Promise<{ role: string; isAdmin: boolean } | null> => {
  const { data, error } = await supabase.rpc('get_care_profile_role', {
    profile_id: careProfileId,
  });

  if (error || !data) {
    console.error('[supabaseDataAdapter] getCurrentUserRole error:', error);
    return null;
  }

  return {
    role: roleFromDb[data as string] || 'Familiar',
    isAdmin: data === 'admin',
  };
};

// ---------------------------------------------------------------------------
// CRUD: Care Profile Invites
// ---------------------------------------------------------------------------

export interface DbInvite {
  id: string;
  care_profile_id: string;
  invited_email: string;
  invited_name: string | null;
  invited_by: string | null;
  role: string;
  relationship: string | null;
  token: string;
  status: string;
  expires_at: string;
  accepted_at: string | null;
  accepted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PendingInvite {
  id: string;
  careProfileId: string;
  invitedEmail: string;
  invitedName: string;
  role: string;
  relationship: string;
  token: string;
  status: string;
  expiresAt: string;
}

/**
 * Generate a secure random invite token using crypto API.
 */
export const generateInviteToken = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const mapInvite = (row: DbInvite): PendingInvite => ({
  id: row.id,
  careProfileId: row.care_profile_id,
  invitedEmail: row.invited_email,
  invitedName: row.invited_name || '',
  role: roleFromDb[row.role] || 'Familiar',
  relationship: row.relationship || '',
  token: row.token,
  status: row.status,
  expiresAt: row.expires_at,
});

/**
 * Get all pending invites for a care profile.
 */
export const getCareProfileInvites = async (
  careProfileId: string,
): Promise<PendingInvite[]> => {
  const { data, error } = await supabase
    .from('care_profile_invites')
    .select('*')
    .eq('care_profile_id', careProfileId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[supabaseDataAdapter] getCareProfileInvites error:', error);
    return [];
  }

  return (data || []).map(mapInvite);
};

export const getCareProfileInviteByToken = async (
  token: string,
): Promise<PendingInvite | null> => {
  const { data, error } = await supabase
    .from('care_profile_invites')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (error) {
    console.error('[supabaseDataAdapter] getCareProfileInviteByToken error:', error);
    return null;
  }

  return data ? mapInvite(data as DbInvite) : null;
};

export const acceptCareProfileInvite = async (
  token: string,
  userId: string,
): Promise<{ success: boolean; error?: 'not_found' | 'expired' | 'not_pending' | 'membership' | 'invite' }> => {
  const { data: invite, error: inviteError } = await supabase
    .from('care_profile_invites')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (inviteError || !invite) {
    console.error('[supabaseDataAdapter] accept invite lookup error:', inviteError);
    return { success: false, error: 'not_found' };
  }

  const dbInvite = invite as DbInvite;
  if (dbInvite.status !== 'pending') return { success: false, error: 'not_pending' };
  if (new Date(dbInvite.expires_at).getTime() < Date.now()) return { success: false, error: 'expired' };

  const { data: existingMember, error: existingError } = await supabase
    .from('care_profile_members')
    .select('id')
    .eq('care_profile_id', dbInvite.care_profile_id)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingError) {
    console.error('[supabaseDataAdapter] accept invite membership lookup error:', existingError);
    return { success: false, error: 'membership' };
  }

  if (existingMember?.id) {
    const { error: updateMemberError } = await supabase
      .from('care_profile_members')
      .update({ role: dbInvite.role || 'family', status: 'active' })
      .eq('id', existingMember.id);

    if (updateMemberError) {
      console.error('[supabaseDataAdapter] accept invite membership update error:', updateMemberError);
      return { success: false, error: 'membership' };
    }
  } else {
    const { error: insertMemberError } = await supabase
      .from('care_profile_members')
      .insert({
        care_profile_id: dbInvite.care_profile_id,
        user_id: userId,
        role: dbInvite.role || 'family',
        status: 'active',
      });

    if (insertMemberError) {
      console.error('[supabaseDataAdapter] accept invite membership insert error:', insertMemberError);
      return { success: false, error: 'membership' };
    }
  }

  const { error: updateInviteError } = await supabase
    .from('care_profile_invites')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      accepted_by: userId,
    })
    .eq('id', dbInvite.id);

  if (updateInviteError) {
    console.error('[supabaseDataAdapter] accept invite update error:', updateInviteError);
    return { success: false, error: 'invite' };
  }

  return { success: true };
};

/**
 * Create a pending invite record.
 */
export const createCareProfileInvite = async (
  careProfileId: string,
  input: {
    invitedEmail: string;
    invitedName?: string;
    role: string;
    relationship?: string;
    invitedBy: string;
  },
): Promise<PendingInvite | null> => {
  const token = generateInviteToken();
  const dbRole = roleToDb[input.role] || 'family';
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('care_profile_invites')
    .insert({
      care_profile_id: careProfileId,
      invited_email: input.invitedEmail,
      invited_name: input.invitedName || null,
      role: dbRole,
      relationship: input.relationship || null,
      invited_by: input.invitedBy,
      token,
      status: 'pending',
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) {
    console.error('[supabaseDataAdapter] createCareProfileInvite error:', error);
    return null;
  }

  return mapInvite(data as DbInvite);
};

/**
 * Cancel (delete) a pending invite.
 */
export const cancelCareProfileInvite = async (inviteId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('care_profile_invites')
    .delete()
    .eq('id', inviteId);

  if (error) {
    console.error('[supabaseDataAdapter] cancelCareProfileInvite error:', error);
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// Storage helper functions
// ---------------------------------------------------------------------------

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const BUCKET_NAME = 'care-documents';

/**
 * Sanitise a filename for safe storage.
 */
export const sanitiseFileName = (name: string): string => {
  const ext = name.split('.').pop() || '';
  const base = name.slice(0, name.lastIndexOf('.'));
  const safeBase = base.toLowerCase().replace(/[^a-z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '');
  return safeExt ? `${safeBase || 'file'}.${safeExt}` : safeBase || 'file';
};

/**
 * Validate a file before upload.
 * Returns null if valid, or an error message string if invalid.
 */
export const validateFileForUpload = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return `File too large (max 5MB)`;
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return 'Unsupported file type. Accepted: PDF, JPG, PNG.';
  }
  return null;
};

/**
 * Upload a document file to Supabase Storage.
 * @returns The storage file path on success, or null on failure.
 */
export const uploadCareDocumentFile = async (
  careProfileId: string,
  documentId: string,
  file: File,
): Promise<string | null> => {
  const fileName = sanitiseFileName(file.name);
  const filePath = `care-profiles/${careProfileId}/${documentId}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('[supabaseDataAdapter] uploadCareDocumentFile error:', error);
    return null;
  }

  return filePath;
};

/**
 * Get a signed URL for a file in storage.
 * @returns Signed URL (10 minute expiry) or null on failure.
 */
export const getCareDocumentSignedUrl = async (
  filePath: string,
): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 10 * 60); // 10 minutes

  if (error || !data) {
    console.error('[supabaseDataAdapter] getCareDocumentSignedUrl error:', error);
    return null;
  }

  return data.signedUrl;
};

/**
 * Delete a file from storage.
 * @returns true if successful, false on failure.
 */
export const deleteCareDocumentFile = async (filePath: string): Promise<boolean> => {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('[supabaseDataAdapter] deleteCareDocumentFile error:', error);
    return false;
  }

  return true;
};

// ---------------------------------------------------------------------------
// Update care profile
// ---------------------------------------------------------------------------

export const updateCareProfile = async (
  id: string,
  updates: Partial<CareProfile>,
): Promise<boolean> => {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.nome !== undefined) dbUpdates.full_name = updates.nome;
  if (updates.dataNascimento !== undefined) dbUpdates.date_of_birth = updates.dataNascimento;
  if (updates.morada !== undefined) dbUpdates.address = updates.morada;
  if (updates.numeroSNS !== undefined) dbUpdates.sns_number = updates.numeroSNS;
  if (updates.alergias !== undefined) dbUpdates.allergies = updates.alergias.join(', ');
  if (updates.condicoes !== undefined) dbUpdates.conditions = updates.condicoes.join(', ');
  if (updates.medicoFamilia !== undefined) dbUpdates.doctor_name = updates.medicoFamilia;
  if (updates.farmaciaHabitual !== undefined) dbUpdates.pharmacy_name = updates.farmaciaHabitual;
  if (updates.notasImportantes !== undefined) dbUpdates.notes = updates.notasImportantes;

  const { error } = await supabase
    .from('care_profiles')
    .update(dbUpdates)
    .eq('id', id);

  if (error) {
    console.error('[supabaseDataAdapter] updateCareProfile error:', error);
    return false;
  }
  return true;
};
