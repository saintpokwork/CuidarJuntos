# CuidarJuntos UX Audit High/Medium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the high and medium priority UX audit findings that materially improve first-run guidance, daily care workflows, emergency access, family coordination, mobile usability, feedback, and accessibility without redesigning the product.

**Architecture:** Keep the existing React/CRA structure, `CareDataContext` as the single data coordination layer, and Tailwind utility styling. Add small, focused components for onboarding wizard, notification centre, activity feed, and dashboard alerts instead of expanding page files unnecessarily. Preserve the English language toggle because the product targets Portuguese families and English-speaking residents in Portugal.

**Tech Stack:** React, TypeScript, React Router, Tailwind CSS, localStorage-backed demo data, existing Supabase adapter layer, Material Symbols, in-app Browser/Playwright QA.

---

## Scope Decisions

### Include Now

- High priority: first-run guidance, guided setup, nav hierarchy, medication today/check-off, dashboard upcoming appointments, emergency call links/public-card direction, activity feed, notification centre, mobile tap targets, async loading states, contrast/focus/empty-state improvements.
- Medium priority: family role clarity, appointment preparation/result notes, medication end date/unit selector, document expiry/dashboard warnings, emergency contact relationship labels, task assignment/recurrence UI, actionable errors, date locale.
- Low priority only when safe: task-oriented sub-labels, completed task section, toast duration/position, offline banner.

### Defer

- Google indexing and domain-specific SEO. The user is not buying a domain now, so indexing remains later.
- Removing the EN toggle. The audit recommendation is rejected; keep PT/EN.
- A real public no-login emergency URL backed by access-control/server routing. Plan adds opt-in UI and a print/share-ready card now; a production public URL needs a security design and route-level data access policy.
- A full calendar library. Use a simple list-first experience now; calendar grid can be later.

### Already Partly Covered

- Mobile bottom nav exists in `src/components/DashboardLayout.tsx`.
- Active nav state exists, but desktop hierarchy and active treatment can be strengthened.
- Document categories and expiry fields exist in `src/pages/Documentos.tsx`.
- Upload loading state exists in `src/pages/Documentos.tsx`.
- Persistent form labels mostly exist; this pass should verify and fix remaining gaps.

---

## File Structure

- Modify `src/data/initialData.ts`: extend domain types for medication dose tracking, medication end date/unit, appointment prep/result notes, task recurrence/completion metadata, and emergency contact relationship.
- Modify `src/lib/data/types.ts`: re-export updated types automatically from `initialData`.
- Modify `src/context/CareDataContext.tsx`: normalize loaded data with new fields, add activity events and notifications derived from care data, add update handlers for medication doses and new form fields.
- Modify `src/lib/data/localStorageAdapter.ts`: if it serializes typed data directly, ensure new fields persist.
- Modify `src/lib/data/supabaseDataAdapter.ts`: preserve compatibility by mapping optional new fields where safe, without changing database schema unless existing columns already support metadata.
- Create `src/components/FirstRunWizard.tsx`: skippable 3-step setup modal.
- Modify `src/components/OnboardingChecklist.tsx`: make it first-time dismissible and align steps with the audit: cared-for relative, first medication, invite family.
- Create `src/components/NotificationBell.tsx`: header bell with badge and dropdown.
- Create `src/components/ActivityFeed.tsx`: read-only recent activity list for dashboard.
- Create `src/components/DashboardAlerts.tsx`: missed dose, appointment tomorrow, overdue task, expiring document alerts.
- Modify `src/components/DashboardLayout.tsx`: group desktop nav into Daily/Reference/Account tiers, add notification bell, improve mobile tap targets, preserve language toggle.
- Modify `src/components/DashboardPageHeader.tsx`: support optional back/breadcrumb action for module pages.
- Modify `src/components/EmptyState.tsx`: add CTA support and richer accessible empty states.
- Modify `src/components/FeedbackMessage.tsx`: keep toast visible for 4 seconds, move to bottom-centre on mobile.
- Modify `src/pages/Dashboard.tsx`: add first-run wizard, primary invite action, upcoming appointments widget, activity feed, dashboard alerts.
- Modify `src/pages/Medicamentos.tsx`: add Today section, dose status controls, unit selector, optional end date.
- Modify `src/pages/Consultas.tsx`: add preparation notes and post-appointment result fields.
- Modify `src/pages/Documentos.tsx`: surface expiring-document warnings on page and feed dashboard warnings through context.
- Modify `src/pages/Emergencia.tsx`: make phone numbers `tel:` links, show relationship labels, add explicit public-card opt-in copy/UI without exposing data publicly yet.
- Modify `src/pages/Familia.tsx`: clarify cared-for relative vs caregiver/family member, make invite action primary.
- Modify `src/pages/Tarefas.tsx`: strengthen assignee display, add recurrence selector, add completed/history section.
- Modify `src/pages/Perfil.tsx`: ensure cared-for relative language is explicit.
- Modify `src/i18n/translations.ts`: add PT and EN strings for all new UI.
- Modify `src/styles/index.css`: contrast token update, focus-ring baseline, tap-target helpers, offline banner styles if needed.
- Modify `public/index.html`: improve no-JS fallback and keep `lang="pt-PT"`.

