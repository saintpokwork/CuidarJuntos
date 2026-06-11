import type {
  CareData,
  CareProfile,
  FamilyMember,
  Medication,
  Appointment,
  Task,
  Document,
  CareNote,
  EmergencyContact,
} from './types';

// Isolated adapter used when the Supabase client must not be loaded.
// Nunca chama a API ou carrega bibliotecas Supabase.

export const signIn = async (email: string, password: string): Promise<void> => {
  // TODO: implementar autenticação com Supabase Auth
  throw new Error('Supabase não está integrado nesta versão.');
};

export const signUp = async (name: string, email: string, password: string): Promise<void> => {
  // TODO: criar utilizador com Supabase Auth e guardar perfil no Postgres
  throw new Error('Supabase não está integrado nesta versão.');
};

export const resetPassword = async (email: string): Promise<void> => {
  // TODO: iniciar fluxo de recuperação de palavra-passe com Supabase
  throw new Error('Supabase não está integrado nesta versão.');
};

export const fetchCareData = async (userId: string): Promise<CareData> => {
  // TODO: obter dados do utilizador autenticado a partir da base de dados Postgres
  throw new Error('Supabase não está integrado nesta versão.');
};

export const saveCareData = async (userId: string, data: CareData): Promise<void> => {
  // TODO: guardar dados do cuidado no Postgres com suporte offline/online
  throw new Error('Supabase não está integrado nesta versão.');
};

export const uploadDocument = async (careProfileId: string, file: File): Promise<string> => {
  // TODO: carregar ficheiros para o Storage do Supabase e devolver URL privada
  throw new Error('Supabase não está integrado nesta versão.');
};

export const inviteFamilyMember = async (careProfileId: string, memberEmail: string): Promise<void> => {
  // TODO: convidar um membro para partilhar o perfil de cuidado
  throw new Error('Supabase não está integrado nesta versão.');
};
