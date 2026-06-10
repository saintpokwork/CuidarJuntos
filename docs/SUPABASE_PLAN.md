# Plano de Integração com Supabase

## Estado atual

✅ **Schema SQL criado** em `supabase/schema.sql`
✅ **RLS policies definidas** para todas as tabelas
✅ **Auth trigger** para criar perfil automaticamente
✅ **Helper functions** para verificar permissões
✅ **Índices** e triggers de `updated_at`
✅ **Cloud sync** — frontend ligado ao Supabase para utilizadores autenticados
✅ **Supabase Storage SQL preparado** em `supabase/storage.sql`
⏳ Frontend upload de documentos — não implementado ainda

## Serviços planeados

- ✅ Auth (já ligado no frontend via `@supabase/supabase-js`)
- ✅ Base de dados Postgres (schema pronto, RLS ativo)
- ✅ Storage SQL preparado (bucket privado `care-documents`, RLS policies) — ver `supabase/storage.sql`
- ⏳ Frontend upload integration — fase seguinte
- ✅ Row Level Security (RLS) — implementado
- ⏳ Edge Functions — fase posterior

## Tabelas (criadas no schema)

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Perfis de utilizador sincronizados com `auth.users` |
| `care_profiles` | Perfis de cuidado (pai, mãe, avô, etc.) |
| `care_profile_members` | Membros da família com role (admin/family/caregiver/viewer) |
| `medications` | Medicamentos |
| `medication_logs` | Registo diário de tomas |
| `appointments` | Consultas e exames |
| `tasks` | Tarefas da família |
| `documents` | Documentos (sem storage ainda) |
| `care_notes` | Notas de cuidado |
| `emergency_contacts` | Contactos de emergência |

## Relações básicas

- Um utilizador pode pertencer a vários `care_profiles` (através de `care_profile_members`).
- Um `care_profile` pode ter vários membros da família.
- Cada `care_profile` gere medicamentos, consultas, tarefas, documentos, notas e contactos de emergência.
- Todas as child tables referenciam `care_profiles.id` com `on delete cascade`.

## Plano RLS (implementado)

- **Helper functions**: `is_care_profile_member()`, `is_care_profile_admin()`, `get_care_profile_role()` — todas `security definer` com `search_path = public`.
- `profiles`: cada utilizador só vê/altera o seu próprio perfil.
- `care_profiles`: membros ativos podem SELECT; authenticated users podem INSERT; admins podem UPDATE/DELETE.
- `care_profile_members`: members can SELECT (com subquery para evitar recursão); creator pode inserir próprio admin; admins gerem os restantes.
- **Child tables** (medications, appointments, tasks, documents, care_notes, emergency_contacts, medication_logs):
  - SELECT: qualquer membro ativo do care_profile.
  - INSERT/UPDATE: admin, family ou caregiver (não viewer).
  - DELETE: apenas admin.

## Plano de armazenamento

- ✅ **Bucket privado `care-documents`** — criado via SQL (`supabase/storage.sql`).
- ✅ **Políticas RLS** — ficheiros acessíveis apenas a membros ativos do care profile.
- ✅ **Helper function** `storage_care_profile_id()` — extrai o `care_profile_id` do path do ficheiro.
- ✅ **Restrições** — 5MB por ficheiro, apenas PDF/JPG/PNG.
- ⏳ **Frontend upload** — integração do frontend com Storage é a fase seguinte.
- Ver `docs/STORAGE_PLAN.md` para detalhes completos.

## Fluxo de autenticação

- ✅ Email/password (já implementado no frontend via `AuthContext`).
- ⏳ Magic link (fase posterior).
- ⏳ Login Google (fase posterior).
- ✅ Recuperação de palavra-passe (já implementada).

## Plano de migração (progresso)

1. ✅ **Ligar dashboard autenticado ao Supabase** — implementado via `CareDataContext` + `supabaseDataAdapter.ts`.
2. ✅ **Manter demo mode** — utilizadores não autenticados continuam a usar `localStorage`.
3. ⏳ **Importar dados da demo** — permitir que o utilizador migre os seus dados locais para a conta.
4. ✅ **Supabase Storage SQL preparado** — bucket, policies e helper function criados. Frontend upload é a fase seguinte.
5. ⏳ **Convites** — fluxo de convite para membros da família.
6. ⏳ **Tempo real** — Supabase Realtime para sincronização entre cuidadores.

## Notas de segurança

- Trata-se de dados sensíveis de saúde e família.
- Cumprir GDPR e garantias de privacidade desde o início.
- Evitar armazenar detalhes médicos desnecessários.
- Considerar encriptação em trânsito e em repouso.
- Solicitar consentimento claro antes de partilhar dados entre familiares.
- **Nunca expor a service_role key no frontend.**