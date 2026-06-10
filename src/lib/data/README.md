# Data Layer / Adaptadores

Esta pasta contém os primeiros componentes de uma camada de dados pensada para suportar a transição do MVP local para uma integração com Supabase.

- `types.ts` exporta/re-exporta os tipos principais do domínio de cuidado.
- `localStorageAdapter.ts` contém utilitários para carregar, guardar e exportar dados do `localStorage`.
- `supabaseAdapter.placeholder.ts` é um espaço reservado com stubs e TODOs para a futura integração com Supabase.

No estado atual, a aplicação continua a funcionar com o `CareDataContext` e os dados locais no navegador.
