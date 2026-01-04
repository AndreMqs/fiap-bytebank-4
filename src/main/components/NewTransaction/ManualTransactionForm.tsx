import { parseMoneyValue } from '../../utils/stringUtils';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '../../utils/constants';
import Select from '../Select/Select';
import { ManualTransactionFormProps } from '../../types/components';

import styles from './NewTransaction.module.scss';

export const ManualTransactionForm = ({
  formData,
  isFocused,
  valueError,
  errors,
  touched,
  onFieldChange,
  onValueChange,
  onFocusChange,
  onBlur,
}: ManualTransactionFormProps) => {
  const getInputValue = () => {
    if (isFocused) {
      return formData.value;
    }

    const value = parseFloat(formData.value.replace(',', '.'));
    if (Number.isNaN(value) || value <= 0) {
      return parseMoneyValue(0);
    }

    return parseMoneyValue(value);
  };

  return (
    <>
      <span className={styles.selectContainer}>
        <label 
          htmlFor="type" 
          className={styles.inputLabel}
        >
          Tipo
        </label>
        <Select 
          value={formData.type}
          placeholder="Selecione o tipo de transação"
          options={TRANSACTION_TYPES}
          onChange={(value) => onFieldChange('type', value)}
          onBlur={() => onBlur?.('type')}
        />
        {errors?.type && touched?.type && (
          <span className={styles.errorText}>{errors.type}</span>
        )}
      </span>
      <span className={styles.selectContainer}>
        <label 
          htmlFor="category" 
          className={styles.inputLabel}
        >
          Categoria
        </label>
        <Select 
          value={formData.category}
          placeholder="Selecione a categoria"
          options={TRANSACTION_CATEGORIES}
          onChange={(value) => onFieldChange('category', value)}
          onBlur={() => onBlur?.('category')}
        />
        {errors?.category && touched?.category && (
          <span className={styles.errorText}>{errors.category}</span>
        )}
      </span>
      <span className={styles.inputContainer}>
        <label 
          htmlFor="date" 
          id='date' 
          className={styles.inputLabel}
        >
          Data
        </label>
        <input 
          type="date" 
          value={formData.date}
          onChange={(e) => onFieldChange('date', e.target.value)}
          onBlur={() => onBlur?.('date')}
          className={`${styles.inputValue} ${errors?.date && touched?.date ? styles.inputError : ''}`}
          max={new Date().toISOString().split('T')[0]}
        />
        {errors?.date && touched?.date && (
          <span className={styles.errorText}>{errors.date}</span>
        )}
      </span>
      <span className={styles.inputContainer}>
        <label 
          htmlFor="value" 
          id='value' 
          className={styles.inputLabel}
        >
          Valor
        </label>
        <input 
          type="text" 
          value={getInputValue()}
          onChange={(e) => onValueChange(e.target.value)}
          className={`${styles.inputValue} ${(valueError || (errors?.value && touched?.value)) ? styles.inputError : ''}`}
          onFocus={() => onFocusChange(true)}
          onBlur={() => {
            onFocusChange(false);
            onBlur?.('value');
          }}
        />
        {(valueError || (errors?.value && touched?.value)) && (
          <span className={styles.errorText}>{valueError || errors?.value}</span>
        )}
      </span>
    </>
  );
}; 