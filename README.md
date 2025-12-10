# Postech Banking MVVM — Projeto Único Unificado

Este projeto unifica os antigos microfronts:

- `fiap_mf_home` → agora em `src/home`
- `fiap_mf_main` → agora em `src/main`

Não há mais `package.json`, `vite.config`, `tsconfig` etc. dentro de cada microfront: tudo foi centralizado na raiz.

## Estrutura

- `src/home` — componentes/páginas do antigo projeto Home
- `src/main` — componentes/páginas do antigo projeto Main
- `src/app/router.tsx` — define as rotas:
  - `/` → Home (`src/home/App`)
  - `/login` → Login (View MVVM)
  - `/main` → Main (área logada, protegida por `RequireAuth`)

## Scripts

- `npm run dev` — inicia a aplicação única (Vite)
- `npm run build` — build de produção
- `npm run preview` — preview do build
- `npm run lint` — lint

## Integração com MVVM + Firebase

- `src/viewmodels/auth/AuthViewModel.ts` — MVVM de autenticação com Firebase
- `src/hooks/useAuth.ts` — hook para usar o AuthViewModel nas Views
- `src/presentation/components/layout/RequireAuth.tsx` — guard para rotas protegidas
- `src/viewmodels/dashboard/DashboardViewModel.ts` + `src/domain/usecases/GetUserTransactions.ts` + `src/infra/repositories/TransactionRepository.ts` — exemplo completo de extrato
- `src/main/pages/TransactionsPage.tsx` — página de exemplo usando o ViewModel de Dashboard na área logada.

## Observações

Alguns imports absolutos ou aliases dos projetos originais podem precisar de ajuste (por exemplo, caminhos que assumiam `@/` ou root diferente). O núcleo agora está pronto como **um único projeto Vite + React + MVVM + Firebase**, cabendo a você apenas ajustar alguns detalhes de import/layout e avançar na migração das telas.