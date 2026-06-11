# Data Layer / Adaptadores

Esta pasta contém os componentes da camada de dados usada pela aplicação e os adaptadores preparados para persistência local e Supabase.

- `types.ts` exporta/re-exporta os tipos principais do domínio de cuidado.
- `localStorageAdapter.ts` contém utilitários para carregar, guardar e exportar dados do `localStorage`.
- `supabaseAdapter.placeholder.ts` mantém stubs isolados para ambientes onde o cliente Supabase não deve ser carregado.

O `CareDataContext` coordena os modos de armazenamento disponíveis e mantém a interface consistente entre dados locais e dados remotos.
