# CuidarJuntos

Plataforma de organização familiar para cuidadores em Portugal. Ajuda famílias a gerir medicamentos, consultas, documentos, tarefas e contactos de emergência num só lugar.

**Estado atual:** 🚀 Em preparação para lançamento público em `https://www.cuidarjuntos.pt`. Supabase Auth, cloud sync, Storage, convites familiares e emails via Resend estão implementados. Documentação completa de lançamento em `docs/LAUNCH_TRACKER.md`.

## Stack tecnológica

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Estado com React Context, `localStorage` para demo e Supabase para contas
- Vercel Serverless Functions para emails transacionais da app

## Executar localmente

```bash
npm install
npm run dev
```

Abre em [http://localhost:5173](http://localhost:5173) por omissão.

## Build de produção

```bash
npm run build
```

## Rotas

| Rota | Página |
|------|--------|
| `/` | Landing page |
| `/entrar` | Página de autenticação |
| `/criar-conta` | Página de criação de conta |
| `/recuperar-password` | Página de recuperação de palavra-passe |
| `/atualizar-password` | Página de atualização de palavra-passe |
| `/aceitar-convite` | Aceitação de convite familiar |
| `/como-funciona` | Como usar o CuidarJuntos (público) |
| `/privacidade` | Política de privacidade |
| `/termos` | Termos de utilização |
| `/dashboard` | Painel principal |
| `/dashboard/guia` | Guia rápido (onboarding) |
| `/dashboard/perfil` | Perfil do familiar |
| `/dashboard/medicamentos` | Medicamentos |
| `/dashboard/consultas` | Consultas e exames |
| `/dashboard/tarefas` | Tarefas da família |
| `/dashboard/documentos` | Documentos |
| `/dashboard/emergencia` | Ficha de emergência |
| `/dashboard/familia` | Família e cuidadores |
| `/dashboard/notas` | Notas de cuidado |
| `/dashboard/definicoes` | Definições |
| `/dashboard/mais` | Mais opções (mobile) |

> O ficheiro de exemplo de ambiente está em `.env.example`. Nunca adicionar chaves reais ao repositório.

## Estrutura do projeto

```
src/
  pages/           # Páginas da aplicação
  components/      # Componentes partilhados
  context/         # Estado global (CareDataContext)
  data/            # Dados iniciais e tipos
  styles/          # CSS global (Tailwind)
design-reference/  # Exports originais do Stitch (referência)
```

## Funcionalidades ativas

- Autenticação e recuperação de palavra-passe com Supabase Auth
- Sincronização cloud para contas autenticadas
- Upload, download e remoção de documentos privados no Supabase Storage
- Convites familiares com token seguro e envio por email via Resend
- Modo demo local para experimentar sem conta
- Páginas legais, blog, sitemap e robots para lançamento

## Ainda fora desta fase

- Pagamentos / subscrições
- Notificações push
- Revisão jurídica profissional final

## Deploy na Vercel

1. Importar o repositório GitHub
2. Framework: Vite
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. O ficheiro `vercel.json` já inclui rewrites para SPA routing

## Contacto

contato@cuidarjuntos.pt
