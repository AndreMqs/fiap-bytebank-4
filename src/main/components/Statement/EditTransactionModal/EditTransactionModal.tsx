// src/main/components/Statement/EditTransactionModal/EditTransactionModal.tsx
import { useState, useEffect } from 'react';
import { Transaction } from '../../../types/api';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '../../../utils/constants';
import Select from '../../Select/Select';
import { parseMoneyValue } from '../../../utils/stringUtils';
import { useValueValidation } from '../../../utils/valueValidationUtils';
import styles from './EditTransactionModal.module.scss';

interface EditTransactionModalProps {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (transactionId: number, data: {
    type: 'income' | 'expense';
    category: string;
    value: string;
    date: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function EditTransactionModal({
  open,
  transaction,
  onClose,
  onSave,
  isLoading = false,
}: EditTransactionModalProps) {
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    value: '',
    date: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isFocused, setIsFocused] = useState(false);
  const { validateValue, filterInvalidCharacters } = useValueValidation();

  useEffect(() => {
    if (transaction && open) {
      setFormData({
        type: transaction.type === 'income' ? 'Receita' : 'Despesa',
        category: transaction.category,
        value: transaction.value.toString(),
        date: transaction.date,
      });
      setErrors({});
      setTouched({});
    }
  }, [transaction, open]);

  if (!open || !transaction) return null;

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'type':
        if (!value || value.trim() === '') {
          return 'Tipo é obrigatório';
        }
        return '';
      case 'category':
        if (!value || value.trim() === '') {
          return 'Categoria é obrigatória';
        }
        return '';
      case 'value':
        if (!value || value.trim() === '') {
          return 'Valor é obrigatório';
        }
        const numValue = parseFloat(value.replace(',', '.'));
        if (isNaN(numValue) || numValue <= 0) {
          return 'Valor deve ser um número maior que zero';
        }
        return '';
      case 'date':
        if (!value || value.trim() === '') {
          return 'Data é obrigatória';
        }
        const dateObj = new Date(value);
        if (isNaN(dateObj.getTime())) {
          return 'Data inválida';
        }
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (dateObj > today) {
          return 'Data não pode ser futura';
        }
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error || '' }));
    }
  };

  const handleValueChange = (value: string) => {
    const filteredValue = filterInvalidCharacters(value);
    handleFieldChange('value', filteredValue);
    const validation = validateValue(filteredValue);
    setErrors(prev => ({ ...prev, value: validation.error || '' }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [field]: error || '' }));
  };

  const handleSave = async () => {

    const allTouched = {
      type: true,
      category: true,
      value: true,
      date: true,
    };
    setTouched(allTouched);

    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    const type = formData.type === 'Receita' ? 'income' : 'expense';

    await onSave(transaction.id, {
      type,
      category: formData.category,
      value: formData.value,
      date: formData.date,
    });
  };

  const isFormValid = () => {
    return (
      !errors.type &&
      !errors.category &&
      !errors.value &&
      !errors.date &&
      formData.type !== '' &&
      formData.category !== '' &&
      formData.value !== '' &&
      formData.date !== ''
    );
  };

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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <h2 className={styles.title}>Editar Transação</h2>
        
        <div className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Tipo</label>
            <Select
              value={formData.type}
              placeholder="Selecione o tipo de transação"
              options={TRANSACTION_TYPES}
              onChange={(value) => handleFieldChange('type', value)}
              onBlur={() => handleBlur('type')}
            />
            {errors.type && touched.type && (
              <span className={styles.errorText}>{errors.type}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Categoria</label>
            <Select
              value={formData.category}
              placeholder="Selecione a categoria"
              options={TRANSACTION_CATEGORIES}
              onChange={(value) => handleFieldChange('category', value)}
              onBlur={() => handleBlur('category')}
            />
            {errors.category && touched.category && (
              <span className={styles.errorText}>{errors.category}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="edit-date">
              Data
            </label>
            <input
              id="edit-date"
              type="date"
              value={formData.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              onBlur={() => handleBlur('date')}
              className={`${styles.input} ${errors.date && touched.date ? styles.inputError : ''}`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && touched.date && (
              <span className={styles.errorText}>{errors.date}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="edit-value">
              Valor
            </label>
            <input
              id="edit-value"
              type="text"
              value={getInputValue()}
              onChange={(e) => handleValueChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                handleBlur('value');
              }}
              className={`${styles.input} ${(errors.value && touched.value) ? styles.inputError : ''}`}
            />
            {(errors.value && touched.value) && (
              <span className={styles.errorText}>{errors.value}</span>
            )}
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
              className={styles.saveButton}
              onClick={handleSave}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

