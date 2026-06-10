# Plano de Integração com Supabase

## Serviços planeados

- Auth
- Base de dados Postgres
- Storage (ficheiros privados)
- Row Level Security (RLS)
- Edge Functions (fase posterior)

## Tabelas previstas

- `profiles`
- `care_profiles`
- `care_profile_members`
- `medications`
- `medication_logs`
- `appointments`
- `tasks`
- `documents`
- `care_notes`
- `emergency_contacts`

## Relações básicas

- Um utilizador pode pertencer a vários `care_profiles`.
- Um `care_profile` pode ter vários membros da família.
- Cada `care_profile` gere medicamentos, consultas, tarefas, documentos, notas e contactos de emergência.

## Plano RLS

- Os utilizadores só podem ler e escrever `care_profiles` onde são membros.
- Administradores podem convidar e remover membros.
- Cuidadores têm acesso limitado a registos e podem actualizar apenas certos campos.
- Visualizadores apenas podem ler informação relevante.

## Plano de armazenamento

- Documentos são guardados em buckets privados.
- Os ficheiros são organizados por `care_profile_id`.
- O acesso é controlado por RLS ou URLs assinados.

## Fluxo de autenticação

- Email/password primeiro.
- Magic link opcional numa fase posterior.
- Login Google opcional numa fase posterior.
- Recuperação de palavra-passe.

## Plano de migração

- Os dados do MVP local podem ser exportados/importados mais tarde.
- Não é necessário migração automática para esta fase inicial.
- O foco é permitir que o utilizador continue a usar a demo e, no futuro, importe os dados para a conta.

## Notas de segurança

- Trata-se de dados sensíveis de saúde e família.
- Cumprir GDPR e garantias de privacidade desde o início.
- Evitar armazenar detalhes médicos desnecessários.
- Considerar encriptação em trânsito e em repouso.
- Solicitar consentimento claro antes de partilhar dados entre familiares.