---

## Task 1: Data Model Normalization for UX Features

**Files:**
- Modify: `src/data/initialData.ts`
- Modify: `src/context/CareDataContext.tsx`
- Modify: `src/lib/data/types.ts`

- [ ] **Step 1: Extend types in `src/data/initialData.ts`**

Add optional fields so existing stored/demo data remains compatible:

```ts
export type MedicationDoseStatus = 'por_tomar' | 'tomado' | 'em_falta';
export type MedicationUnit = 'comprimidos' | 'mg' | 'ml' | 'gotas' | 'unidades';
export type TaskRecurrence = 'Nunca' | 'Diariamente' | 'Semanalmente' | 'Mensalmente';

export interface MedicationDose {
  id: string;
  horario: string;
  status: MedicationDoseStatus;
  markedBy?: string;
  markedAt?: string;
}
```

Extend existing interfaces:

```ts
export interface Medication {
  id: string;
  nome: string;
  dosagem: string;
  unidade?: MedicationUnit;
  horario: string;
  frequencia: string;
  responsavel: string;
  estado: MedicationEstado;
  instrucoes: string;
  tomadoHoje?: boolean;
  dataFim?: string;
  dosesHoje?: MedicationDose[];
}

export interface Appointment {
  id: string;
  tipo: string;
  dataHora: string;
  local: string;
  medico: string;
  responsavel: string;
  notas: string;
  notasPreConsulta?: string;
  resultadoConsulta?: string;
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
  repetir?: TaskRecurrence;
  concluidoEm?: string;
  concluidoPor?: string;
}

export interface EmergencyContact {
  id: string;
  nome: string;
  funcao: string;
  relacao?: string;
  telefone: string;
  avatar: string;
}
```

- [ ] **Step 2: Normalize loaded data in `CareDataContext.tsx`**

Add helper functions near `loadFromStorage`:

```ts
const normalizeMedication = (m: Medication): Medication => ({
  ...m,
  unidade: m.unidade || 'mg',
  dataFim: m.dataFim || '',
  tomadoHoje: m.tomadoHoje ?? false,
  dosesHoje: m.dosesHoje?.length
    ? m.dosesHoje
    : m.horario
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((horario) => ({
          id: `${m.id}-${horario}`,
          horario,
          status: m.tomadoHoje ? 'tomado' : 'por_tomar',
        })),
});

const normalizeTask = (task: Task): Task => ({
  ...task,
  repetir: task.repetir || 'Nunca',
  concluidoEm: task.concluidoEm || '',
  concluidoPor: task.concluidoPor || '',
});
```

Then replace medication/task normalization in `loadFromStorage` with:

```ts
medications: (parsed.medications ?? initial.medications).map(normalizeMedication),
tasks: (parsed.tasks ?? initial.tasks).map(normalizeTask),
```

- [ ] **Step 3: Verify typecheck/build**

Run:

```bash
npm run build
```

Expected: `Compiled successfully.`

---

## Task 2: First-Run Wizard and Dismissible Checklist

