// src/main/components/Statement/DeleteTransactionModal/DeleteTransactionModal.tsx
import { Transaction } from '../../../types/api';
import { parseMoneyValue } from '../../../utils/stringUtils';
import styles from './DeleteTransactionModal.module.scss';

interface DeleteTransactionModalProps {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: (transactionId: number) => Promise<void>;
  isLoading?: boolean;
}

export default function DeleteTransactionModal({
  open,
  transaction,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteTransactionModalProps) {
  if (!open || !transaction) return null;

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleConfirm = async () => {
    await onConfirm(transaction.id);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <h2 className={styles.title}>Confirmar Exclusão</h2>
        
        <div className={styles.content}>
          <p className={styles.message}>
            Tem certeza que deseja excluir esta transação?
          </p>
          
          <div className={styles.transactionInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tipo:</span>
              <span className={styles.infoValue}>
                {transaction.type === 'income' ? 'Receita' : 'Despesa'}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Categoria:</span>
              <span className={styles.infoValue}>{transaction.category}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Valor:</span>
              <span className={styles.infoValue}>
                {parseMoneyValue(transaction.value)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Data:</span>
              <span className={styles.infoValue}>
                {formatDate(transaction.date)}
              </span>
            </div>
          </div>

          <p className={styles.warning}>
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}

