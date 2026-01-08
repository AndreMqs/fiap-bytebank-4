import { create } from 'zustand'


export interface UIStoreState {

  isLoginModalOpen: boolean
  isRegisterModalOpen: boolean
  isFilterModalOpen: boolean
  isEditTransactionModalOpen: boolean
  isDeleteTransactionModalOpen: boolean
  
  activeFilters: {
    category: string
    dateFrom: string
    dateTo: string
    valueMin: string
    valueMax: string
    type: string
  }
  
  isEditingMode: boolean

  openLoginModal: () => void
  closeLoginModal: () => void
  openRegisterModal: () => void
  closeRegisterModal: () => void
  openFilterModal: () => void
  closeFilterModal: () => void
  openEditTransactionModal: () => void
  closeEditTransactionModal: () => void
  openDeleteTransactionModal: () => void
  closeDeleteTransactionModal: () => void
  
  setActiveFilters: (filters: UIStoreState['activeFilters']) => void
  clearFilters: () => void
  
  setEditingMode: (isEditing: boolean) => void
}

const initialFilters = {
  category: '',
  dateFrom: '',
  dateTo: '',
  valueMin: '',
  valueMax: '',
  type: '',
}

export const useUIStore = create<UIStoreState>((set) => ({

  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  isFilterModalOpen: false,
  isEditTransactionModalOpen: false,
  isDeleteTransactionModalOpen: false,
  activeFilters: initialFilters,
  isEditingMode: false,
  
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openRegisterModal: () => set({ isRegisterModalOpen: true }),
  closeRegisterModal: () => set({ isRegisterModalOpen: false }),
  openFilterModal: () => set({ isFilterModalOpen: true }),
  closeFilterModal: () => set({ isFilterModalOpen: false }),
  openEditTransactionModal: () => set({ isEditTransactionModalOpen: true }),
  closeEditTransactionModal: () => set({ isEditTransactionModalOpen: false }),
  openDeleteTransactionModal: () => set({ isDeleteTransactionModalOpen: true }),
  closeDeleteTransactionModal: () => set({ isDeleteTransactionModalOpen: false }),
  
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  clearFilters: () => set({ activeFilters: initialFilters }),
  
  setEditingMode: (isEditing) => set({ isEditingMode: isEditing }),
}))

export const useStore = useUIStore