**Files:**
- Create: `src/components/FirstRunWizard.tsx`
- Modify: `src/components/OnboardingChecklist.tsx`
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/i18n/translations.ts`

- [ ] **Step 1: Create a skippable setup wizard**

Create `src/components/FirstRunWizard.tsx` with localStorage dismissal:

```tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const STORAGE_KEY = 'cuidarjuntos-first-run-wizard-dismissed';

const FirstRunWizard: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(localStorage.getItem(STORAGE_KEY) !== 'true');
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  if (!open) return null;

  const steps = [
    { icon: 'person', title: t('firstRun.profileTitle'), text: t('firstRun.profileText'), path: '/dashboard/perfil' },
    { icon: 'medication', title: t('firstRun.medicationTitle'), text: t('firstRun.medicationText'), path: '/dashboard/medicamentos' },
    { icon: 'group_add', title: t('firstRun.familyTitle'), text: t('firstRun.familyText'), path: '/dashboard/familia' },
  ];

  return (
    <div className="fixed inset-0 z-[90] bg-cj-terra/40 px-4 py-6 flex items-center justify-center">
      <section className="w-full max-w-3xl rounded-[28px] bg-cj-branco p-6 md:p-8 shadow-2xl border border-cj-border">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-label-sm font-bold uppercase tracking-[0.24em] text-primary">{t('firstRun.eyebrow')}</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">{t('firstRun.title')}</h2>
            <p className="text-body-md text-on-surface-variant mt-2">{t('firstRun.subtitle')}</p>
          </div>
          <button type="button" onClick={dismiss} className="min-h-11 min-w-11 rounded-full bg-surface-container-high text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Link key={step.path} to={step.path} onClick={dismiss} className="rounded-2xl border border-cj-border bg-white/70 p-5 hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl">{step.icon}</span>
              <p className="text-label-sm text-cj-terra mt-4">{index + 1}/3</p>
              <h3 className="text-headline-sm font-bold text-on-surface">{step.title}</h3>
              <p className="text-body-sm text-on-surface-variant mt-2">{step.text}</p>
            </Link>
          ))}
        </div>
        <button type="button" onClick={dismiss} className="mt-6 w-full md:w-auto min-h-11 rounded-full border border-primary px-5 text-primary font-bold">
          {t('firstRun.skip')}
        </button>
      </section>
    </div>
  );
};

export default FirstRunWizard;
```

- [ ] **Step 2: Add the wizard to dashboard**

In `src/pages/Dashboard.tsx`, import and render above `OnboardingChecklist`:

```tsx
import FirstRunWizard from '../components/FirstRunWizard';
```

```tsx
<FirstRunWizard />
<OnboardingChecklist />
```

- [ ] **Step 3: Make checklist dismissible and focused**

Update `OnboardingChecklist` to use localStorage key `cuidarjuntos-onboarding-checklist-dismissed`, show only three core steps, and add a close button:

```ts
const steps = [
  { id: 'profile', path: '/dashboard/perfil', done: data.careProfile.nome !== '' && data.careProfile.nome !== 'Maria Fernandes' },
  { id: 'medications', path: '/dashboard/medicamentos', done: data.medications.filter((m) => m.estado === 'Ativo').length > 0 },
  { id: 'family', path: '/dashboard/familia', done: data.familyMembers.length > 0 },
];
```

- [ ] **Step 4: Add PT/EN translations**

Add `firstRun.*` and update `onboarding.steps.profile`, `onboarding.steps.medications`, `onboarding.steps.family` in `src/i18n/translations.ts`.

- [ ] **Step 5: Browser QA**

Run:

```bash
npm start
```

Verify:
- First dashboard load shows wizard.
- Close button hides it.
- Checklist still appears unless dismissed.
- EN toggle still works.

---

## Task 3: Dashboard Alerts, Activity Feed, and Notifications

**Files:**
- Create: `src/components/DashboardAlerts.tsx`
- Create: `src/components/ActivityFeed.tsx`
- Create: `src/components/NotificationBell.tsx`
- Modify: `src/context/CareDataContext.tsx`
- Modify: `src/components/DashboardLayout.tsx`
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/i18n/translations.ts`

- [ ] **Step 1: Add derived notification/activity types**

In `CareDataContext.tsx`:

