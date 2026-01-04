# 🔄 Migração de State Management - React Query como Fonte Única de Verdade

## Resumo das Mudanças

A arquitetura de state management foi refatorada para seguir as melhores práticas:

- **React Query** = Fonte única de verdade para dados do servidor
- **Zustand** = Apenas estado de UI (modais, filtros, etc.)
- **Removida duplicação** de estado entre React Query e Zustand

---

## ✅ O que foi implementado

### 1. Zustand Store Refatorado (`src/main/store/useStore.ts`)

**Antes:**
- Gerenciava dados do servidor (user, transactions)
- Sincronizava com React Query (setUser, setTransactions)
- Métodos que apenas emitiam warnings

**Depois:**
- Gerencia APENAS estado de UI:
  - Modais (login, register, filter, edit, delete)
  - Filtros ativos
  - Modo de edição
- Não sincroniza mais com React Query
- Interface clara e focada

```typescript
// Novo uso
const { isFilterModalOpen, openFilterModal, closeFilterModal } = useUIStore()
```

### 2. Hooks Refatorados

#### `useUserData()`
- ✅ Removida sincronização com Zustand
- ✅ Retorna dados diretamente do React Query
- ✅ Fonte única de verdade para dados do usuário

```typescript
// Uso correto
const { user, isLoading, error } = useUserData()
```

#### `useTransactionsData()`
- ✅ Removida sincronização com Zustand
- ✅ Retorna transações diretamente do React Query
- ✅ Infinite query com paginação automática

```typescript
// Uso correto
const { transactions, isLoading, fetchNextPage, hasNextPage } = useTransactionsData()
```

#### Hooks de Mutations
- ✅ `useAddTransaction()` - Não usa mais Zustand
- ✅ `useUpdateTransaction()` - Não usa mais Zustand
- ✅ `useDeleteTransaction()` - Não usa mais Zustand
- ✅ Invalidam queries automaticamente após sucesso

### 3. Novo Hook Utilitário

#### `useTransactionCalculations()`
Substitui os métodos do Zustand:
- `getTotalIncome()` → `totalIncome`
- `getTotalExpense()` → `totalExpense`
- `getCategoryData()` → `categoryData`

```typescript
// Uso
const { transactions } = useTransactionsData()
const { totalIncome, totalExpense, categoryData } = useTransactionCalculations(transactions)
```

### 4. Componentes Atualizados

- ✅ `MainPage` - Usa React Query diretamente
- ✅ `CategoryChart` - Usa `useTransactionCalculations`
- ✅ `Header` - Usa `useUserData` diretamente
- ✅ `Statement` - Já recebia props, sem mudanças necessárias

---

## 📋 Guia de Migração para Novos Componentes

### Para buscar dados do servidor:

```typescript
// ✅ CORRETO - Usar React Query hooks
import { useUserData } from '../../hooks/useUserData'
import { useTransactionsData } from '../../hooks/useTransactionsData'

function MyComponent() {
  const { user, isLoading } = useUserData()
  const { transactions } = useTransactionsData()
  
  // ...
}
```

### Para estado de UI:

```typescript
// ✅ CORRETO - Usar Zustand para UI
import { useUIStore } from '../../store/useStore'

function MyComponent() {
  const { isFilterModalOpen, openFilterModal, closeFilterModal } = useUIStore()
  
  // ...
}
```

### Para cálculos derivados:

```typescript
// ✅ CORRETO - Usar hook utilitário
import { useTransactionsData } from '../../hooks/useTransactionsData'
import { useTransactionCalculations } from '../../hooks/useTransactionCalculations'

function MyComponent() {
  const { transactions } = useTransactionsData()
  const { totalIncome, categoryData } = useTransactionCalculations(transactions)
  
  // ...
}
```

### ❌ ERRADO - Não fazer mais:

```typescript
// ❌ ERRADO - Não sincronizar com Zustand
const { user, setUser } = useStore()
useEffect(() => {
  setUser(userFromQuery) // NÃO FAZER ISSO
}, [userFromQuery])

// ❌ ERRADO - Não buscar dados do Zustand
const { user, transactions } = useStore() // Dados devem vir do React Query
```

---

## 🎯 Benefícios da Nova Arquitetura

1. **Fonte única de verdade**: React Query gerencia todo estado do servidor
2. **Sem duplicação**: Dados não são sincronizados entre duas fontes
3. **Cache automático**: React Query gerencia cache, invalidação e refetch
4. **Separação clara**: UI state (Zustand) vs Server state (React Query)
5. **Melhor performance**: Menos re-renders desnecessários
6. **Mais fácil de testar**: Hooks isolados e testáveis

---

## 🔍 Verificação de Compatibilidade

O export `useStore` ainda existe para compatibilidade durante a migração, mas aponta para `useUIStore`. 

**Recomendação**: Migrar gradualmente para `useUIStore` explicitamente.

---

## 📝 Checklist para Novos Desenvolvedores

- [ ] Dados do servidor → Use hooks do React Query (`useUserData`, `useTransactionsData`)
- [ ] Estado de UI → Use `useUIStore` (Zustand)
- [ ] Cálculos derivados → Use `useTransactionCalculations`
- [ ] Mutations → Use hooks de mutation (`useAddTransaction`, etc.)
- [ ] Não sincronize dados do React Query com Zustand
- [ ] Não busque dados do servidor do Zustand

---

## 🚀 Próximos Passos (Opcional)

1. Remover export `useStore` após migração completa
2. Adicionar persistência de cache do React Query (opcional)
3. Considerar remover ViewModels se não forem mais necessários
4. Adicionar testes para os novos hooks

