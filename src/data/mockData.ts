export const caregiver = {
  nome: 'Ana Silva',
  funcao: 'Responsável familiar',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBrPXztbyOYTTQCl760tVuMOIgwXU_Ea-JCTvkNgmleAvT1--BeaWO8k0vsTXLp55H0GT-vTKPWV-3UjDypVHRHCKrKcBEkf290KL7xHl8eRIU6viBI0fXvEHd1uY4wGmYbvILh2kW5BNytoETMzHRsxgNQNAqEaB8B_SjHRmAnFdnulJEce6ql7Ag8eaAXm6QauRVuLwMCr49ax72MqarTFft8T7eeNcVy51Rrz85bacw5syFK3MTcQQckKMhkgyJS9jRPBZZXTZxx',
};

export const careProfile = {
  nome: 'Maria Fernandes',
  dataNascimento: '12 de março de 1948',
  morada: 'Rua das Flores, 42, 3.º Esq., 1200-195 Lisboa',
  numeroSNS: '123 456 789',
  alergias: ['Penicilina', 'Amendoim'],
  condicoes: ['Diabetes Tipo 2', 'Hipertensão arterial', 'Osteoartrite'],
  medicoFamilia: 'Dr. António Pereira — USF Campo de Ourique',
  farmaciaHabitual: 'Farmácia Central do Chiado',
  notasImportantes:
    'Paciente com diabetes e hipertensão. Em caso de desmaio, verificar glicemia. Contactar sempre a filha Ana Silva em primeiro lugar.',
  contactosPrincipais: [
    { nome: 'Ana Silva', relacao: 'Filha', telefone: '+351 912 345 678' },
    { nome: 'João Fernandes', relacao: 'Filho', telefone: '+351 923 456 789' },
  ],
};

export const dashboardSummary = {
  saudacao: 'Bom dia, Ana',
  resumo: 'Hoje há 2 medicamentos, 1 tarefa pendente e nenhuma consulta marcada.',
};

export const medications = [
  {
    id: '1',
    nome: 'Metformina',
    dosagem: '500mg',
    horario: '08:00, 20:00',
    frequencia: 'Diariamente',
    responsavel: 'Ana Silva',
    estado: 'Ativo' as const,
    instrucoes: 'Após as refeições',
    tomadoHoje: false,
  },
  {
    id: '2',
    nome: 'Aspirina',
    dosagem: '100mg',
    horario: '09:00',
    frequencia: 'Diariamente',
    responsavel: 'João Fernandes',
    estado: 'Ativo' as const,
    instrucoes: 'Após o pequeno-almoço',
    tomadoHoje: false,
  },
  {
    id: '3',
    nome: 'Losartan',
    dosagem: '50mg',
    horario: '08:00',
    frequencia: 'Diariamente',
    responsavel: 'Ana Silva',
    estado: 'Ativo' as const,
    instrucoes: 'Em jejum',
    tomadoHoje: false,
  },
  {
    id: '4',
    nome: 'Multivitamínico',
    dosagem: '1 comprimido',
    horario: '13:00',
    frequencia: 'Diariamente',
    responsavel: 'Ana Silva',
    estado: 'Em falta' as const,
    instrucoes: 'Durante o almoço',
    tomadoHoje: false,
  },
];

export const medicationsToday = [
  { id: '1', nome: 'Aspirina 100mg', horario: '09:00', instrucoes: 'Após o pequeno-almoço', tomado: false },
  { id: '2', nome: 'Multivitamínico', horario: '13:00', instrucoes: 'Durante o almoço', tomado: false },
];

export const appointments = [
  {
    id: '1',
    tipo: 'Consulta de cardiologia',
    dataHora: '15 de julho de 2024, 10:30',
    local: 'Hospital de Santa Maria — Piso 3',
    medico: 'Dr. Roberto Santos',
    responsavel: 'Ana Silva',
    notas: 'Levar últimas análises de colesterol',
    estado: 'Agendada' as const,
  },
  {
    id: '2',
    tipo: 'Análises de rotina',
    dataHora: '22 de julho de 2024, 08:00',
    local: 'Laboratório Synlab — Amoreiras',
    medico: 'Serviço de análises clínicas',
    responsavel: 'João Fernandes',
    notas: 'Em jejum de 12 horas',
    estado: 'Agendada' as const,
  },
];