```ts
interface CareNotification {
  id: string;
  type: 'missedDose' | 'appointmentTomorrow' | 'taskOverdue' | 'documentExpiring';
  title: string;
  body: string;
  path: string;
}

interface ActivityEvent {
  id: string;
  icon: string;
  text: string;
  when: string;
  path: string;
}
```

Add to `CareDataContextValue`:

```ts
notifications: CareNotification[];
activityEvents: ActivityEvent[];
```

- [ ] **Step 2: Derive notifications from existing data**

Before the context `value`, derive:

```ts
const notifications: CareNotification[] = [
  ...data.medications
    .filter((m) => m.estado === 'Em falta' || m.dosesHoje?.some((dose) => dose.status === 'em_falta'))
    .map((m) => ({
      id: `missed-${m.id}`,
      type: 'missedDose' as const,
      title: tt('notifications.missedDoseTitle'),
      body: `${m.nome} · ${m.horario}`,
      path: '/dashboard/medicamentos',
    })),
  ...data.tasks
    .filter((task) => task.status !== 'concluido' && task.prioridade === 'Urgente')
    .map((task) => ({
      id: `task-${task.id}`,
      type: 'taskOverdue' as const,
      title: tt('notifications.taskOverdueTitle'),
      body: task.titulo,
      path: '/dashboard/tarefas',
    })),
  ...data.documents
    .filter((doc) => doc.dataValidade)
    .slice(0, 2)
    .map((doc) => ({
      id: `doc-${doc.id}`,
      type: 'documentExpiring' as const,
      title: tt('notifications.documentExpiringTitle'),
      body: doc.titulo,
      path: '/dashboard/documentos',
    })),
];
```

- [ ] **Step 3: Derive activity feed**

```ts
const activityEvents: ActivityEvent[] = [
  ...data.medications.filter((m) => m.tomadoHoje).map((m) => ({
    id: `activity-med-${m.id}`,
    icon: 'check_circle',
    text: tt('activity.medicationTaken').replace('{name}', m.nome).replace('{person}', m.responsavel || caregiver.nome),
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
].slice(0, 7);
```

- [ ] **Step 4: Create `NotificationBell`**

Render a `button` with `min-h-11 min-w-11`, badge count, and dropdown links to notification paths. Place it in desktop and mobile headers next to the language toggle.

- [ ] **Step 5: Create `ActivityFeed` and `DashboardAlerts`**

`ActivityFeed` renders read-only events. `DashboardAlerts` renders the top three notifications with direct links.

- [ ] **Step 6: Add to dashboard**

In `Dashboard.tsx`, render alerts near the top and activity feed in the main grid.

- [ ] **Step 7: Verify**

Run:

```bash
npm run build
```

Browser QA:
- Badge appears when notifications exist.
- Dropdown opens and links navigate.
- Activity feed renders without empty layout gaps.

---

## Task 4: Medication Today Workflow

**Files:**
- Modify: `src/context/CareDataContext.tsx`
- Modify: `src/pages/Medicamentos.tsx`
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/i18n/translations.ts`

- [ ] **Step 1: Add dose update handler**

Add to `CareDataContextValue`:

```ts
updateMedicationDoseStatus: (medicationId: string, doseId: string, status: MedicationDoseStatus) => void;
```

Implementation:

```ts
const updateMedicationDoseStatus = useCallback((medicationId: string, doseId: string, status: MedicationDoseStatus) => {
  const markedAt = formatNow();
  setData((prev) => ({
    ...prev,
    medications: prev.medications.map((med) => {
      if (med.id !== medicationId) return med;
      const dosesHoje = (med.dosesHoje || []).map((dose) =>
        dose.id === doseId ? { ...dose, status, markedAt, markedBy: caregiver.nome } : dose,
      );
      const tomadoHoje = dosesHoje.length > 0 && dosesHoje.every((dose) => dose.status === 'tomado');
      return { ...med, dosesHoje, tomadoHoje };
    }),
  }));
  showFeedback(status === 'tomado' ? 'feedback.medicationTaken' : 'feedback.medicationUntaken');
}, [showFeedback]);
```

- [ ] **Step 2: Add medication form fields**

In `Medicamentos.tsx`, add state:

```ts
const [unidade, setUnidade] = useState<MedicationUnit>('mg');
const [dataFim, setDataFim] = useState('');
```

Add unit selector next to dosage and optional end date field. Submit:

```ts
addMedication({ nome, dosagem, unidade, horario, frequencia, responsavel, dataFim });
```

- [ ] **Step 3: Add Today strip**

At top of `Medicamentos.tsx`, render all `dosesHoje` from active medications with three states:
- `Por tomar`
- `Tomado`
- `Em falta`

Each dose card must have a 44px minimum button to mark taken.

- [ ] **Step 4: Improve dashboard medication card**

Replace the passive checkbox with a real button calling `updateMedicationDoseStatus` or `updateMedicationTaken`.

- [ ] **Step 5: Verify**

Browser QA:
- Add medication with unit/end date.
- Mark today dose taken.
- Dashboard summary updates.
- Mobile tap targets are at least 44px high.

---

## Task 5: Appointments Preparation and Results

**Files:**
- Modify: `src/data/initialData.ts`
- Modify: `src/context/CareDataContext.tsx`
- Modify: `src/pages/Consultas.tsx`
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/i18n/translations.ts`

