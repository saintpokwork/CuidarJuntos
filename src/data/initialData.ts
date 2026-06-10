import {
  medications as initialMedications,
  appointments as initialAppointments,
  tasks as initialTasks,
  documents as initialDocuments,
  careNotes as initialCareNotes,
  familyMembers as initialFamilyMembers,
  emergencyContacts as initialEmergencyContacts,
  careProfile,
  caregiver,
} from './mockData';

export type MedicationEstado = 'Ativo' | 'Em falta';
export type TaskStatus = 'por_fazer' | 'em_progresso' | 'concluido';
export type TaskPriority = 'Baixa' | 'Média' | 'Urgente';
export type DocumentCategory =
  | 'Receitas'
  | 'Exames'
  | 'Seguro'
  | 'Identificação'
  | 'Faturas'
  | 'Outros';
export type FamilyRole = 'Administrador' | 'Familiar' | 'Cuidador' | 'Apenas leitura';
export type MemberStatus = 'Ativo' | 'Convite pendente' | 'Convite enviado';

export interface Medication {
  id: string;
  nome: string;
  dosagem: string;
  horario: string;
  frequencia: string;
  responsavel: string;
  estado: MedicationEstado;
  instrucoes: string;
  tomadoHoje?: boolean;
}

export interface Appointment {
  id: string;
  tipo: string;
  dataHora: string;
  local: string;
  medico: string;
  responsavel: string;
  notas: string;
  estado: 'Agendada';
}

export interface Task {
  id: string;
  titulo: string;
  responsavel: string;
  prioridade: TaskPriority;
  dataLimite: string;
  status: TaskStatus;
  local: string;
}

export interface Document {
  id: string;
  titulo: string;
  categoria: DocumentCategory;
  dataAdicao: string;
  dataValidade: string;
  notas: string;
}

export interface CareNote {
  id: string;
  nota: string;
  autor: string;
  dataHora: string;
}

export interface FamilyMember {
  id: string;
  nome: string;
  relacao: string;
  funcao: FamilyRole;
  estado: MemberStatus;
  avatar: string;
  contacto?: string;
}

export interface EmergencyContact {
  id: string;
  nome: string;
  funcao: string;
  telefone: string;
  avatar: string;
}

export interface CareProfile {
  nome: string;
  dataNascimento: string;
  morada: string;
  numeroSNS: string;
  alergias: string[];
  condicoes: string[];
  medicoFamilia: string;
  farmaciaHabitual: string;
  notasImportantes: string;
  contactosPrincipais: { nome: string; relacao: string; telefone: string }[];
  atualizadoEm?: string;
}

export interface CareData {
  medications: Medication[];
  appointments: Appointment[];
  tasks: Task[];
  documents: Document[];
  careNotes: CareNote[];
  familyMembers: FamilyMember[];
  emergencyContacts: EmergencyContact[];
  careProfile: CareProfile;
}

export const getInitialCareData = (): CareData => ({
  medications: JSON.parse(JSON.stringify(initialMedications)),
  appointments: JSON.parse(JSON.stringify(initialAppointments)),
  tasks: JSON.parse(JSON.stringify(initialTasks)),
  documents: JSON.parse(JSON.stringify(initialDocuments)),
  careNotes: JSON.parse(JSON.stringify(initialCareNotes)),
  familyMembers: JSON.parse(JSON.stringify(initialFamilyMembers)),
  emergencyContacts: JSON.parse(JSON.stringify(initialEmergencyContacts)),
  careProfile: JSON.parse(JSON.stringify(careProfile)),
});

export { careProfile, caregiver };

export const documentCategories: DocumentCategory[] = [
  'Receitas',
  'Exames',
  'Seguro',
  'Identificação',
  'Faturas',
  'Outros',
];