export type TaskStatus = 'por_fazer' | 'em_progresso' | 'concluido';
export type TaskPriority = 'Baixa' | 'Média' | 'Urgente';

export const tasks = [
  {
    id: '1',
    titulo: 'Comprar gaze e álcool',
    responsavel: 'João Fernandes',
    prioridade: 'Urgente' as TaskPriority,
    dataLimite: 'Hoje',
    status: 'por_fazer' as TaskStatus,
    local: 'Farmácia Central do Chiado',
  },
  {
    id: '2',
    titulo: 'Marcar consulta de oftalmologia',
    responsavel: 'Ana Silva',
    prioridade: 'Média' as TaskPriority,
    dataLimite: 'Até sexta-feira',
    status: 'por_fazer' as TaskStatus,
    local: 'USF Campo de Ourique',
  },
  {
    id: '3',
    titulo: 'Organizar documentos de seguro',
    responsavel: 'Ana Silva',
    prioridade: 'Baixa' as TaskPriority,
    dataLimite: 'Próxima semana',
    status: 'em_progresso' as TaskStatus,
    local: 'Em casa',
  },
  {
    id: '4',
    titulo: 'Levar à fisioterapia',
    responsavel: 'João Fernandes',
    prioridade: 'Média' as TaskPriority,
    dataLimite: 'Ontem',
    status: 'concluido' as TaskStatus,
    local: 'Clínica Movimento',
  },
];

export type DocumentCategory =
  | 'Receitas'
  | 'Exames'
  | 'Seguro'
  | 'Identificação'
  | 'Faturas'
  | 'Outros';

export const documents = [
  {
    id: '1',
    titulo: 'Análises_Julho_2024.pdf',
    categoria: 'Exames' as DocumentCategory,
    dataAdicao: 'Há 2 dias',
    dataValidade: '31/12/2025',
    notas: 'Resultados de rotina',
  },
  {
    id: '2',
    titulo: 'Receita_Dra_Marta.jpg',
    categoria: 'Receitas' as DocumentCategory,
    dataAdicao: 'Há 1 semana',
    dataValidade: '15/08/2024',
    notas: 'Metformina e Losartan',
  },
  {
    id: '3',
    titulo: 'Cartão_Multicare.pdf',
    categoria: 'Seguro' as DocumentCategory,
    dataAdicao: 'Há 3 semanas',
    dataValidade: '31/12/2024',
    notas: 'Apólice de saúde',
  },
  {
    id: '4',
    titulo: 'Cartão_Cidadão.pdf',
    categoria: 'Identificação' as DocumentCategory,
    dataAdicao: 'Há 1 mês',
    dataValidade: '10/06/2028',
    notas: '',
  },
  {
    id: '5',
    titulo: 'Fatura_Farmacia_Junho.pdf',
    categoria: 'Faturas' as DocumentCategory,
    dataAdicao: 'Há 2 semanas',
    dataValidade: '',
    notas: 'Medicamentos do mês',
  },
];

export const documentCategories: DocumentCategory[] = [
  'Receitas',
  'Exames',
  'Seguro',
  'Identificação',
  'Faturas',
  'Outros',
];

