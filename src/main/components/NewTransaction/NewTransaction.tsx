import { useMemo } from 'react';
import CSVUpload from '../CSVUpload/CSVUpload';
import { ModeSelector } from './ModeSelector';
import { ManualTransactionForm } from './ManualTransactionForm';
import { CSVTransactionPreview } from './CSVTransactionPreview';
import { useTransactionForm } from '../../hooks/useTransactionForm';
import { useAddTransaction } from '../../hooks/useAddTransaction';
import { useValueValidation } from '../../utils/valueValidationUtils';
import { createTransactionsFromCSV, getButtonText } from '../../utils/transactionUtils';
import { NewTransactionProps } from '../../types/components';
import { CSVTransaction } from '../../types/transaction';
import styles from "./NewTransaction.module.scss";

export default function NewTransaction({ 
  onTransactionAdded, 
  className = '', 
  disabled = false 
}: NewTransactionProps) {
  const {
    formData,
    isFocused,
    inputMode,
    csvTransactions,
    valueError,
    errors,
    touched,
    updateFormField,
    handleBlur,
    setIsFocused,
    setInputMode,
    setCsvTransactions,
    setValueError,
    clearForm,
    clearCSV,
    isFormValid
  } = useTransactionForm();

  const { addTransactionAsync, isLoading: isAddingTransaction } = useAddTransaction();
  const { validateValue, filterInvalidCharacters } = useValueValidation();

  const isMobile = useMemo(() => 
    typeof window !== "undefined" && window.screen.width <= 425, 
    []
  );

  const handleFinishTransaction = async () => {
    if (inputMode === 'manual') {
      try {
        const type = formData.type === 'Receita' ? 'income' : formData.type === 'Despesa' ? 'expense' : formData.type;
        
        const transactionData: TransactionFormData = {
          type: type as 'income' | 'expense',
          category: formData.category as 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte',
          value: formData.value,
          date: formData.date,
        };
        
        await addTransactionAsync(transactionData);
        clearForm();
        onTransactionAdded?.();
      } catch (error) {
        console.error('Erro ao adicionar transação:', error);
      }
    } else if (inputMode === 'csv' && csvTransactions.length > 0) {
      try {
        const transactions = createTransactionsFromCSV(csvTransactions);
        
        // Adicionar todas as transações
        for (const transaction of transactions) {
          const transactionData: TransactionFormData = {
            type: transaction.type,
            category: transaction.category,
            value: String(transaction.value),
            date: transaction.date,
          };
          await addTransactionAsync(transactionData);
        }
        
        clearCSV();
        setInputMode('manual');
        onTransactionAdded?.();
      } catch (error) {
        console.error('Erro ao adicionar transações do CSV:', error);
      }
    }
  };

  const handleCSVTransactionsLoaded = (transactions: CSVTransaction[]) => {
    setCsvTransactions(transactions);
  };

  const handleValueChange = (value: string) => {
    const filteredValue = filterInvalidCharacters(value);
    updateFormField('value', filteredValue);
    const validation = validateValue(filteredValue);
    setValueError(validation.error);
  };



  const buttonText = getButtonText(isMobile, inputMode, csvTransactions.length);
  const formIsValidForCSV = inputMode === 'csv' ? csvTransactions.length > 0 : true;
  const formIsValidForManual = inputMode === 'manual' ? isFormValid : formIsValidForCSV;

  return (
    <div id='newTransaction' className={`${styles.transactionContainer} ${className}`}>
      <div className={styles.transactionContent}>
        <span className={styles.title}>Nova transação</span>
        
        <ModeSelector 
          currentMode={inputMode}
          onModeChange={setInputMode}
          />

        {inputMode === 'manual' ? (
          <ManualTransactionForm
            formData={formData}
            isFocused={isFocused}
            valueError={valueError}
            errors={errors}
            touched={touched}
            onFieldChange={updateFormField}
            onValueChange={handleValueChange}
            onFocusChange={setIsFocused}
            onBlur={handleBlur}
            onClear={clearForm}
          />
        ) : (
          <>
            <CSVUpload onTransactionsLoaded={handleCSVTransactionsLoaded} />
            <CSVTransactionPreview 
              transactions={csvTransactions}
              onClear={clearCSV}
          />
          </>
        )}

        <div className={styles.buttonContainer}>
          {inputMode === 'manual' && (
            <button 
              className={styles.clearButton}
              onClick={clearForm}
            >
              Limpar
            </button>
          )}
          {inputMode === 'csv' && csvTransactions.length > 0 && (
            <button 
              className={styles.clearButton}
              onClick={clearCSV}
            >
              Limpar CSV
            </button>
          )}
        <button 
          className={styles.finishTransaction}
          onClick={handleFinishTransaction}
          disabled={!formIsValidForManual || disabled || isAddingTransaction}
        >
          {isAddingTransaction ? 'Salvando...' : buttonText}
        </button>
        </div>
      </div>
    </div>
  );
}

