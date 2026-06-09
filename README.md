# CuidarJuntos

Plataforma de organização familiar para cuidadores em Portugal. Ajuda famílias a gerir medicamentos, consultas, documentos, tarefas e contactos de emergência num só lugar.

**Estado atual:** MVP demo com dados guardados localmente no navegador (`localStorage`).

## Stack tecnológica

- React 18 + TypeScript
- Create React App (CRACO)
- Tailwind CSS
- React Router v6
- Estado local com React Context + `localStorage`

## Executar localmente

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## Build de produção

```bash
npm run build
```

## Rotas

| Rota | Página |
|------|--------|
| `/` | Landing page |
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

## O que ainda não está incluído

- Autenticação / contas de utilizador
- Supabase ou base de dados na cloud
- Upload real de ficheiros
- Pagamentos / subscrições
- Notificações push ou por email
- Sincronização entre dispositivos

## Deploy na Vercel

1. Importar o repositório GitHub
2. Framework: Create React App
3. **Build command:** `npm run build`
4. **Output directory:** `build`
5. O ficheiro `vercel.json` já inclui rewrites para SPA routing

## Contacto

contato@cuidarjuntos.pt
