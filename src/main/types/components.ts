import { CSVTransaction, TransactionFormData } from './transaction';

export interface NewTransactionProps {
  onTransactionAdded?: () => void;
  className?: string;
  disabled?: boolean;
}

export interface ModeSelectorProps {
  currentMode: 'manual' | 'csv';
  onModeChange: (mode: 'manual' | 'csv') => void;
}

export interface ManualTransactionFormProps {
  formData: TransactionFormData;
  isFocused: boolean;
  valueError: string;
  errors?: {
    type?: string;
    category?: string;
    value?: string;
    date?: string;
  };
  touched?: Record<string, boolean>;
  onFieldChange: (field: keyof TransactionFormData, value: string) => void;
  onValueChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
  onBlur?: (field: keyof TransactionFormData) => void;
  onClear: () => void;
}

export interface CSVTransactionPreviewProps {
  transactions: CSVTransaction[];
  onClear?: () => void;
}

export interface CSVUploadProps {
  onTransactionsLoaded: (transactions: CSVTransaction[]) => void;
} 