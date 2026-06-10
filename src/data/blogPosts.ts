export interface BlogPost {
  slug: string;
  category: string;
  readingTime: string;
  title: {
    pt: string;
    en: string;
  };
  excerpt: {
    pt: string;
    en: string;
  };
  body: {
    pt: string[];
    en: string[];
  };
}

const blogPosts: BlogPost[] = [
  {
    slug: 'organizar-cuidados-familiar-idoso',
    category: 'Organização',
    readingTime: '5 min',
    title: {
      pt: 'Como organizar os cuidados de um familiar idoso em Portugal',
      en: 'How to organise care for an elderly family member in Portugal',
    },
    excerpt: {
      pt: 'Guia prático para famílias que começam a cuidar de um familiar idoso: primeiros passos, contactos essenciais, organização de medicamentos e consultas, e como partilhar responsabilidades.',
      en: 'A practical guide for families starting to care for an elderly relative: first steps, essential contacts, organising medications and appointments, and how to share responsibilities.',
    },
    body: {
      pt: [
        'Cuidar de um familiar idoso é uma responsabilidade que muitas famílias em Portugal assumem com amor, mas também com muitas dúvidas. Este guia prático ajuda a dar os primeiros passos com confiança.',
        '## 1. Comece com informação essencial',
        'Antes de organizar medicamentos ou consultas, reúna a informação básica do seu familiar: nome completo, data de nascimento, número de utente do SNS, alergias conhecidas, condições de saúde diagnosticadas, nome do médico de família e contactos de emergência.',
        '## 2. Organize os medicamentos',
        'Faça uma lista de todos os medicamentos que o seu familiar toma: nome do medicamento, dosagem, horário e frequência. Inclua medicamentos sujeitos a receita médica e de venda livre. Verifique regularmente as validades e renove as receitas antes que expirem.',
        '## 3. Marque e acompanhe consultas',
        'Mantenha um calendário com as consultas marcadas: médico de família, especialidades, análises e exames. Registe o local, data, hora e médico. Partilhe essa informação com outros familiares para evitar esquecimentos.',
        '## 4. Envolva outros familiares',
        'Cuidar sozinho pode ser exaustivo. Defina tarefas para cada familiar: quem leva às consultas, quem faz as compras, quem verifica os medicamentos. Use uma ferramenta como o CuidarJuntos para manter todos atualizados.',
        '## 5. Prepare uma ficha de emergência',
        'Em caso de urgência, ter uma ficha com medicamentos, alergias, contactos e condições de saúde do seu familiar pode fazer a diferença. Tenha-a sempre acessível e partilhe-a com quem possa precisar.',
      ],
      en: [
        'Caring for an elderly family member is a responsibility that many families in Portugal take on with love, but also with many questions. This practical guide helps you get started with confidence.',
        '## 1. Start with essential information',
        'Before organising medications or appointments, gather your family member\'s basic information: full name, date of birth, NHS (SNS) number, known allergies, diagnosed health conditions, family doctor\'s name and emergency contacts.',
        '## 2. Organise medications',
        'Make a list of all the medications your family member takes: medication name, dosage, time and frequency. Include prescription and over-the-counter medicines. Check expiry dates regularly and renew prescriptions before they expire.',
        '## 3. Schedule and track appointments',
        'Keep a calendar of booked appointments: family doctor, specialists, tests and exams. Record the location, date, time and doctor. Share this information with other family members to avoid missed appointments.',
        '## 4. Involve other family members',
        'Caring alone can be exhausting. Assign tasks to each family member: who takes to appointments, who does the shopping, who checks medications. Use a tool like CuidarJuntos to keep everyone updated.',
        '## 5. Prepare an emergency card',
        'In an emergency, having a card with medications, allergies, contacts and health conditions can make a difference. Keep it accessible at all times and share it with anyone who may need it.',
      ],
    },
  },
  {
    slug: 'checklist-ficha-emergencia',
    category: 'Emergência',
    readingTime: '4 min',
    title: {
      pt: 'Checklist da ficha de emergência: o que deve estar sempre acessível',
      en: 'Emergency card checklist: what should always be accessible',
    },
    excerpt: {
      pt: 'Saiba exatamente que informação incluir numa ficha de emergência para o seu familiar: medicamentos, alergias, contactos prioritários e condições de saúde.',
      en: 'Learn exactly what information to include on an emergency card for your family member: medications, allergies, priority contacts and health conditions.',
    },
    body: {
      pt: [
        'Uma ficha de emergência bem preparada pode poupar minutos preciosos numa situação de urgência. Este guia explica o que deve incluir e como mantê-la atualizada.',
        '## Informação pessoal',
        'Nome completo do familiar, data de nascimento, número de utente do SNS e morada.',
        '## Condições de saúde',
        'Lista das condições de saúde diagnosticadas: diabetes, hipertensão, problemas cardíacos, respiratórios, alergias graves. Seja claro e específico.',
        '## Medicamentos atuais',
        'Lista completa de medicamentos com nome, dosagem e horários. Inclua medicamentos SOS e indique se algum requer cuidados especiais.',
        '## Alergias',
        'Alergias a medicamentos, alimentos, látex ou outras substâncias. Destaque alergias graves que possam causar reações anafiláticas.',
        '## Contactos de emergência',
        'Inclua pelo menos três contactos: médico de família, familiar de contacto principal e um contacto alternativo. Indique nome, relação e número de telefone.',
        '## Outras informações importantes',
        'Grupo sanguíneo, necessidades especiais (dieta, mobilidade, comunicação), observações relevantes.',
      ],
      en: [
        'A well-prepared emergency card can save precious minutes in an urgent situation. This guide explains what to include and how to keep it updated.',
        '## Personal information',
        'Family member\'s full name, date of birth, NHS (SNS) number and address.',
        '## Health conditions',
        'List of diagnosed health conditions: diabetes, hypertension, heart conditions, respiratory issues, severe allergies. Be clear and specific.',
        '## Current medications',
        'Complete list of medications with name, dosage and schedules. Include emergency medications and note if any require special care.',
        '## Allergies',
        'Allergies to medications, food, latex or other substances. Highlight severe allergies that may cause anaphylactic reactions.',
        '## Emergency contacts',
        'Include at least three contacts: family doctor, primary family contact and an alternative contact. Include name, relationship and phone number.',
        '## Other important information',
        'Blood type, special needs (diet, mobility, communication), relevant notes.',
      ],
    },
  },
  {
    slug: 'gestao-medicamentos-familia',
    category: 'Medicamentos',
    readingTime: '4 min',
    title: {
      pt: 'Como evitar falhas na gestão de medicamentos em família',
      en: 'How to avoid medication management mistakes as a family',
    },
    excerpt: {
      pt: 'Dicas práticas para evitar doses esquecidas, duplicadas ou trocadas quando vários familiares partilham a responsabilidade dos medicamentos.',
      en: 'Practical tips to avoid missed, double or mixed-up doses when multiple family members share medication responsibility.',
    },
    body: {
      pt: [
        'Quando vários familiares ajudam a gerir os medicamentos de um idoso, o risco de erros aumenta. Este guia oferece estratégias simples para evitar falhas comuns.',
        '## 1. Crie uma lista centralizada',
        'Mantenha uma lista de medicamentos visível e acessível a todos os cuidadores. Inclua nome, dosagem, horário e instruções especiais. Evite papéis espalhados ou mensagens de WhatsApp.',
        '## 2. Use um sistema de verificação',
        'Sempre que alguém administrar um medicamento, registe a toma. Isto evita a dúvida clássica: "Já tomou o da manhã?". Pode usar um quadro, uma app ou o CuidarJuntos.',
        '## 3. Defina responsabilidades claras',
        'Atribua os horários de medicação a familiares específicos: a filha da manhã, o filho da noite. Evite que todos pensem que "alguém já tratou".',
        '## 4. Prepare a semana com antecedência',
        'Use uma caixa semanal de medicamentos com divisões por dia e horário. Prepare tudo ao domingo e confira com a lista centralizada.',
        '## 5. Verifique interações e renovações',
        'Consulte o farmacêutico sobre possíveis interações entre medicamentos. Renove receitas antes de acabarem para evitar interrupções.',
      ],
      en: [
        'When multiple family members help manage an elderly person\'s medications, the risk of errors increases. This guide offers simple strategies to avoid common mistakes.',
        '## 1. Create a centralised list',
        'Keep a medication list visible and accessible to all caregivers. Include name, dosage, time and special instructions. Avoid scattered papers or WhatsApp messages.',
        '## 2. Use a verification system',
        'Whenever someone administers a medication, log the dose. This avoids the classic question: "Did they already take the morning dose?". Use a board, an app or CuidarJuntos.',
        '## 3. Set clear responsibilities',
        'Assign medication times to specific family members: the daughter does mornings, the son does evenings. Avoid everyone assuming "someone took care of it."',
        '## 4. Prepare the week in advance',
        'Use a weekly pill box with day and time divisions. Prepare everything on Sunday and check against the centralised list.',
        '## 5. Check interactions and renewals',
        'Consult the pharmacist about possible drug interactions. Renew prescriptions before they run out to avoid interruptions.',
      ],
    },
  },
  {
    slug: 'documentos-importantes-cuidador',
    category: 'Documentos',
    readingTime: '4 min',
    title: {
      pt: 'Documentos importantes que uma família cuidadora deve manter organizados',
      en: 'Important documents caregiving families should keep organised',
    },
    excerpt: {
      pt: 'Saiba quais os documentos essenciais que deve ter sempre organizados e acessíveis: identificação, saúde, seguros e finanças.',
      en: 'Learn which essential documents you should always keep organised and accessible: identification, health, insurance and finances.',
    },
    body: {
      pt: [
        'Ter os documentos certos organizados pode evitar stress em situações já difíceis. Este guia lista os documentos essenciais para famílias cuidadoras.',
        '## Documentos de identificação',
        'Cartão de cidadão ou bilhete de identidade, cartão de utente do SNS, número de segurança social. Tenha cópias digitais seguras.',
        '## Documentos de saúde',
        'Relatórios médicos recentes, resultados de exames e análises, cartão de sub-sistema de saúde (ADSE, SAMS, etc.), boletim de vacinas, receitas médicas ativas.',
        '## Documentos de seguros',
        'Apólices de seguro de saúde, seguro de vida, seguro de acidentes pessoais. Anote os números de apólice e contactos em caso de sinistro.',
        '## Documentos financeiros e legais',
        'Procuração para cuidados de saúde (se aplicável), testamento vital (se existir), informações bancárias básicas para gestão do dia-a-dia.',
        '## Como organizar',
        'Digitalize os documentos essenciais e guarde cópias em local seguro. Use uma ferramenta como o CuidarJuntos para manter metadados e lembretes de renovação.',
      ],
      en: [
        'Having the right documents organised can avoid stress in already difficult situations. This guide lists the essential documents for caregiving families.',
        '## Identification documents',
        'Citizen card or ID, NHS (SNS) user card, social security number. Keep secure digital copies.',
        '## Health documents',
        'Recent medical reports, test and analysis results, health subsystem card (ADSE, SAMS, etc.), vaccination record, active prescriptions.',
        '## Insurance documents',
        'Health insurance policies, life insurance, personal accident insurance. Note policy numbers and claims contacts.',
        '## Financial and legal documents',
        'Healthcare power of attorney (if applicable), living will (if existing), basic banking information for day-to-day management.',
        '## How to organise',
        'Scan essential documents and store copies securely. Use a tool like CuidarJuntos to keep metadata and renewal reminders.',
      ],
    },
  },
];

export default blogPosts;