- [ ] **Step 1: Use existing optional fields**

Ensure `addAppointment` accepts:

```ts
notasPreConsulta?: string;
resultadoConsulta?: string;
```

Store them in demo mode and pass through cloud mode only if adapter supports those fields. If the database schema does not support them, keep them demo/local-only and do not change DB schema in this task.

- [ ] **Step 2: Add form textareas**

In `Consultas.tsx`, add:

```tsx
<label>{t('pages.appointments.preVisitNotes')}</label>
<textarea value={notasPreConsulta} onChange={(e) => setNotasPreConsulta(e.target.value)} />

<label>{t('pages.appointments.resultNotes')}</label>
<textarea value={resultadoConsulta} onChange={(e) => setResultadoConsulta(e.target.value)} />
```

- [ ] **Step 3: Show post-appointment prompt**

For each appointment card, if parsed date is before today and `resultadoConsulta` is empty, show:

```tsx
<Link to="/dashboard/consultas" className="...">
  {t('pages.appointments.addResultPrompt')}
</Link>
```

- [ ] **Step 4: Dashboard upcoming appointments**

Dashboard already shows next appointment. Replace with a compact “next 2 appointments this week” card using `appointments.slice(0, 2)` and include prep notes indicator.

- [ ] **Step 5: Verify**

Run build and browser QA on `/dashboard/consultas` desktop/mobile.

---

## Task 6: Emergency Contacts and Emergency Card

**Files:**
- Modify: `src/data/initialData.ts`
- Modify: `src/pages/Emergencia.tsx`
- Modify: `src/i18n/translations.ts`

- [ ] **Step 1: Add relationship labels**

Use `contact.relacao || contact.funcao` on the emergency card and seed mock contacts with values such as `Filho/a`, `Médico de família`, `Farmácia`.

- [ ] **Step 2: Make phone numbers one-tap call links**

Replace plain phone text with:

```tsx
<a href={`tel:${contact.telefone.replace(/\s+/g, '')}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-on-primary font-bold">
  <span className="material-symbols-outlined">call</span>
  {t('pages.emergency.call')} {contact.telefone}
</a>
```

- [ ] **Step 3: Add opt-in public-card section**

Add a non-public, ready-state setting panel:

```tsx
<section className="print:hidden rounded-2xl border border-cj-border bg-cj-verde-pale/30 p-5">
  <h3>{t('pages.emergency.publicCardTitle')}</h3>
  <p>{t('pages.emergency.publicCardText')}</p>
  <button type="button" className="min-h-11 rounded-full bg-primary px-5 text-on-primary font-bold">
    {t('pages.emergency.preparePublicCard')}
  </button>
</section>
```

The copy must not say “coming soon”. It should say the user can prepare what the read-only card contains, while public sharing remains an explicit opt-in action.

- [ ] **Step 4: Verify**

Mobile browser QA:
- Tap targets are large.
- `tel:` href is present.
- Print/share buttons still render.

---

## Task 7: Family Role Clarity and Invite Prominence

**Files:**
- Modify: `src/pages/Familia.tsx`
- Modify: `src/pages/Perfil.tsx`
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/i18n/translations.ts`

