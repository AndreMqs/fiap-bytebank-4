import { useState } from 'react';
import { CSVTransaction, TransactionFormData } from '../types/transaction';

export interface FormErrors {
  type?: string;
  category?: string;
  value?: string;
  date?: string;
}

export const useTransactionForm = () => {
  
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<TransactionFormData>({
    type: '',
    category: '',
    value: '',
    date: getCurrentDate()
  });
  
  const [isFocused, setIsFocused] = useState(false);
  const [inputMode, setInputMode] = useState<'manual' | 'csv'>('manual');
  const [csvTransactions, setCsvTransactions] = useState<CSVTransaction[]>([]);
  const [valueError, setValueError] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateType = (type: string): string => {
    if (!type || type.trim() === '') {
      return 'Tipo é obrigatório';
    }
    const validTypes = ['Receita', 'Despesa', 'income', 'expense'];
    if (!validTypes.includes(type)) {
      return 'Tipo deve ser Receita ou Despesa';
    }
    return '';
  };

  const validateCategory = (category: string): string => {
    if (!category || category.trim() === '') {
      return 'Categoria é obrigatória';
    }
    return '';
  };

  const validateValue = (value: string): string => {
    if (!value || value.trim() === '') {
      return 'Valor é obrigatório';
    }
    const numValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numValue) || numValue <= 0) {
      return 'Valor deve ser um número maior que zero';
    }
    return '';
  };

  const validateDate = (date: string): string => {
    if (!date || date.trim() === '') {
      return 'Data é obrigatória';
    }
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (dateObj > today) {
      return 'Data não pode ser futura';
    }
    return '';
  };

  const validateField = (field: keyof TransactionFormData, value: string): string => {
    switch (field) {
      case 'type':
        return validateType(value);
      case 'category':
        return validateCategory(value);
      case 'value':
        return validateValue(value);
      case 'date':
        return validateDate(value);
      default:
        return '';
    }
  };

  const updateFormField = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = validateField(field, value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (field: keyof TransactionFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateField(field as keyof TransactionFormData, formData[field as keyof TransactionFormData]);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      type: true,
      category: true,
      value: true,
      date: true,
    });

    return isValid;
  };

  const clearForm = () => {
    setFormData({
      type: '',
      category: '',
      value: '',
      date: getCurrentDate()
    });
    setValueError('');
    setErrors({});
    setTouched({});
  };

  const clearCSV = () => {
    setCsvTransactions([]);
  };

  const isFormValid = (): boolean => {
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

  return {
    formData,
    isFocused,
    inputMode,
    csvTransactions,
    valueError,
    errors,
    touched,
    updateFormField,
    handleBlur,
    validateAllFields,
    setIsFocused,
    setInputMode,
    setCsvTransactions,
    setValueError,
    clearForm,
    clearCSV,
    isFormValid: isFormValid()
  };
}; 