export const emergencyContacts = [
  {
    id: '1',
    nome: 'Dr. Roberto Santos',
    funcao: 'Cardiologista',
    relacao: 'Especialista',
    telefone: '+351 213 456 789',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzLuUldVxFr6oTpwHfCR_cVjegacX1rcjLvifvyX6Et7c2Rbb87al0JjVPLYWFXOl2EyfzCcyGitnRz4IBMTZRlH6rQ7A1DJfVZh8HAkAZVgx5jOC64U7abkiPm05ErRwzFvAS2eY2Btzu2ZL_-cJxoQRi22zEPQf6AzWc-lMIXpMg5iSk6R4n2yhssg2Gzz_Ty032HmkrUC1YBVpRFsIBtVupeWk-zhrWvx-sCA532QDre749A_tpID_x2wzpawCbdAnxUmp6MAIO',
  },
  {
    id: '2',
    nome: 'Enf. Maria Costa',
    funcao: 'Cuidados 24h',
    relacao: 'Cuidadora',
    telefone: '+351 926 789 012',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUyZABvFDj4v2v_L2kF80wk7dfsTqaSxi7fGRONoUqMKf7tYECWk22U2YE19y18YwtOXu0G47n7ys9iYMOeS1WMqZ8Ay1ZM17gUvC087UqCVZKCDFAmE12c3VLA9HS7lTKVSktfSL3cnbKXQLvbkhe0XR6VSR--BhEUCP-hPR_z5vpfcUfSwrvA8WlCD8_AmHeTmIn-EM5mimVypWa6aWQIyzDxUY-xehaKvrAEcEIEBrGyQG2HwsGXn8u5n2d8V2BBnVfWAZYgReL',
  },
  {
    id: '3',
    nome: 'Ana Silva',
    funcao: 'Filha / Contacto principal',
    relacao: 'Filha',
    telefone: '+351 912 345 678',
    avatar: caregiver.avatar,
  },
  {
    id: '4',
    nome: 'João Fernandes',
    funcao: 'Filho',
    relacao: 'Filho',
    telefone: '+351 923 456 789',
    avatar: '',
  },
];

export const emergencySheet = {
  nome: careProfile.nome,
  dataNascimento: careProfile.dataNascimento,
  numeroSNS: careProfile.numeroSNS,
  alergias: careProfile.alergias,
  medicamentosAtuais: medications.filter((m) => m.estado === 'Ativo').map((m) => `${m.nome} ${m.dosagem}`),
  medicoFamilia: careProfile.medicoFamilia,
  farmaciaHabitual: careProfile.farmaciaHabitual,
  morada: careProfile.morada,
  notasImportantes:
    'Paciente com diabetes e hipertensão. Em caso de desmaio, verificar glicemia. Contactar sempre a filha Ana Silva em primeiro lugar.',
};

export type FamilyRole = 'Administrador' | 'Familiar' | 'Cuidador' | 'Apenas leitura';
export type MemberStatus = 'Ativo' | 'Convite pendente';

export const familyMembers = [
  {
    id: '1',
    nome: 'Ana Silva',
    relacao: 'Filha',
    funcao: 'Administrador' as FamilyRole,
    estado: 'Ativo' as MemberStatus,
    avatar: caregiver.avatar,
  },
  {
    id: '2',
    nome: 'João Fernandes',
    relacao: 'Filho',
    funcao: 'Familiar' as FamilyRole,
    estado: 'Ativo' as MemberStatus,
    avatar: '',
  },
  {
    id: '3',
    nome: 'Sofia Martins',
    relacao: 'Neta',
    funcao: 'Apenas leitura' as FamilyRole,
    estado: 'Ativo' as MemberStatus,
    avatar: '',
  },
  {
    id: '4',
    nome: 'Carlos Mendes',
    relacao: 'Cuidador profissional',
    funcao: 'Cuidador' as FamilyRole,
    estado: 'Convite pendente' as MemberStatus,
    avatar: '',
  },
];

export const careNotes = [
  {
    id: '1',
    nota: 'Lembrar de medir a tensão arterial amanhã de manhã antes da medicação. A mãe sentiu-se um pouco tonta hoje à tarde.',
    autor: 'Ana Silva',
    dataHora: 'Hoje, 18:30',
  },
  {
    id: '2',
    nota: 'Almoço bem aceite. Tomou toda a medicação da hora do almoço sem problemas.',
    autor: 'João Fernandes',
    dataHora: 'Hoje, 14:15',
  },
  {
    id: '3',
    nota: 'Consulta de rotina adiada para a próxima semana. Dr. Pereira pediu novas análises de colesterol.',
    autor: 'Ana Silva',
    dataHora: 'Ontem, 11:00',
  },
  {
    id: '4',
    nota: 'Passeio matinal no jardim. Bom humor e boa mobilidade. Sem queixas de dor.',
    autor: 'Carlos Mendes',
    dataHora: 'Ontem, 09:45',
  },
];

export const latestCareNote = careNotes[0];