- [ ] **Step 1: Clarify cared-for relative**

In `Perfil.tsx`, title/subtitle must use “Familiar cuidado” / “Person receiving care” so users do not confuse it with invited family members.

- [ ] **Step 2: Clarify invite form**

In `Familia.tsx`, update heading/copy:
- PT: “Convidar cuidador ou familiar”
- EN: “Invite caregiver or family member”

Add a short helper under relationship:
- PT: “Ex.: filha, irmão, vizinha, cuidador profissional”
- EN: “Example: daughter, brother, neighbour, professional caregiver”

- [ ] **Step 3: Surface primary dashboard invite action**

In `Dashboard.tsx`, add `/dashboard/familia` button next to the existing quick actions:

```tsx
<Link to="/dashboard/familia" className="... bg-primary text-on-primary ...">
  <span className="material-symbols-outlined">group_add</span>
  <span>{t('dashboard.inviteFamily')}</span>
</Link>
```

- [ ] **Step 4: Verify**

Browser QA:
- Invite action visible on desktop and mobile dashboard.
- Family form copy distinguishes cared-for person from caregivers.

---

## Task 8: Tasks Assignment, Recurrence, and Completed History

**Files:**
- Modify: `src/context/CareDataContext.tsx`
- Modify: `src/pages/Tarefas.tsx`
- Modify: `src/i18n/translations.ts`

- [ ] **Step 1: Store recurrence and completion metadata**

Update `addTask` to store `repetir`.

Update `updateTaskStatus` so when status becomes `concluido`, it sets:

```ts
concluidoEm: formatNow(),
concluidoPor: task.responsavel || caregiver.nome,
```

- [ ] **Step 2: Add recurrence selector**

In task form:

```tsx
<select value={repetir} onChange={(e) => setRepetir(e.target.value as TaskRecurrence)}>
  <option value="Nunca">{t('pages.tasks.recurrence.never')}</option>
  <option value="Diariamente">{t('pages.tasks.recurrence.daily')}</option>
  <option value="Semanalmente">{t('pages.tasks.recurrence.weekly')}</option>
  <option value="Mensalmente">{t('pages.tasks.recurrence.monthly')}</option>
</select>
```

- [ ] **Step 3: Strengthen assignee display**

On task cards, show an initial avatar beside `task.responsavel`:

```tsx
<span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary text-label-sm font-bold">
  {task.responsavel.charAt(0).toUpperCase()}
</span>
```

- [ ] **Step 4: Add completed section**

Keep the existing `concluido` column on desktop, but on mobile add a collapsed “Concluídas” section below active tasks with completion date/person.

- [ ] **Step 5: Verify**

Browser QA:
- Add task with assignee and recurrence.
- Move task to completed.
- Completion metadata appears.

---

## Task 9: Empty States, Errors, Feedback, and Loading

**Files:**
- Modify: `src/components/EmptyState.tsx`
- Modify: `src/components/FeedbackMessage.tsx`
- Modify: `src/context/CareDataContext.tsx`
- Modify: module pages using `EmptyState`
- Modify: `src/i18n/translations.ts`

- [ ] **Step 1: Add CTA support to EmptyState**

Update props:

```ts
interface EmptyStateProps {
  message: string;
  icon?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}
```

If `actionTo` exists, render a `Link`. If `onAction` exists, render a `button`. Both must be `min-h-11`.

- [ ] **Step 2: Replace passive empty states**

Examples:

```tsx
<EmptyState
  message={t('pages.medications.empty')}
  icon="medication"
  actionLabel={t('pages.medications.addFirst')}
  onAction={() => document.getElementById('medication-form')?.scrollIntoView({ behavior: 'smooth' })}
/>
```

- [ ] **Step 3: Make feedback last 4 seconds**

In `CareDataContext.tsx`:

```ts
setTimeout(() => setFeedback(null), 4000);
```

In `FeedbackMessage.tsx`, use mobile bottom positioning:

