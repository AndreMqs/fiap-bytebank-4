import { useEffect, useState } from "react";

import { Chip } from '@mui/material';

import Edit from "../../../images/Edit.svg";
import Delete from "../../../images/Delete.svg";
import { parseMoneyValue } from "../../../utils/stringUtils";
import { SingleStatementProps } from "../../../types/statement";

import styles from "./SingleStatement.module.scss"


export default function SingleStatement(props: SingleStatementProps) {
  const {transaction, isEditing, onEdit, onDelete, onUpdate, deleteTransaction} = props;
  const {type, date, value, category} = transaction;
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleEdit = () => {
    onEdit?.(transaction);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(transaction);
    } else if (deleteTransaction) {
      deleteTransaction(transaction.id);
    }
  };

  const handleBlur = async () => {
    setIsFocused(false);
    
    if (!isEditing || !onUpdate) return;
    
    let cleanedValue = inputValue
      .replace(/R\$/g, '')
      .replace(/\s/g, '')
      .replace(/\./g, '') 
      .replace(',', '.')
      .replace(/[^\d.-]/g, '');
    
    if (cleanedValue.startsWith('-')) {
      cleanedValue = cleanedValue.substring(1);
    }
    
    const newValue = parseFloat(cleanedValue);
    
    if (!isNaN(newValue) && newValue > 0 && Math.abs(newValue - value) > 0.01) {
      setIsSaving(true);
      try {
        await onUpdate(transaction.id, newValue);
 
        setInputValue(newValue.toString());
      } catch (error) {
        console.error('Erro ao atualizar valor da transação:', error);

        setInputValue(value.toString());
      } finally {
        setIsSaving(false);
      }
    } else if (isNaN(newValue) || newValue <= 0) {
      setInputValue(value.toString());
    } else {
  
      setInputValue(value.toString());
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    const rawValue = value.toString();
    setInputValue(rawValue);
  };

  const getInputValue = () => {
    if (isEditing && isFocused) {
      return inputValue;
    }

   
    const numValue = parseFloat(inputValue.replace(/[^\d,.-]/g, '').replace(',', '.').replace(/^-/, ''));
    const displayValue = (Number.isNaN(numValue) || numValue <= 0) ? value : numValue;
    const formattedValue = parseMoneyValue(displayValue);
    return type === 'expense' ? `- ${formattedValue}` : formattedValue;
  }

  const formatDate = (dateString: string) => {
  
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <div 
      id='singleStatement' 
      className={styles.singleStatementContainer}
    >
      <div className={styles.leftColumn}>
        <span className={styles.type}>{type === 'income' ? 'Receita' : 'Despesa'}</span>
        <span className={styles.date}>{formatDate(date)}</span>
      </div>

      <div className={styles.rightColumn}>
        <Chip 
          label={category} 
          className={styles.categoryChip}
          size="small"
        />
        <input 
          className={`${styles.inputMoney} ${type === 'expense' ? styles.expenseValue : ''} ${isSaving ? styles.saving : ''}`}
          type="text" 
          id="money" 
          name="money" 
          readOnly={!isEditing || isSaving} 
          value={getInputValue()}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={isSaving}
        />
      </div>

      {isEditing && (
        <div className={styles.actionButtons}>
          <button 
            className={styles.editButton}
            onClick={handleEdit}
            aria-label="Editar transação"
          >
            <img 
              src={Edit} 
              alt="Editar" 
              height={16} 
              width={16}
            />
          </button>
          <button 
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label="Deletar transação"
          >
            <img 
              src={Delete} 
              alt="Deletar" 
              height={16} 
              width={16}
            />
          </button>
        </div>
      )}
    </div>
  );
}

