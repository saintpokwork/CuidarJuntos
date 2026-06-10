const translations = {
  pt: {
    appName: 'CuidarJuntos',
    global: {
      dashboard: 'Painel',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Adicionar',
      continue: 'Continuar',
      back: 'Voltar',
      loading: 'A carregar',
      demo: 'Demo',
      signIn: 'Entrar',
      createAccount: 'Criar conta',
      signOut: 'Sair',
    },
    nav: {
      home: 'Início',
      howItWorks: 'Como funciona',
      dashboard: 'Painel',
      profile: 'Perfil',
      medications: 'Medicamentos',
      appointments: 'Consultas',
      tasks: 'Tarefas',
      documents: 'Documentos',
      emergency: 'Emergência',
      family: 'Família',
      notes: 'Notas',
      settings: 'Definições',
      quickGuide: 'Guia rápido',
      more: 'Mais',
    },
    safety: {
      disclaimer:
        'CuidarJuntos não substitui médicos, hospitais, farmácias, o SNS ou serviços de emergência. Em caso de emergência, ligue 112.',
    },
    demo: {
      notice: 'Versão demo — os dados ficam guardados apenas neste navegador.',
      signedInNotice:
        'Sessão iniciada. Nesta versão, os dados do painel ainda ficam guardados apenas neste navegador. Sincronização segura será adicionada na próxima fase.',
    },
    home: {
      hero: {
        title: 'Cuide melhor dos seus pais, com toda a família organizada num só lugar.',
        subtitle:
          'Guarde medicamentos, consultas, documentos, contactos de emergência e tarefas familiares numa plataforma simples feita para famílias portuguesas.',
        ctaPrimary: 'Começar gratuitamente',
        ctaSecondary: 'Ver como funciona',
        demoNotice: 'Versão demo — não é necessário criar conta.',
      },
      problemsTitle: 'Cuidar de um familiar não devia depender de mensagens perdidas no WhatsApp.',
      problemsSubtitle: 'A dispersão de informação causa stress e erros graves. Nós resolvemos os problemas mais comuns do dia-a-dia.',
      features: {
        meds: 'Medicamentos e horários',
        medsDesc: 'Controlo rigoroso de stock e alertas de toma para nunca falhar uma dose.',
        appointments: 'Consultas e exames',
        appointmentsDesc: 'Histórico completo e lembretes partilhados para toda a rede de cuidadores.',
        documents: 'Documentos importantes',
        documentsDesc: 'Digitalize e aceda a receitas, análises e relatórios médicos em segundos.',
        tasks: 'Tarefas da família',
        tasksDesc: 'Atribua quem faz as compras ou quem leva o familiar ao passeio diário.',
        contacts: 'Contactos de emergência',
        contactsDesc: 'Lista rápida de médicos, vizinhos e familiares acessível em qualquer situação.',
      },
      howItWorks: {
        title: 'Comece a cuidar em 4 passos simples',
      },
      whoFor: {
        title: 'Para quem é',
        item1: 'Famílias que cuidam de um pai, mãe ou avô',
        item2: 'Redes de cuidadores que precisam de organizar tarefas',
        item3: 'Quem precisa de registos de medicamentos e consultas fáceis de partilhar',
      },
      faq: {
        q1: 'É seguro guardar dados médicos?',
        a1: 'Na versão demo os dados ficam apenas no seu navegador. Na versão futura a sincronização será segura e encriptada.',
        q2: 'Posso partilhar com a família?',
        a2: 'Ainda não — o compartilhamento será adicionado numa fase posterior com contas reais.',
      },
    },
    dashboard: {
      bannerTitle: 'Criar conta em breve',
      bannerSubtitle:
        'Contas reais estão planeadas para a próxima versão. Por agora, continue a usar a demo local e veja como a sincronização com familiares funcionará mais tarde.',
      exampleDataNote: 'Os dados apresentados são exemplos para demonstrar como a plataforma funciona.',
      medsToday: 'Medicamentos hoje',
      nextAppointment: 'Próxima consulta',
      tasksOverdue: 'Tarefas em atraso',
      profileCompletion: 'Perfil completo',
      nextStepsTitle: 'Próximos passos',
      nextStepsSubtitle: 'Sugestões para manter a organização da família.',
      addMedication: 'Adicionar medicamento',
      scheduleAppointment: 'Marcar consulta',
      createTask: 'Criar tarefa',
      uploadDocument: 'Enviar documento',
      createEmergencyCard: 'Criar ficha de emergência',
      viewFullPlan: 'Ver plano completo',
      scheduleNewAppointment: 'Agendar nova consulta',
      viewAllAppointments: 'Ver todas as consultas',
      noMedications: 'Ainda não há medicamentos registados.',
      noAppointments: 'Ainda não há consultas marcadas.',
      noTasks: 'Ainda não há tarefas.',
      noDocuments: 'Ainda não há documentos.',
      noNotes: 'Ainda não há notas de cuidado.',
    },
    pages: {
      profile: {
        title: 'Perfil',
      },
      medications: {
        title: 'Medicamentos',
        name: 'Nome do medicamento',
        dosage: 'Dosagem',
        frequency: 'Frequência',
        schedule: 'Horário',
        add: 'Adicionar medicamento',
        empty: 'Ainda não há medicamentos registados.',
      },
      appointments: {
        title: 'Consultas',
        add: 'Marcar consulta',
        empty: 'Ainda não há consultas marcadas.',
      },
      tasks: {
        title: 'Tarefas',
        add: 'Criar tarefa',
        empty: 'Ainda não há tarefas.',
      },
      documents: {
        title: 'Documentos',
        add: 'Enviar documento',
        empty: 'Ainda não há documentos.',
      },
      emergency: {
        title: 'Emergência',
        add: 'Criar ficha de emergência',
        empty: 'Ainda não há contactos de emergência.',
      },
      family: {
        title: 'Família',
        empty: 'Ainda não há membros da família.',
      },
      notes: {
        title: 'Notas',
        empty: 'Ainda não há notas de cuidado.',
      },
      settings: {
        title: 'Definicoes',
      },
      guide: {
        title: 'Guia rápido',
      },
    },
    legal: {
      privacy: {
        summary_en:
          'Privacy summary: demo stores data locally in the browser. No medical advice. In emergencies call 112. Future secure cloud sync may be added; do not put highly sensitive medical data in the demo.',
      },
      terms: {
        summary_en:
          'Terms summary: This demo stores data locally. No warranties. Medical content is informational only. In emergencies call 112. Future cloud sync may be provided; no payments or uploads in demo.',
      },
    },
    auth: {
      titleSignIn: 'Entrar no CuidarJuntos',
      titleSignUp: 'Criar conta',
      titleReset: 'Recuperar palavra-passe',
      email: 'Email',
      password: 'Palavra-passe',
      submitSignIn: 'Entrar',
      submitSignUp: 'Criar conta',
      submitReset: 'Enviar instruções',
      continueDemo: 'Continuar para demo',
      creating: 'A criar conta...',
      signingIn: 'A iniciar sessão...',
      sending: 'A enviar...',
    },
  },
  en: {
    appName: 'CuidarJuntos',
    global: {
      dashboard: 'Dashboard',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      continue: 'Continue',
      back: 'Back',
      loading: 'Loading',
      demo: 'Demo',
      signIn: 'Sign in',
      createAccount: 'Create account',
      signOut: 'Sign out',
    },
    nav: {
      home: 'Home',
      howItWorks: 'How it works',
      dashboard: 'Dashboard',
      profile: 'Profile',
      medications: 'Medications',
      appointments: 'Appointments',
      tasks: 'Tasks',
      documents: 'Documents',
      emergency: 'Emergency',
      family: 'Family',
      notes: 'Notes',
      settings: 'Settings',
      quickGuide: 'Quick guide',
      more: 'More',
    },
    safety: {
      disclaimer:
        'CuidarJuntos does not replace doctors, hospitals, pharmacies, the Portuguese NHS/SNS or emergency services. In an emergency, call 112.',
    },
    demo: {
      notice: 'Demo version — data is stored only in this browser.',
      signedInNotice:
        'Signed in. In this version, dashboard data is still stored only in this browser. Secure sync will be added in the next phase.',
    },
    home: {
      hero: {
        title: 'Care better for your parents, with the whole family organised in one place.',
        subtitle:
          'Save medications, appointments, documents, emergency contacts and family tasks in a simple tool built for Portuguese families.',
        ctaPrimary: 'Start for free',
        ctaSecondary: 'See how it works',
        demoNotice: 'Demo version — no account is needed.',
      },
      problemsTitle: 'Caring for a relative shouldn’t depend on messages lost in WhatsApp.',
      problemsSubtitle: 'Scattered information causes stress and dangerous mistakes. We solve the most common day-to-day problems.',
      features: {
        meds: 'Medications & schedules',
        medsDesc: 'Stock control and dose reminders so you never miss a dose.',
        appointments: 'Appointments & checks',
        appointmentsDesc: 'Full history and shared reminders for the whole caregiving network.',
        documents: 'Important documents',
        documentsDesc: 'Scan and access prescriptions, tests and reports in seconds.',
        tasks: 'Family tasks',
        tasksDesc: 'Assign who does the shopping or who takes the family member for a walk.',
        contacts: 'Emergency contacts',
        contactsDesc: 'Quick list of doctors, neighbours and family members accessible in any situation.',
      },
      howItWorks: {
        title: 'Start caring in 4 simple steps',
      },
      whoFor: {
        title: 'Who it’s for',
        item1: 'Families caring for a parent, grandparent or elderly relative',
        item2: 'Care networks that need to organise tasks',
        item3: 'Anyone who needs easy records for medications and appointments',
      },
      faq: {
        q1: 'Is it safe to store medical data?',
        a1: 'In the demo the data stays only in your browser. In the future secure encrypted sync will be available.',
        q2: 'Can I share with family?',
        a2: 'Not yet — sharing will be added later with real accounts.',
      },
    },
    dashboard: {
      bannerTitle: 'Account coming soon',
      bannerSubtitle:
        'Real accounts are planned for an upcoming version. For now, continue using the local demo and see how family sync will work later.',
      exampleDataNote: 'The data shown are examples to demonstrate how the product works.',
      medsToday: 'Medications today',
      nextAppointment: 'Next appointment',
      tasksOverdue: 'Overdue tasks',
      profileCompletion: 'Profile completeness',
      nextStepsTitle: 'Next steps',
      nextStepsSubtitle: 'Suggestions to keep your family organised.',
      addMedication: 'Add medication',
      scheduleAppointment: 'Schedule appointment',
      createTask: 'Create task',
      uploadDocument: 'Upload document',
      createEmergencyCard: 'Create emergency card',
      viewFullPlan: 'View full plan',
      scheduleNewAppointment: 'Schedule new appointment',
      viewAllAppointments: 'View all appointments',
      noMedications: 'No medications registered yet.',
      noAppointments: 'No appointments scheduled yet.',
      noTasks: 'No tasks yet.',
      noDocuments: 'No documents yet.',
      noNotes: 'No care notes yet.',
    },
    pages: {
      profile: {
        title: 'Profile',
      },
      medications: {
        title: 'Medications',
        name: 'Medication name',
        dosage: 'Dosage',
        frequency: 'Frequency',
        schedule: 'Schedule',
        add: 'Add medication',
        empty: 'No medications registered yet.',
      },
      appointments: {
        title: 'Appointments',
        add: 'Schedule appointment',
        empty: 'No appointments scheduled yet.',
      },
      tasks: {
        title: 'Tasks',
        add: 'Create task',
        empty: 'No tasks yet.',
      },
      documents: {
        title: 'Documents',
        add: 'Upload document',
        empty: 'No documents yet.',
      },
      emergency: {
        title: 'Emergency',
        add: 'Create emergency card',
        empty: 'No emergency contacts yet.',
      },
      family: {
        title: 'Family',
        empty: 'No family members yet.',
      },
      notes: {
        title: 'Notes',
        empty: 'No care notes yet.',
      },
      settings: {
        title: 'Settings',
      },
      guide: {
        title: 'Quick guide',
      },
    },
    legal: {
      privacy: {
        summary_en:
          'Privacy summary: demo stores data locally in the browser. No medical advice. In emergencies call 112. Future secure cloud sync may be added; do not put highly sensitive medical data in the demo.',
      },
      terms: {
        summary_en:
          'Terms summary: This demo stores data locally. No warranties. Medical content is informational only. In emergencies call 112. Future cloud sync may be provided; no payments or uploads in demo.',
      },
    },
    auth: {
      titleSignIn: 'Sign in to CuidarJuntos',
      titleSignUp: 'Create account',
      titleReset: 'Reset password',
      email: 'Email',
      password: 'Password',
      submitSignIn: 'Sign in',
      submitSignUp: 'Create account',
      submitReset: 'Send instructions',
      continueDemo: 'Continue to demo',
      creating: 'Creating account...',
      signingIn: 'Signing in...',
      sending: 'Sending...',
    },
  },
} as const;

export type LangKey = keyof typeof translations;

export default translations;
