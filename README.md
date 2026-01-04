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

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Chave de criptografia para armazenamento seguro (OBRIGATÓRIA)
# Use uma chave forte e única. Em produção, nunca compartilhe esta chave.
VITE_ENCRYPTION_KEY=your-secret-encryption-key-here

# Firebase (opcional - se não configurado, o Firebase será desabilitado)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Desabilitar Firebase (opcional)
# VITE_FIREBASE_DISABLED=true
```

**⚠️ IMPORTANTE:** A variável `VITE_ENCRYPTION_KEY` é **obrigatória** em produção. Sem ela, a aplicação não funcionará corretamente. Use uma chave forte e única (mínimo 32 caracteres recomendado).

## Integração com MVVM + Firebase

- `src/viewmodels/auth/AuthViewModel.ts` — MVVM de autenticação com Firebase
- `src/hooks/useAuth.ts` — hook para usar o AuthViewModel nas Views
- `src/presentation/components/layout/RequireAuth.tsx` — guard para rotas protegidas
- `src/viewmodels/dashboard/DashboardViewModel.ts` + `src/domain/usecases/GetUserTransactions.ts` + `src/infra/repositories/TransactionRepository.ts` — exemplo completo de extrato
- `src/main/pages/TransactionsPage.tsx` — página de exemplo usando o ViewModel de Dashboard na área logada.

## Índices do Firestore

O projeto requer um índice composto no Firestore para consultar transações por `userId` e ordenar por `date`. 

**Opção 1: Criar via Console (Recomendado)**
1. Quando você executar a aplicação e tentar visualizar transações, o Firebase mostrará um erro com um link direto
2. Clique no link fornecido no erro do console do navegador
3. O Firebase Console abrirá automaticamente com o índice pré-configurado
4. Clique em "Criar índice" e aguarde alguns minutos até que o índice seja criado

**Opção 2: Deploy via Firebase CLI**
Se você tiver o Firebase CLI instalado:
```bash
firebase deploy --only firestore:indexes
```

O arquivo `firestore.indexes.json` já está configurado na raiz do projeto com o índice necessário.

## Observações

Alguns imports absolutos ou aliases dos projetos originais podem precisar de ajuste (por exemplo, caminhos que assumiam `@/` ou root diferente). O núcleo agora está pronto como **um único projeto Vite + React + MVVM + Firebase**, cabendo a você apenas ajustar alguns detalhes de import/layout e avançar na migração das telas.