```tsx
className="fixed bottom-24 md:bottom-auto md:top-4 left-1/2 ..."
```

- [ ] **Step 4: Make errors actionable**

Replace generic `t('global.error')` in user-facing form failures with messages that include retry guidance:
- PT: “Não foi possível guardar. Verifique a ligação e tente novamente.”
- EN: “Could not save. Check your connection and try again.”

- [ ] **Step 5: Verify**

Trigger validation errors and successful saves. Confirm errors are actionable and toast is visible on mobile above bottom nav.

---

## Task 10: Accessibility, Tap Targets, Locale, and No-JS Fallback

**Files:**
- Modify: `src/styles/index.css`
- Modify: `public/index.html`
- Modify: page forms where controls are below 44px

- [ ] **Step 1: Improve muted contrast**

Change:

```css
--cj-cinza: #5A534E;
```

- [ ] **Step 2: Add baseline focus ring**

Keep current input focus and add:

```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--cj-verde);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Enforce tap target helpers**

Add:

```css
button,
a,
input,
select,
textarea {
  touch-action: manipulation;
}

input[type='checkbox'] {
  min-width: 20px;
  min-height: 20px;
}
```

Then audit module forms/buttons and replace `h-10`, `py-2`, `p-1` interactive controls with at least `min-h-11` where practical.

- [ ] **Step 4: Ensure Portuguese locale baseline**

Keep:

```html
<html lang="pt-PT">
```

For date rendering, use `toLocaleDateString('pt-PT')` or `en-GB` when language is English. Native date inputs cannot force DD/MM/YYYY in every browser, so label/helper copy must show format expectations where needed.

- [ ] **Step 5: Improve no-JS fallback**

Replace the current noscript with:

```html
<noscript>
  <div style="max-width: 640px; margin: 48px auto; padding: 24px; font-family: Arial, sans-serif; color: #3C2E28;">
    <h1>CuidarJuntos precisa de JavaScript para funcionar</h1>
    <p>Esta aplicação organiza dados de cuidado no seu navegador e precisa de JavaScript ativo para carregar.</p>
    <p>Se precisar de ajuda, contacte: contato@cuidarjuntos.pt</p>
  </div>
</noscript>
```

- [ ] **Step 6: Verify**

Run:

```bash
npm run build
```

Browser QA:
- Keyboard tabbing shows visible focus.
- Mobile form buttons are thumb-sized.
- No horizontal overflow.

---

## Final Verification

- [ ] Run launch wording scan:

```bash
rg -n "em breve|coming soon|vers[aã]o futura|future|beta|not available|demo only" src public --glob '!build' --glob '!*.md'
```

Expected: no user-facing matches. Internal README/stub matches require review before leaving them.

- [ ] Run production build:

```bash
npm run build
```

Expected: `Compiled successfully.`

- [ ] Run browser QA against dev server:

```bash
npm start
```

Verify routes:
- `/dashboard`
- `/dashboard/medicamentos`
- `/dashboard/consultas`
- `/dashboard/tarefas`
- `/dashboard/documentos`
- `/dashboard/emergencia`
- `/dashboard/familia`

Desktop viewport:
- 1280 × 900

Mobile viewport:
- 390 × 844

Checklist:
- No blank pages.
- No framework overlays.
- No console errors; React Router v7 warnings are acceptable existing warnings.
- No horizontal overflow.
- EN/PT toggle still works.
- Bottom nav remains usable.
- Notification dropdown opens.
- First-run wizard can be dismissed.
- Medication dose check-off changes visible state.
- Emergency phone links use `tel:`.

---

## Coverage Review

- High priorities covered: first-run guidance, progressive onboarding, nav hierarchy, medication today/check-off, appointments dashboard widget, emergency call/public-card preparation, activity feed, notifications, mobile tap targets, async/loading feedback, contrast/focus/empty states.
- Medium priorities covered: family role clarity, appointment prep/results, medication unit/end date, document expiry warnings, emergency role labels, task assignment/recurrence, actionable errors, locale handling.
- Low priorities included where safe: completed task history, toast duration/position, no-JS fallback.
- Deferred: indexing/domain SEO, removal of EN toggle, full public emergency URL backend, full calendar view.
