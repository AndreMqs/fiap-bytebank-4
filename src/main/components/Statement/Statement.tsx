import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

import Edit from "../../images/Edit.svg";
import Filter from "../../images/Filter.svg";
import StatementList from './StatementList/StatementList';
import { ComponentLoadingFallback } from '../../../presentation/components/layout/LoadingFallback';
import { useUpdateTransaction } from '../../hooks/useUpdateTransaction';
import { useDeleteTransaction } from '../../hooks/useDeleteTransaction';
import { useTransactionsData } from '../../hooks/useTransactionsData';
import { getStatementByMonth } from '../../utils/statementUtils';
import { filterTransactions, getActiveFiltersCount } from '../../utils/filterUtils';
import { StatementProps, FilterCriteria } from '../../types/statement';
import { Transaction } from '../../types/api';

const FilterModal = lazy(() => import('./FilterModal/FilterModal'));
const EditTransactionModal = lazy(() => import('./EditTransactionModal/EditTransactionModal'));
const DeleteTransactionModal = lazy(() => import('./DeleteTransactionModal/DeleteTransactionModal'));

import styles from "./Statement.module.scss"

export default function Statement(props: StatementProps) {
  const { transactions, deleteTransaction } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({
    category: '',
    dateFrom: '',
    dateTo: '',
    valueMin: '',
    valueMax: '',
    type: ''
  });
  const { updateTransactionAsync, isLoading: isUpdating } = useUpdateTransaction();
  const { deleteTransactionAsync, isLoading: isDeleting } = useDeleteTransaction();

  const { 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage
  } = useTransactionsData();

  // Memoizar filteredTransactions para evitar recálculos desnecessários
  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, activeFilters);
  }, [transactions, activeFilters]);

  const activeFiltersCount = useMemo(() => {
    return getActiveFiltersCount(activeFilters);
  }, [activeFilters]);

  const hasActiveFilters = activeFiltersCount > 0;
  const [displayedTransactions, setDisplayedTransactions] = useState<typeof transactions>([]);
  const [frontendLoading, setFrontendLoading] = useState(false);
  const [frontendHasMore, setFrontendHasMore] = useState(true);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    if (hasActiveFilters) {
      const initialItems = filteredTransactions.slice(0, ITEMS_PER_PAGE);
      setDisplayedTransactions(initialItems);
      setFrontendHasMore(filteredTransactions.length > ITEMS_PER_PAGE);
    } else {
      setDisplayedTransactions(filteredTransactions);
      setFrontendHasMore(false);
    }
  }, [filteredTransactions, hasActiveFilters]);

  const handleLoadMore = async () => {
    if (hasActiveFilters) {
      if (frontendLoading || !frontendHasMore) return;

      setFrontendLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const currentLength = displayedTransactions.length;
      const newItems = filteredTransactions.slice(currentLength, currentLength + ITEMS_PER_PAGE);
      
      setDisplayedTransactions(prev => [...prev, ...newItems]);
      setFrontendHasMore(currentLength + ITEMS_PER_PAGE < filteredTransactions.length);
      setFrontendLoading(false);
    } else {
      if (hasNextPage && !isFetchingNextPage) {
        try {
          await fetchNextPage();
        } catch (error) {
          console.error('Erro ao carregar mais transações:', error);
        }
      }
    }
  };

  const handleApplyFilters = (filters: FilterCriteria) => {
    setActiveFilters(filters);
  };

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseEditModal = () => {
    setEditingTransaction(null);
  };

  const handleSaveTransaction = async (transactionId: number, data: {
    type: 'income' | 'expense';
    category: string;
    value: string;
    date: string;
  }) => {
    try {
      const transactionData = {
        type: data.type,
        category: data.category,
        value: data.value,
        date: data.date,
      };

      await updateTransactionAsync({ 
        transactionId, 
        data: transactionData 
      });
      
      setEditingTransaction(null);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const handleCloseDeleteModal = () => {
    setDeletingTransaction(null);
  };

  const handleConfirmDelete = async (transactionId: number) => {
    try {
      await deleteTransactionAsync(transactionId);
      setDeletingTransaction(null);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  return (
    <div id='statement' className={styles.statementContainer}>
      <div className={styles.statementHeader}>
        <span className={styles.headerTitle}>Extrato</span>
        <span className={styles.headerButtonsContainer}>
          <IconButton className={styles.headerButton} onClick={() => setIsEditing(!isEditing)}>
            <img 
              src={Edit} 
              alt="Editar" 
              height={22} 
              width={22}
            />
          </IconButton>
          <Badge 
            badgeContent={activeFiltersCount} 
            color="primary"
            invisible={activeFiltersCount === 0}
          >
            <IconButton className={styles.headerButton} onClick={handleOpenFilterModal}>
              <img 
                src={Filter} 
                alt="Filtros" 
                height={22} 
                width={22}
              />
            </IconButton>
          </Badge>
        </span>
      </div>
      <div className={styles.statementsListContainer}>
        {displayedTransactions.length === 0 ? (
          <div className={styles.noDataMessage}>
            Não há dados disponíveis
          </div>
        ) : (
          <StatementList 
            statementsByMonth={getStatementByMonth(displayedTransactions)}
            isEditing={isEditing}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            deleteTransaction={deleteTransaction}
            onLoadMore={handleLoadMore}
            hasMore={hasActiveFilters ? frontendHasMore : !!hasNextPage}
            isLoading={hasActiveFilters ? frontendLoading : isFetchingNextPage}
          />
        )}
      </div>
      
      {isFilterModalOpen && (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <FilterModal
            open={isFilterModalOpen}
            onClose={handleCloseFilterModal}
            onApplyFilters={handleApplyFilters}
            currentFilters={activeFilters}
          />
        </Suspense>
      )}

      {editingTransaction && (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <EditTransactionModal
            open={!!editingTransaction}
            transaction={editingTransaction}
            onClose={handleCloseEditModal}
            onSave={handleSaveTransaction}
            isLoading={isUpdating}
          />
        </Suspense>
      )}

      {deletingTransaction && (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <DeleteTransactionModal
            open={!!deletingTransaction}
            transaction={deletingTransaction}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            isLoading={isDeleting}
          />
        </Suspense>
      )}
    </div>
  );
}

