import { useState } from 'react';
import Select from '../../Select/Select';
import { parseMoneyValue } from '../../../utils/stringUtils';
import { useValueValidation } from '../../../utils/valueValidationUtils';
import styles from './InvestmentForm.module.scss';

const INVESTMENT_TYPES = ['Renda Fixa', 'Renda Variável'];

interface InvestmentFormProps {
  onSubmit: (data: { type: 'renda_fixa' | 'renda_variavel'; value: number }) => Promise<void>;
  isLoading?: boolean;
}

export default function InvestmentForm({ onSubmit, isLoading = false }: InvestmentFormProps) {
  const [formData, setFormData] = useState({
    type: '',
    value: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isFocused, setIsFocused] = useState(false);
  const { validateValue, filterInvalidCharacters } = useValueValidation();

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'type':
        if (!value || value.trim() === '') {
          return 'Tipo é obrigatório';
        }
        return '';
      case 'value': {
        if (!value || value.trim() === '') {
          return 'Valor é obrigatório';
        }
        const numValue = parseFloat(value.replace(',', '.'));
        if (isNaN(numValue) || numValue <= 0) {
          return 'Valor deve ser um número maior que zero';
        }
        return '';
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ type: true, value: true });

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

    const type = formData.type === 'Renda Fixa' ? 'renda_fixa' : 'renda_variavel';
    const value = parseFloat(formData.value.replace(',', '.'));

    await onSubmit({ type, value });

    setFormData({ type: '', value: '' });
    setErrors({});
    setTouched({});
  };

  const isFormValid = () => {
    return (
      !errors.type &&
      !errors.value &&
      formData.type !== '' &&
      formData.value !== ''
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Tipo de Investimento</label>
        <Select
          value={formData.type}
          placeholder="Selecione o tipo"
          options={INVESTMENT_TYPES}
          onChange={(value) => handleFieldChange('type', value)}
          onBlur={() => handleBlur('type')}
        />
        {errors.type && touched.type && (
          <span className={styles.errorText}>{errors.type}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="investment-value">
          Valor
        </label>
        <input
          id="investment-value"
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
          type="button"
          className={styles.clearButton}
          onClick={() => {
            setFormData({ type: '', value: '' });
            setErrors({});
            setTouched({});
          }}
        >
          Limpar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? 'Salvando...' : 'Adicionar Investimento'}
        </button>
      </div>
    </form>
  );
}

